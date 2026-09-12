"use client";

import { useEffect, useState } from "react";
import { MicIcon } from "@/components/icons";

/** UI placeholder only — no speech recognition yet. */
export function DictationButton() {
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!listening) return;
    const timer = setTimeout(() => setListening(false), 3000);
    return () => clearTimeout(timer);
  }, [listening]);

  return (
    <div className="flex items-center gap-2">
      <span aria-live="polite" className="text-xs text-ink-soft">
        {listening ? "Voice dictation is coming soon" : ""}
      </span>
      <button
        type="button"
        onClick={() => setListening(true)}
        className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-bold transition ${
          listening ? "animate-pulse border-tomato bg-tomato text-white" : "border-line bg-white hover:border-ink"
        }`}
      >
        <MicIcon className="h-3.5 w-3.5" />
        {listening ? "Listening…" : "Dictate"}
      </button>
    </div>
  );
}
