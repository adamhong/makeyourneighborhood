import type { Metadata } from "next";
import Link from "next/link";
import { InvestmentDisclaimer } from "@/components/investment-disclaimer";
import { ProposalCard } from "@/components/proposal-card";
import { CATEGORIES, NEIGHBORHOODS } from "@/lib/constants";
import { listProposals } from "@/lib/proposals";

export const metadata: Metadata = { title: "Browse ideas" };

type Filters = { neighborhood?: string; category?: string };

function filterHref({ neighborhood, category }: Filters) {
  const params = new URLSearchParams();
  if (neighborhood) params.set("neighborhood", neighborhood);
  if (category) params.set("category", category);
  const query = params.toString();
  return query ? `/ideas?${query}` : "/ideas";
}

function FilterChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={`chip shrink-0 border-2 px-3.5 py-1.5 text-sm transition ${
        active ? "border-ink bg-ink text-cream" : "border-line bg-paper text-ink hover:border-ink"
      }`}
    >
      {children}
    </Link>
  );
}

export default async function IdeasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const neighborhood = NEIGHBORHOODS.find((n) => n.name === params.neighborhood)?.name;
  const category = CATEGORIES.find((c) => c.id === params.category)?.id;
  const proposals = await listProposals({ neighborhood, category });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-tomato-dark">Browse ideas</p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            What neighbors want to build
          </h1>
          <p className="mt-2 text-ink-soft">
            {proposals.length} {proposals.length === 1 ? "proposal" : "proposals"}
            {neighborhood ? ` in ${neighborhood}` : " across San Francisco"}
          </p>
        </div>
        <Link href="/submit" className="btn-primary">Submit an idea</Link>
      </div>

      <div className="card mt-8 space-y-4 p-4 sm:p-5">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-soft">Neighborhood</p>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <FilterChip href={filterHref({ category })} active={!neighborhood}>All</FilterChip>
            {NEIGHBORHOODS.map((n) => (
              <FilterChip key={n.name} href={filterHref({ neighborhood: n.name, category })} active={neighborhood === n.name}>
                {n.name}
              </FilterChip>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-soft">Category</p>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <FilterChip href={filterHref({ neighborhood })} active={!category}>All</FilterChip>
            {CATEGORIES.map((c) => (
              <FilterChip key={c.id} href={filterHref({ neighborhood, category: c.id })} active={category === c.id}>
                {c.emoji} {c.label}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      {proposals.length > 0 ? (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {proposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
          <InvestmentDisclaimer className="mt-6" />
        </>
      ) : (
        <div className="card mt-8 flex flex-col items-center gap-3 px-6 py-16 text-center">
          <span className="text-5xl" aria-hidden>🌱</span>
          <h2 className="font-display text-2xl font-bold">No ideas here yet</h2>
          <p className="max-w-sm text-ink-soft">Be the first to imagine something better for this corner of the city.</p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link href="/submit" className="btn-primary">Submit an idea</Link>
            <Link href="/ideas" className="btn-secondary">Clear filters</Link>
          </div>
        </div>
      )}
    </div>
  );
}
