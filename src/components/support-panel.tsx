"use client";

import { useOptimistic, useState, useTransition } from "react";
import { supportProposal } from "@/app/actions";
import { HeartIcon } from "@/components/icons";
import { MOMENTUM_THRESHOLD } from "@/lib/constants";

export function SupportPanel({ proposalId, supportCount }: { proposalId: number; supportCount: number }) {
  const [count, addSupport] = useOptimistic(supportCount, (current, increment: number) => current + increment);
  const [supported, setSupported] = useState(false);
  const [isPending, startTransition] = useTransition();

  const progress = Math.min(count / MOMENTUM_THRESHOLD, 1);
  const remaining = Math.max(MOMENTUM_THRESHOLD - count, 0);

  function handleSupport() {
    setSupported(true);
    startTransition(async () => {
      addSupport(1);
      await supportProposal(proposalId);
    });
  }

  return (
    <div>
      <p className="font-display text-5xl font-extrabold leading-none">{count}</p>
      <p className="mt-1 font-bold text-ink-soft">{count === 1 ? "neighbor wants" : "neighbors want"} this</p>

      <div
        role="progressbar"
        aria-label="Progress toward community momentum"
        aria-valuemin={0}
        aria-valuemax={MOMENTUM_THRESHOLD}
        aria-valuenow={Math.min(count, MOMENTUM_THRESHOLD)}
        className="mt-4 h-3 overflow-hidden rounded-full bg-cream ring-1 ring-line"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-sun to-tomato transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-ink-soft">
        {remaining > 0 ? `${remaining} more to reach community momentum` : "Community momentum reached 🎉"}
      </p>

      <button
        type="button"
        onClick={handleSupport}
        disabled={supported || isPending}
        aria-pressed={supported}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-display text-lg font-bold transition ${
          supported
            ? "bg-mint text-leaf"
            : "bg-tomato text-white shadow-[0_5px_0_0_var(--color-tomato-dark)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
        }`}
      >
        <HeartIcon filled={supported} className="h-5 w-5" />
        {supported ? "You want this!" : "I want this"}
      </button>
    </div>
  );
}
