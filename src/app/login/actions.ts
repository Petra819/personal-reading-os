"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  email: string;
  errors: {
    email?: string;
    password?: string;
  };
  message: string;
};

export async function signIn(
  previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  void previousState;

  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");
  const email = typeof rawEmail === "string" ? rawEmail.trim() : "";
  const password = typeof rawPassword === "string" ? rawPassword : "";
  const errors: LoginState["errors"] = {};

  if (!email) {
    errors.email = "请输入邮箱。";
  }

  if (!password) {
    errors.password = "请输入密码。";
  }

  if (Object.keys(errors).length > 0) {
    return {
      email,
      errors,
      message: "请填写邮箱和密码。",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      email,
      errors: {},
      message: "登录失败，请检查邮箱和密码后重试。",
    };
  }

  redirect("/");
}
