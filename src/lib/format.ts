import { getNeed, isNeedId, type NeedId } from "@/lib/constants";

/** Keeps only need ids that still exist in NEEDS. */
export function parseNeeds(raw: string[]): NeedId[] {
  return raw.filter(isNeedId);
}

/** Short tags shown on proposal cards. */
export function proposalTags(needs: NeedId[]): string[] {
  if (needs.length === 0) return [];
  return ["Community need", ...needs.map((id) => getNeed(id).tag)];
}

export function usd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function compactUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

export function timeAgo(date: Date): string {
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["week", 604_800],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, size] of units) {
    if (seconds >= size) return formatter.format(-Math.floor(seconds / size), unit);
  }
  return "just now";
}
