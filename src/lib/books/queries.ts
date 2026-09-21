import { redirect } from "next/navigation";
import { getAuthenticatedSupabase } from "@/lib/supabase/auth";
import { calculateReadingPercentage, type Book, type ReadingStatus } from "./types";

const bookSelect = `
  id,
  title,
  author,
  reading_status,
  total_pages,
  finished_at,
  created_at,
  updated_at,
  progress:reading_progress!reading_progress_book_owner_fkey (
    current_page,
    last_read_at,
    updated_at
  )
`;

type ProgressRow = {
  current_page: number;
  last_read_at: string | null;
  updated_at: string;
};

type BookRow = {
  id: string;
  title: string;
  author: string | null;
  reading_status: ReadingStatus;
  total_pages: number;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
  progress: ProgressRow | ProgressRow[] | null;
};

function mapBook(row: BookRow): Book {
  const progress = Array.isArray(row.progress) ? row.progress[0] : row.progress;
  const currentPage = progress?.current_page ?? 0;

  return {
    id: row.id,
    title: row.title,
    author: row.author,
    readingStatus: row.reading_status,
    totalPages: row.total_pages,
    currentPage,
    progressPercentage: calculateReadingPercentage(currentPage, row.total_pages),
    finishedAt: row.finished_at,
    lastReadAt: progress?.last_read_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function requireAuthenticatedSupabase() {
  const context = await getAuthenticatedSupabase();

  if (!context) {
    redirect("/login");
  }

  return context;
}

export async function getBooks() {
  const { supabase, userId } = await requireAuthenticatedSupabase();
  const { data, error } = await supabase
    .from("books")
    .select(bookSelect)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error || !data) {
    return {
      books: [] as Book[],
      error: "书架暂时无法加载，请稍后重试。",
    };
  }

  return {
    books: (data as unknown as BookRow[]).map(mapBook),
    error: null,
  };
}

export async function getBookById(bookId: string) {
  const { supabase, userId } = await requireAuthenticatedSupabase();

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(bookId)) {
    return { book: null, error: null };
  }

  const { data, error } = await supabase
    .from("books")
    .select(bookSelect)
    .eq("id", bookId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return {
      book: null,
      error: "这本书暂时无法读取，请稍后重试。",
    };
  }

  return {
    book: data ? mapBook(data as unknown as BookRow) : null,
    error: null,
  };
}
