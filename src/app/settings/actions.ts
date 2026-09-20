"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SignOutState = {
  message: string;
};

export async function signOut(
  previousState: SignOutState,
  formData: FormData,
): Promise<SignOutState> {
  void previousState;
  void formData;

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims?.sub) {
    redirect("/login");
  }

  const { error } = await supabase.auth.signOut({ scope: "local" });

  if (error) {
    return { message: "退出失败，请稍后重试。" };
  }

  redirect("/login");
}
