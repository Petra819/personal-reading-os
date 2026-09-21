begin;

create function public.update_book_reading_state(
  p_book_id uuid,
  p_current_page integer,
  p_reading_status text
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  book_total_pages integer;
begin
  if current_user_id is null then
    raise exception 'Authentication is required.'
      using errcode = '42501';
  end if;

  if p_book_id is null then
    raise exception 'Book id is required.'
      using errcode = '22023';
  end if;

  if p_current_page is null or p_current_page < 0 then
    raise exception 'Current page must be zero or greater.'
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

  select books.total_pages
  into book_total_pages
  from public.books
  where books.id = p_book_id
    and books.user_id = current_user_id
  for no key update;

  if not found then
    raise exception 'Book not found.'
      using errcode = 'P0002';
  end if;

  if p_current_page > book_total_pages then
    raise exception 'Current page cannot exceed total pages.'
      using errcode = '22023';
  end if;

  update public.reading_progress
  set current_page = p_current_page
  where book_id = p_book_id
    and user_id = current_user_id;

  if not found then
    raise exception 'Reading progress not found.'
      using errcode = 'P0002';
  end if;

  update public.books
  set reading_status = p_reading_status
  where id = p_book_id
    and user_id = current_user_id;

  if not found then
    raise exception 'Book not found.'
      using errcode = 'P0002';
  end if;
end;
$$;

comment on function public.update_book_reading_state(uuid, integer, text) is
  'Atomically updates the authenticated user''s manual page and reading status.';

revoke execute on function public.update_book_reading_state(uuid, integer, text)
  from public, anon;

grant execute on function public.update_book_reading_state(uuid, integer, text)
  to authenticated;

commit;
