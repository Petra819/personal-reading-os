"use client";

import { useActionState } from "react";
import { updateReadingProgress, type UpdateReadingState } from "../actions";
import {
  readingStatuses,
  readingStatusLabels,
  type ReadingStatus,
} from "@/lib/books/types";

type ReadingProgressFormProps = {
  bookId: string;
  currentPage: number;
  totalPages: number;
  readingStatus: ReadingStatus;
};

export function ReadingProgressForm({
  bookId,
  currentPage,
  totalPages,
  readingStatus,
}: ReadingProgressFormProps) {
  const initialState: UpdateReadingState = {
    values: {
      currentPage: String(currentPage),
      readingStatus,
    },
    errors: {},
    message: "",
    success: false,
  };
  const updateForBook = updateReadingProgress.bind(null, bookId);
  const [state, formAction, pending] = useActionState(updateForBook, initialState);
  const messageId = state.message ? "reading-update-message" : undefined;

  return (
    <form
      className="reading-update-form"
      action={formAction}
      aria-busy={pending}
      aria-describedby={messageId}
    >
      <fieldset className="reading-update-fields" disabled={pending}>
        <div className="form-field">
          <label htmlFor="current-page">当前页数</label>
          <input
            id="current-page"
            name="current_page"
            type="number"
            inputMode="numeric"
            min="0"
            max={totalPages}
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

        <div className="reading-total-field" aria-label={`总页数 ${totalPages} 页`}>
          <span>总页数</span>
          <strong>{totalPages}<small> 页</small></strong>
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
      </fieldset>

      {state.message && (
        <p
          id="reading-update-message"
          className={state.success ? "form-success" : "form-error"}
          role={state.success ? "status" : "alert"}
          aria-live="polite"
        >
          {state.message}
        </p>
      )}

      <button className="button button-primary reading-update-submit" type="submit" disabled={pending}>
        {pending ? "正在保存…" : "保存阅读进度"}
      </button>
    </form>
  );
}
