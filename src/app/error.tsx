"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="text-6xl" aria-hidden>🚧</span>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">Something went wrong</h1>
      <p className="mt-2 text-ink-soft">We hit a snag loading this page. Give it another try in a moment.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn-primary">Try again</button>
        <Link href="/" className="btn-secondary">Home</Link>
      </div>
    </div>
  );
}
