import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="text-6xl" aria-hidden>🧭</span>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">We couldn&apos;t find that spot</h1>
      <p className="mt-2 text-ink-soft">The idea may have moved, or the link is off by a block.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/ideas" className="btn-primary">Browse ideas</Link>
        <Link href="/" className="btn-secondary">Home</Link>
      </div>
    </div>
  );
}
