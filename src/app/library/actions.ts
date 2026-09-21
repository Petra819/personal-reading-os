"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthenticatedSupabase } from "@/lib/supabase/auth";
import {
  validateBookForm,
  type BookFormErrors,
  type BookFormValues,
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
