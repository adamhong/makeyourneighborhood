import Link from "next/link";
import { LogoMark } from "@/components/icons";
import { INVESTMENT_DISCLAIMER } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <LogoMark className="h-8 w-8" />
          <div>
            <p className="font-display font-extrabold">Make My Neighborhood</p>
            <p className="text-sm text-ink-soft">Ideas for San Francisco&apos;s empty spaces, from the neighbors who live there.</p>
          </div>
        </div>
        <nav className="flex gap-5 text-sm font-bold">
          <Link href="/ideas" className="hover:text-tomato">Browse ideas</Link>
          <Link href="/submit" className="hover:text-tomato">Submit an idea</Link>
        </nav>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-8 text-xs text-ink-soft sm:px-6">{INVESTMENT_DISCLAIMER}</p>
    </footer>
  );
}
