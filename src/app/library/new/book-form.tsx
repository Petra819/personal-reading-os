"use client";

import Link from "next/link";
import { useActionState } from "react";
import { readingStatuses, readingStatusLabels } from "@/lib/books/types";
import { createBook, type CreateBookState } from "../actions";

const initialState: CreateBookState = {
  values: {
    title: "",
    author: "",
    readingStatus: "want_to_read",
    totalPages: "",
    currentPage: "0",
  },
  errors: {},
  message: "",
};

export function BookForm() {
  const [state, formAction, pending] = useActionState(createBook, initialState);
  const formErrorId = state.message ? "book-form-error" : undefined;

  return (
    <form
      className="book-form"
      action={formAction}
      aria-busy={pending}
      aria-describedby={formErrorId}
    >
      <fieldset className="book-form-fields" disabled={pending}>
        <div className="form-field">
          <label htmlFor="title">书名</label>
          <input
            id="title"
            name="title"
            type="text"
            autoComplete="off"
            defaultValue={state.values.title}
            aria-invalid={Boolean(state.errors.title)}
            aria-describedby={state.errors.title ? "title-error" : undefined}
            autoFocus
            required
          />
          {state.errors.title && (
            <p id="title-error" className="field-error">{state.errors.title}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="author">作者 <span className="field-optional">可选</span></label>
          <input
            id="author"
            name="author"
            type="text"
            autoComplete="off"
            defaultValue={state.values.author}
          />
        </div>

        <div className="form-field">
          <label htmlFor="reading-status">阅读状态</label>
          <select
            id="reading-status"
            name="reading_status"
            defaultValue={state.values.readingStatus}
            aria-invalid={Boolean(state.errors.readingStatus)}
            aria-describedby={state.errors.readingStatus ? "reading-status-error" : undefined}
            required
          >
            {readingStatuses.map((status) => (
              <option value={status} key={status}>{readingStatusLabels[status]}</option>
            ))}
          </select>
          {state.errors.readingStatus && (
            <p id="reading-status-error" className="field-error">{state.errors.readingStatus}</p>
          )}
        </div>

        <div className="book-form-pages">
          <div className="form-field">
            <label htmlFor="total-pages">总页数</label>
            <input
              id="total-pages"
              name="total_pages"
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              defaultValue={state.values.totalPages}
              aria-invalid={Boolean(state.errors.totalPages)}
              aria-describedby={state.errors.totalPages ? "total-pages-error" : undefined}
              required
            />
            {state.errors.totalPages && (
              <p id="total-pages-error" className="field-error">{state.errors.totalPages}</p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="current-page">当前页数</label>
            <input
              id="current-page"
              name="current_page"
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              defaultValue={state.values.currentPage}
              aria-invalid={Boolean(state.errors.currentPage)}
              aria-describedby={state.errors.currentPage ? "current-page-error" : undefined}
              required
            />
            {state.errors.currentPage && (
              <p id="current-page-error" className="field-error">{state.errors.currentPage}</p>
            )}
          </div>
        </div>
      </fieldset>

      {state.message && (
        <p id="book-form-error" className="form-error" role="alert" aria-live="polite">
          {state.message}
        </p>
      )}

      <div className="book-form-actions">
        <button className="button button-primary" type="submit" disabled={pending}>
          {pending ? "正在添加…" : "添加到书架"}
        </button>
        <Link className="button button-secondary" href="/library">
          返回书架
        </Link>
      </div>
    </form>
  );
}
