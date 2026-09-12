import Link from "next/link";
import { LogoMark } from "@/components/icons";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark />
          <span className="font-display text-base font-extrabold leading-[1.05] tracking-tight sm:text-lg">
            Make My
            <br className="sm:hidden" /> Neighborhood
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3">
          <Link href="/ideas" className="rounded-full px-3 py-2 text-sm font-bold hover:bg-ink/5">
            Browse ideas
          </Link>
          <Link href="/submit" className="btn-primary px-4 py-2 text-sm">
            Submit an idea
          </Link>
        </nav>
      </div>
    </header>
  );
}
