"use client";

import { useActionState, useState } from "react";
import { addInvestmentInterest, type FormState } from "@/app/actions";
import { InvestmentDisclaimer } from "@/components/investment-disclaimer";

const initialState: FormState = {};

export function InvestPanel({ proposalId }: { proposalId: number }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(addInvestmentInterest, initialState);
  const errors = state.errors ?? {};

  if (!open) {
    return (
      <div className="mt-4">
        <button type="button" onClick={() => setOpen(true)} className="btn-secondary w-full py-3">
          💸 I&apos;d invest
        </button>
        <InvestmentDisclaimer className="mt-3" />
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-4 space-y-3">
      <input type="hidden" name="proposalId" value={proposalId} />
      <p className="font-display text-lg font-bold">Express interest in investing</p>

      {state.ok && (
        <p role="status" className="rounded-2xl bg-mint px-4 py-3 text-sm font-semibold text-leaf">
          {state.message}
        </p>
      )}
      {!state.ok && state.message && (
        <p role="alert" className="field-error">{state.message}</p>
      )}

      <div>
        <label htmlFor="invest-name" className="field-label">Name</label>
        <input id="invest-name" name="name" required autoComplete="name" className="field py-2.5" />
        {errors.name && <p className="field-error">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="invest-email" className="field-label">Email</label>
        <input id="invest-email" name="email" type="email" required autoComplete="email" className="field py-2.5" />
        {errors.email && <p className="field-error">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="invest-amount" className="field-label">
          Pledge amount <span className="font-normal text-ink-soft">(optional)</span>
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-ink-soft">$</span>
          <input id="invest-amount" name="amount" inputMode="decimal" placeholder="500" className="field py-2.5 pl-8" />
        </div>
        {errors.amount && <p className="field-error">{errors.amount}</p>}
      </div>
      <div>
        <label htmlFor="invest-note" className="field-label">
          Comment <span className="font-normal text-ink-soft">(optional)</span>
        </label>
        <textarea id="invest-note" name="note" rows={2} className="field py-2.5" placeholder="Time, skills, or connections you could offer" />
      </div>

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Sending…" : "Share my interest"}
      </button>
      <InvestmentDisclaimer />
    </form>
  );
}
