"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getBookById } from "@/lib/books/queries";
import { getAuthenticatedSupabase } from "@/lib/supabase/auth";
import {
  validateBookForm,
  validateReadingUpdateForm,
  type BookFormErrors,
  type BookFormValues,
  type ReadingUpdateErrors,
  type ReadingUpdateValues,
} from "@/lib/books/validation";

export type CreateBookState = {
  values: BookFormValues;
  errors: BookFormErrors;
  message: string;
};

export async function createBook(
  previousState: CreateBookState,
  formData: FormData,
): Promise<CreateBookState> {
  void previousState;

  const validation = validateBookForm(formData);
  const context = await getAuthenticatedSupabase();

  if (!context) {
    redirect("/login");
  }

  if (!validation.input) {
    return {
      values: validation.values,
      errors: validation.errors,
      message: "请检查表单中的信息。",
    };
  }

  const { data: bookId, error } = await context.supabase.rpc(
    "create_book_with_progress",
    {
      p_title: validation.input.title,
      p_author: validation.input.author,
      p_reading_status: validation.input.readingStatus,
      p_total_pages: validation.input.totalPages,
      p_current_page: validation.input.currentPage,
    },
  );

  if (error || typeof bookId !== "string" || !bookId) {
    return {
      values: validation.values,
      errors: {},
      message: "暂时无法添加这本书，请稍后重试。",
    };
  }

  revalidatePath("/library");
  redirect(`/library/${bookId}`);
}

export type UpdateReadingState = {
  values: ReadingUpdateValues;
  errors: ReadingUpdateErrors;
  message: string;
  success: boolean;
};

export async function updateReadingProgress(
  bookId: string,
  previousState: UpdateReadingState,
  formData: FormData,
): Promise<UpdateReadingState> {
  void previousState;

  const context = await getAuthenticatedSupabase();

  if (!context) {
    redirect("/login");
  }

  const { book, error: bookError } = await getBookById(bookId);

  if (bookError || !book) {
    return {
      values: {
        currentPage: String(formData.get("current_page") ?? ""),
        readingStatus: String(formData.get("reading_status") ?? ""),
      },
      errors: {},
      message: "无法保存这本书，请返回书架后重试。",
      success: false,
    };
  }

  const validation = validateReadingUpdateForm(formData, book.totalPages);

  if (!validation.input) {
    return {
      values: validation.values,
      errors: validation.errors,
      message: "请检查阅读进度信息。",
      success: false,
    };
  }

  const { error: updateError } = await context.supabase.rpc(
    "update_book_reading_state",
    {
      p_book_id: book.id,
      p_current_page: validation.input.currentPage,
      p_reading_status: validation.input.readingStatus,
    },
  );

  if (updateError) {
    return {
      values: validation.values,
      errors: {},
      message: "暂时无法保存阅读进度，请稍后重试。",
      success: false,
    };
  }

  revalidatePath("/library");
  revalidatePath(`/library/${book.id}`);

  return {
    values: {
      currentPage: String(validation.input.currentPage),
      readingStatus: validation.input.readingStatus,
    },
    errors: {},
    message: "阅读进度已保存。",
    success: true,
  };
}
