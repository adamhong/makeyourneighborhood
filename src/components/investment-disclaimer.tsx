import { INVESTMENT_DISCLAIMER } from "@/lib/constants";

export function InvestmentDisclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`flex gap-1.5 text-xs leading-snug text-ink-soft ${className}`}>
      <span aria-hidden>ⓘ</span>
      {INVESTMENT_DISCLAIMER}
    </p>
  );
}
