begin;

create table public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  author text,
  reading_status text not null default 'want_to_read',
  total_pages integer not null,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint books_title_not_blank check (char_length(btrim(title)) > 0),
  constraint books_reading_status_valid check (
    reading_status in ('want_to_read', 'reading', 'finished', 'paused')
  ),
  constraint books_total_pages_positive check (total_pages > 0),
  constraint books_id_user_id_unique unique (id, user_id)
);

create table public.reading_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id uuid not null,
  current_page integer not null default 0,
  last_read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reading_progress_current_page_nonnegative check (current_page >= 0),
  constraint reading_progress_user_book_unique unique (user_id, book_id),
  constraint reading_progress_book_owner_fkey
    foreign key (book_id, user_id)
    references public.books (id, user_id)
    on delete cascade
);

comment on column public.reading_progress.current_page is
  'V0.2 manual page number; not an EPUB/PDF reader location.';

create index books_user_status_updated_idx
  on public.books (user_id, reading_status, updated_at desc);

create index reading_progress_user_last_read_idx
  on public.reading_progress (user_id, last_read_at desc);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();

  if tg_table_schema = 'public' and tg_table_name = 'books' then
    if new.reading_status = 'finished' and new.finished_at is null then
      new.finished_at = now();
    elsif new.reading_status <> 'finished' then
      new.finished_at = null;
    end if;
  end if;

  return new;
end;
$$;

create trigger books_set_updated_at
before insert or update on public.books
for each row
execute function public.set_updated_at();

create trigger reading_progress_set_updated_at
before update on public.reading_progress
for each row
execute function public.set_updated_at();

create function public.validate_reading_progress_page()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  book_total_pages integer;
begin
  select books.total_pages
  into book_total_pages
  from public.books
  where books.id = new.book_id
    and books.user_id = new.user_id
  for key share;

  if not found then
    raise exception 'The referenced book does not exist or belongs to another user.'
      using errcode = '23503';
  end if;

  if new.current_page > book_total_pages then
    raise exception 'Current page (%) cannot exceed total pages (%).',
      new.current_page,
      book_total_pages
      using errcode = '23514';
  end if;

  if (
    tg_op = 'INSERT'
    and new.current_page > 0
    and new.last_read_at is null
  ) or (
    tg_op = 'UPDATE'
    and new.current_page is distinct from old.current_page
  ) then
    new.last_read_at = now();
  end if;

  return new;
end;
$$;

create trigger reading_progress_validate_page
before insert or update of user_id, book_id, current_page
on public.reading_progress
for each row
execute function public.validate_reading_progress_page();

create function public.validate_book_total_pages()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  progress_current_page integer;
begin
  select reading_progress.current_page
  into progress_current_page
  from public.reading_progress
  where reading_progress.book_id = new.id
    and reading_progress.user_id = new.user_id
  -- This conflicts with current_page updates while FOR KEY SHARE on books
  -- allows total_pages updates, avoiding an opposite row-lock order.
  for share;

  if found and progress_current_page > new.total_pages then
    raise exception 'Total pages (%) cannot be less than the current page.',
      new.total_pages
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger books_validate_total_pages
before update of total_pages on public.books
for each row
when (new.total_pages is distinct from old.total_pages)
execute function public.validate_book_total_pages();

alter table public.books enable row level security;
alter table public.reading_progress enable row level security;

revoke all on table public.books from public, anon, authenticated;
revoke all on table public.reading_progress from public, anon, authenticated;

grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.books to authenticated;
grant select, insert, update, delete on table public.reading_progress to authenticated;

create policy books_select_own
on public.books
for select
to authenticated
using (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
);

create policy books_insert_own
on public.books
for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
);

create policy books_update_own
on public.books
for update
to authenticated
using (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
)
with check (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
);

create policy books_delete_own
on public.books
for delete
to authenticated
using (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
);

create policy reading_progress_select_own
on public.reading_progress
for select
to authenticated
using (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
);

create policy reading_progress_insert_own
on public.reading_progress
for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
);

create policy reading_progress_update_own
on public.reading_progress
for update
to authenticated
using (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
)
with check (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
);

create policy reading_progress_delete_own
on public.reading_progress
for delete
to authenticated
using (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
);

create function public.create_book_with_progress(
  p_title text,
  p_total_pages integer,
  p_author text default null,
  p_reading_status text default 'want_to_read',
  p_current_page integer default 0
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  new_book_id uuid;
  normalized_title text := btrim(p_title);
  normalized_author text := nullif(btrim(p_author), '');
begin
  if current_user_id is null then
    raise exception 'Authentication is required.'
      using errcode = '42501';
  end if;

  if normalized_title is null or char_length(normalized_title) = 0 then
    raise exception 'Book title cannot be empty.'
      using errcode = '22023';
  end if;

  if p_total_pages is null or p_total_pages <= 0 then
    raise exception 'Total pages must be greater than zero.'
      using errcode = '22023';
  end if;

  if p_reading_status is null or p_reading_status not in (
    'want_to_read',
    'reading',
    'finished',
    'paused'
  ) then
    raise exception 'Invalid reading status.'
      using errcode = '22023';
  end if;

  if p_current_page is null or p_current_page < 0 then
    raise exception 'Current page must be zero or greater.'
      using errcode = '22023';
  end if;

  if p_current_page > p_total_pages then
    raise exception 'Current page cannot exceed total pages.'
      using errcode = '22023';
  end if;

  insert into public.books (
    user_id,
    title,
    author,
    reading_status,
    total_pages
  )
  values (
    current_user_id,
    normalized_title,
    normalized_author,
    p_reading_status,
    p_total_pages
  )
  returning id into new_book_id;

  insert into public.reading_progress (
    user_id,
    book_id,
    current_page
  )
  values (
    current_user_id,
    new_book_id,
    p_current_page
  );

  return new_book_id;
end;
$$;

revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.validate_reading_progress_page() from public, anon, authenticated;
revoke execute on function public.validate_book_total_pages() from public, anon, authenticated;
revoke execute on function public.create_book_with_progress(text, integer, text, text, integer)
  from public, anon;

grant execute on function public.create_book_with_progress(text, integer, text, text, integer)
  to authenticated;

commit;
