"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "./actions";

const initialState: LoginState = {
  email: "",
  errors: {},
  message: "",
};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const formErrorId = state.message ? "login-form-error" : undefined;

  return (
    <form className="login-form" action={formAction} aria-describedby={formErrorId}>
      <div className="form-field">
        <label htmlFor="email">邮箱</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.email}
          aria-invalid={Boolean(state.errors.email)}
          aria-describedby={state.errors.email ? "email-error" : undefined}
          autoFocus
          required
        />
        {state.errors.email && (
          <p id="email-error" className="field-error">{state.errors.email}</p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="password">密码</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(state.errors.password)}
          aria-describedby={state.errors.password ? "password-error" : undefined}
          required
        />
        {state.errors.password && (
          <p id="password-error" className="field-error">{state.errors.password}</p>
        )}
      </div>

      {state.message && (
        <p id="login-form-error" className="form-error" role="alert" aria-live="polite">
          {state.message}
        </p>
      )}

      <button className="button button-primary login-submit" type="submit" disabled={pending}>
        {pending ? "正在登录…" : "登录"}
      </button>
    </form>
  );
}
