"use client";

/* eslint-disable @next/next/no-img-element -- previews use blob: and arbitrary URLs */

import { useEffect, useState } from "react";

type ImageFieldProps = {
  /** Field prefix; the form sends `${name}Mode`, `${name}File`, and `${name}Url`. */
  name: string;
  label: string;
  hint?: string;
  error?: string;
};

export function ImageField({ name, label, hint, error }: ImageFieldProps) {
  const [mode, setMode] = useState<"upload" | "link">("upload");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const preview = mode === "upload" ? filePreview : /^https?:\/\/\S+$/.test(url.trim()) ? url.trim() : null;

  return (
    <div>
      <input type="hidden" name={`${name}Mode`} value={mode} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="field-label mb-0">{label}</span>
        <div className="inline-flex rounded-full bg-cream p-1 text-xs font-bold ring-1 ring-line">
          {(["upload", "link"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              aria-pressed={mode === option}
              className={`rounded-full px-3 py-1 transition ${mode === option ? "bg-white shadow-sm" : "text-ink-soft"}`}
            >
              {option === "upload" ? "Upload photo" : "Paste link"}
            </button>
          ))}
        </div>
      </div>
      {hint && <p className="mt-1 text-sm text-ink-soft">{hint}</p>}

      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_10rem]">
        <div hidden={mode !== "upload"}>
          <label className="flex h-full cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-line bg-white px-4 py-7 text-center transition hover:border-tomato focus-within:border-tomato">
            <span className="text-2xl" aria-hidden>📷</span>
            <span className="font-bold">Choose a photo</span>
            <span className="text-xs text-ink-soft">JPG, PNG, WebP or GIF · up to 25 MB</span>
            <input
              type="file"
              name={`${name}File`}
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setFilePreview(file ? URL.createObjectURL(file) : null);
              }}
            />
          </label>
        </div>
        <div hidden={mode !== "link"} className="self-center">
          <label htmlFor={`${name}-url`} className="sr-only">{label} link</label>
          <input
            id={`${name}-url`}
            type="url"
            name={`${name}Url`}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://…"
            className="field"
          />
        </div>
        <div className="bg-map-grid relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream ring-1 ring-line">
          {preview ? (
            <img src={preview} alt={`${label} preview`} className="h-full w-full object-cover" />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-xs font-bold text-ink-soft">Preview</span>
          )}
        </div>
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
