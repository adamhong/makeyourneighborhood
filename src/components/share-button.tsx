"use client";

import { useState } from "react";
import { ShareIcon } from "@/components/icons";

export function ShareButton({ title, className = "" }: { title: string; className?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function handleShare() {
    const url = `${window.location.origin}${window.location.pathname}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text: `Help make this happen in SF: ${title}`, url });
      } catch {
        // The user closed the share sheet.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <button type="button" onClick={handleShare} className={`btn-secondary ${className}`}>
      <ShareIcon className="h-4 w-4" />
      <span aria-live="polite">
        {status === "copied" ? "Link copied!" : status === "failed" ? "Couldn't copy link" : "Share with neighbors"}
      </span>
    </button>
  );
}
