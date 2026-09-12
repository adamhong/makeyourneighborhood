import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentForm } from "@/components/comment-form";
import { ArrowRightIcon, PinIcon } from "@/components/icons";
import { InvestPanel } from "@/components/invest-panel";
import { ProposalImage } from "@/components/proposal-image";
import { ShareButton } from "@/components/share-button";
import { SupportPanel } from "@/components/support-panel";
import { MOMENTUM_THRESHOLD, getCategory, getNeed } from "@/lib/constants";
import { parseNeeds, timeAgo, usd } from "@/lib/format";
import { getProposal } from "@/lib/proposals";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function loadProposal(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id < 1) notFound();
  const proposal = await getProposal(id);
  if (!proposal) notFound();
  return proposal;
}

export async function generateMetadata({ params }: Pick<PageProps, "params">): Promise<Metadata> {
  const { id } = await params;
  const proposal = await loadProposal(id);
  return { title: proposal.title, description: proposal.description.slice(0, 160) };
}

export default async function ProposalPage({ params, searchParams }: PageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const proposal = await loadProposal(id);
  const category = getCategory(proposal.category);
  const needs = parseNeeds(proposal.needs).map(getNeed);
  const investors = proposal._count.investments;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/ideas" className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-ink">
        <ArrowRightIcon className="h-4 w-4 rotate-180" /> All ideas
      </Link>

      {query.created === "1" && (
        <div role="status" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-butter px-5 py-4">
          <p className="font-bold">🎉 Your idea is live! Share it so neighbors can add their support.</p>
          <ShareButton title={proposal.title} />
        </div>
      )}

      {proposal.supportCount >= MOMENTUM_THRESHOLD && (
        <div className="relative mt-5 overflow-hidden rounded-3xl bg-leaf px-5 py-5 text-white sm:px-7">
          <div aria-hidden className="bg-map-grid absolute inset-0 opacity-30" />
          <div className="relative flex flex-wrap items-center gap-4">
            <span className="text-4xl" aria-hidden>📣</span>
            <div className="min-w-[14rem] flex-1">
              <p className="font-display text-2xl font-extrabold">Community momentum!</p>
              <p className="text-white/90">
                {proposal.supportCount} neighbors want this. That&apos;s enough to get people in a room — consider
                hosting a community meeting to turn support into a plan.
              </p>
            </div>
          </div>
        </div>
      )}

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`chip text-ink ${category.className}`}>
            {category.emoji} {category.label}
          </span>
          <span className="chip border border-line bg-paper text-ink-soft">
            <PinIcon className="h-3.5 w-3.5 text-tomato" />
            {proposal.neighborhood}
          </span>
          <span className="text-xs text-ink-soft">Shared {timeAgo(proposal.createdAt)}</span>
        </div>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
          {proposal.title}
        </h1>
        <p className="mt-2 text-ink-soft">{proposal.address}</p>
      </header>

      <section aria-label="Before and after" className="mt-8 grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <figure className="card overflow-hidden">
          <ProposalImage
            src={proposal.existingImageUrl}
            alt={`The space today at ${proposal.address}`}
            className="aspect-[4/3] w-full object-cover"
          />
          <figcaption className="flex items-center justify-between gap-2 px-5 py-3">
            <span className="font-display text-lg font-bold">Today</span>
            <span className="text-sm text-ink-soft">The existing space</span>
          </figcaption>
        </figure>
        <div aria-hidden className="grid place-items-center">
          <span className="grid h-12 w-12 rotate-90 place-items-center rounded-full bg-ink text-cream md:rotate-0">
            <ArrowRightIcon className="h-6 w-6" />
          </span>
        </div>
        <figure className="card overflow-hidden ring-4 ring-sun/60">
          <ProposalImage
            src={proposal.inspirationImageUrl}
            alt={`Inspiration for ${proposal.title}`}
            className="aspect-[4/3] w-full object-cover"
          />
          <figcaption className="flex items-center justify-between gap-2 px-5 py-3">
            <span className="font-display text-lg font-bold">The vision</span>
            <span className="text-sm text-ink-soft">Desired outcome</span>
          </figcaption>
        </figure>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-10">
          <section>
            <h2 className="font-display text-2xl font-bold">The idea</h2>
            <p className="mt-3 whitespace-pre-line text-lg leading-relaxed">{proposal.description}</p>
          </section>

          {needs.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-bold">Why this could help</h2>
              <p className="mt-1 text-ink-soft">Community needs this idea responds to in {proposal.neighborhood}.</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {needs.map((need) => (
                  <li key={need.id} className="card flex gap-3 p-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-butter text-2xl" aria-hidden>
                      {need.emoji}
                    </span>
                    <div>
                      <p className="font-bold">{need.label}</p>
                      <p className="text-sm text-ink-soft">{need.why}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:row-span-2 lg:self-start">
          <div className="card p-5">
            <SupportPanel proposalId={proposal.id} supportCount={proposal.supportCount} />
            <ShareButton title={proposal.title} className="mt-3 w-full" />
          </div>
          <div className="card p-5">
            <dl className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-cream px-3 py-2">
                <dt className="text-xs font-bold text-ink-soft">Interested investors</dt>
                <dd className="font-display text-2xl font-extrabold">{investors}</dd>
              </div>
              <div className="rounded-2xl bg-cream px-3 py-2">
                <dt className="text-xs font-bold text-ink-soft">Pledged interest</dt>
                <dd className="font-display text-2xl font-extrabold">{usd(proposal.pledgedTotal)}</dd>
              </div>
            </dl>
            <InvestPanel proposalId={proposal.id} />
          </div>
        </aside>

        <section id="comments" className="min-w-0">
          <h2 className="font-display text-2xl font-bold">
            Neighbor comments <span className="text-ink-soft">({proposal.comments.length})</span>
          </h2>
          <div className="card mt-4 p-5">
            <CommentForm proposalId={proposal.id} />
          </div>
          <ul className="mt-6 space-y-4">
            {proposal.comments.map((comment) => (
              <li key={comment.id} className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lilac font-display font-bold uppercase" aria-hidden>
                  {comment.authorName.charAt(0)}
                </span>
                <div className="card flex-1 px-4 py-3">
                  <p className="text-sm">
                    <span className="font-bold">{comment.authorName}</span>{" "}
                    <span className="text-ink-soft">· {timeAgo(comment.createdAt)}</span>
                  </p>
                  <p className="mt-1 whitespace-pre-line">{comment.body}</p>
                </div>
              </li>
            ))}
            {proposal.comments.length === 0 && (
              <li className="text-ink-soft">No comments yet — start the conversation.</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
