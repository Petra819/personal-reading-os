"use client";

import { useActionState } from "react";
import { signOut, type SignOutState } from "./actions";

const initialState: SignOutState = { message: "" };

export function SignOutForm() {
  const [state, formAction, pending] = useActionState(signOut, initialState);

  return (
    <form className="settings-actions" action={formAction}>
      <button className="button button-secondary" type="submit" disabled={pending}>
        {pending ? "正在退出…" : "退出登录"}
      </button>
      {state.message && <p className="settings-error" role="alert">{state.message}</p>}
    </form>
  );
}
