"use client";

import { useActionState } from "react";
import { addComment, type FormState } from "@/app/actions";

const initialState: FormState = {};

export function CommentForm({ proposalId }: { proposalId: number }) {
  const [state, formAction, pending] = useActionState(addComment, initialState);
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="proposalId" value={proposalId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="comment-name" className="field-label">Name</label>
          <input id="comment-name" name="authorName" required autoComplete="name" className="field py-2.5" />
          {errors.authorName && <p className="field-error">{errors.authorName}</p>}
        </div>
        <div>
          <label htmlFor="comment-email" className="field-label">
            Email <span className="font-normal text-ink-soft">(optional, never shown)</span>
          </label>
          <input id="comment-email" name="email" type="email" autoComplete="email" className="field py-2.5" />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="comment-body" className="field-label">Comment</label>
        <textarea
          id="comment-body"
          name="body"
          required
          rows={3}
          className="field"
          placeholder="What do you love about this idea? What would make it work?"
        />
        {errors.body && <p className="field-error">{errors.body}</p>}
      </div>
      <div className="flex flex-wrap items-center justify-end gap-3">
        {state.message && (
          <p role="status" className={`mr-auto text-sm font-semibold ${state.ok ? "text-leaf" : "text-tomato-dark"}`}>
            {state.message}
          </p>
        )}
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Posting…" : "Post comment"}
        </button>
      </div>
    </form>
  );
}
