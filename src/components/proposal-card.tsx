import Link from "next/link";
import { HeartIcon, PinIcon } from "@/components/icons";
import { ProposalImage } from "@/components/proposal-image";
import { MOMENTUM_THRESHOLD, getCategory } from "@/lib/constants";
import { parseNeeds, proposalTags } from "@/lib/format";
import type { ProposalListItem } from "@/lib/proposals";

export function ProposalCard({ proposal }: { proposal: ProposalListItem }) {
  const category = getCategory(proposal.category);
  const tags = proposalTags(parseNeeds(proposal.needs)).slice(0, 3);
  const investors = proposal._count.investments;

  return (
    <Link
      href={`/ideas/${proposal.id}`}
      className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_10px_0_0_var(--color-line)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ProposalImage
          src={proposal.existingImageUrl}
          alt={`The space today at ${proposal.address}`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className={`chip absolute left-3 top-3 text-ink shadow-sm ${category.className}`}>
          {category.emoji} {category.label}
        </span>
        {proposal.supportCount >= MOMENTUM_THRESHOLD && (
          <span className="chip absolute right-3 top-3 bg-ink text-cream">🔥 Momentum</span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-tomato-dark">
            <PinIcon className="h-3.5 w-3.5" />
            {proposal.neighborhood}
          </p>
          <h3 className="mt-1 font-display text-xl font-bold leading-tight">{proposal.title}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-ink-soft">{proposal.address}</p>
        </div>

        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li key={tag} className="chip border border-line bg-cream text-ink-soft">
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-line pt-3 text-sm">
          <span className="flex items-center gap-1.5 font-bold">
            <HeartIcon filled className="h-4 w-4 text-tomato" />
            {proposal.supportCount} supporters
          </span>
          <span className="text-ink-soft">
            💸 {investors} {investors === 1 ? "person" : "people"} interested in investing
          </span>
        </div>
      </div>
    </Link>
  );
}
