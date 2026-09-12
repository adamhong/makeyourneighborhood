import Link from "next/link";
import { ArrowRightIcon, HeartIcon, PinIcon } from "@/components/icons";
import { InvestmentDisclaimer } from "@/components/investment-disclaimer";
import { ProposalCard } from "@/components/proposal-card";
import { ProposalImage } from "@/components/proposal-image";
import { NEIGHBORHOODS } from "@/lib/constants";
import { compactUsd } from "@/lib/format";
import { getCommunityStats, getPopularProposals } from "@/lib/proposals";

const STEPS = [
  { emoji: "📍", title: "Spot a space", body: "A shuttered storefront, an empty lot, a parking yard nobody uses. Drop a pin." },
  { emoji: "✨", title: "Share the vision", body: "Show what's there today and what it could become — childcare, a stage, a park." },
  { emoji: "🔥", title: "Build momentum", body: "Neighbors signal support, comment, and raise their hands to help fund it." },
];

export default async function HomePage() {
  const [popular, stats] = await Promise.all([getPopularProposals(3), getCommunityStats()]);
  const [featured, runnerUp] = popular;

  return (
    <>
      <section className="relative overflow-hidden">
        <div aria-hidden className="bg-map-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />
        <div aria-hidden className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sun/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-tomato/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-12 sm:px-6 md:grid-cols-[1.1fr_1fr] md:pb-28 md:pt-20">
          <div>
            <p className="chip border border-line bg-paper text-ink-soft">
              <PinIcon className="h-3.5 w-3.5 text-tomato" /> San Francisco · community ideas
            </p>
            <h1 className="mt-5 font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Make Your <span className="text-tomato">Neighborhood</span>
            </h1>
            <p className="mt-6 max-w-md text-xl font-medium text-ink">
              Turn local ideas into momentum for better neighborhood spaces.
            </p>
            <p className="mt-3 max-w-md text-ink-soft">
              Imagine what that vacant corner could become, then rally the neighbors who want it too.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/submit" className="btn-primary px-7 py-3.5 text-lg">
                Submit an idea
              </Link>
              <Link href="/ideas" className="btn-secondary px-7 py-3.5 text-lg">
                Browse ideas <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {featured && (
            <div className="relative mx-auto w-full max-w-md md:max-w-none">
              <div className="rotate-2 overflow-hidden rounded-[2rem] border-4 border-paper shadow-xl">
                <ProposalImage
                  src={featured.inspirationImageUrl ?? featured.existingImageUrl}
                  alt={`Inspiration for ${featured.title}`}
                  className="aspect-[4/5] w-full object-cover md:aspect-[5/5]"
                />
              </div>
              {runnerUp && (
                <div className="absolute -bottom-8 -left-4 w-36 -rotate-6 overflow-hidden rounded-2xl border-4 border-paper shadow-lg sm:w-44">
                  <ProposalImage src={runnerUp.existingImageUrl} alt={`The space today: ${runnerUp.title}`} className="aspect-square w-full object-cover" />
                  <span className="chip absolute bottom-2 left-2 bg-ink/85 text-cream">Today</span>
                </div>
              )}
              <div className="absolute -right-2 top-6 rotate-3 rounded-2xl bg-paper px-4 py-3 shadow-lg">
                <p className="flex items-center gap-1.5 font-display text-2xl font-extrabold">
                  <HeartIcon filled className="h-5 w-5 text-tomato" />
                  {featured.supportCount}
                </p>
                <p className="text-xs font-bold text-ink-soft">neighbors want this</p>
              </div>
              <Link
                href={`/ideas/${featured.id}`}
                className="absolute bottom-6 right-4 max-w-[62%] rounded-2xl bg-ink/90 px-4 py-3 text-cream backdrop-blur transition hover:bg-ink"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-sun">{featured.neighborhood}</p>
                <p className="font-display font-bold leading-tight">{featured.title}</p>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-line bg-ink text-cream">
        <dl className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-cream/15 px-4 py-6 text-center sm:px-6">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-cream/70 sm:text-sm">Ideas shared</dt>
            <dd className="font-display text-3xl font-extrabold text-sun sm:text-4xl">{stats.ideas}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-cream/70 sm:text-sm">Support signals</dt>
            <dd className="font-display text-3xl font-extrabold text-sun sm:text-4xl">{stats.supporters}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-cream/70 sm:text-sm">Pledged interest*</dt>
            <dd className="font-display text-3xl font-extrabold text-sun sm:text-4xl">{compactUsd(stats.pledged)}</dd>
          </div>
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="card p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-butter text-2xl">{step.emoji}</span>
                <span className="font-display text-sm font-bold text-ink-soft">Step {index + 1}</span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold">{step.title}</h2>
              <p className="mt-1 text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-tomato-dark">Popular proposals</p>
            <h2 className="font-display text-4xl font-extrabold tracking-tight">Ideas neighbors are rallying behind</h2>
          </div>
          <Link href="/ideas" className="inline-flex items-center gap-1.5 font-bold hover:text-tomato">
            See all ideas <ArrowRightIcon />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
        <InvestmentDisclaimer className="mt-5" />
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-tomato px-6 py-12 text-white sm:px-12">
          <div aria-hidden className="bg-map-grid absolute inset-0 opacity-40" />
          <div className="relative grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div>
              <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight">
                What would you build around the corner?
              </h2>
              <p className="mt-3 text-white/90">Pick your neighborhood and start with a photo and a sentence.</p>
              <Link href="/submit" className="mt-6 inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 font-bold text-ink shadow-[0_4px_0_0_var(--color-tomato-dark)] transition hover:-translate-y-0.5">
                Submit an idea <ArrowRightIcon />
              </Link>
            </div>
            <ul className="flex flex-wrap gap-2">
              {NEIGHBORHOODS.map((neighborhood) => (
                <li key={neighborhood.name}>
                  <Link
                    href={`/ideas?neighborhood=${encodeURIComponent(neighborhood.name)}`}
                    className="chip bg-white/15 px-3.5 py-2 text-sm text-white ring-1 ring-white/30 transition hover:bg-white hover:text-ink"
                  >
                    <PinIcon className="h-3.5 w-3.5" /> {neighborhood.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
