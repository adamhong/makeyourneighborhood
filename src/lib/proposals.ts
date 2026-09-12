import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

// better-sqlite3 is synchronous, so each read waits for a request
// (connection()) to keep it out of build-time prerendering.

const withInvestorCount = { _count: { select: { investments: true } } } as const;

export type ProposalListItem = Awaited<ReturnType<typeof listProposals>>[number];

export async function listProposals(filters: { neighborhood?: string; category?: string } = {}) {
  await connection();
  return prisma.proposal.findMany({
    where: { neighborhood: filters.neighborhood, category: filters.category },
    orderBy: [{ supportCount: "desc" }, { createdAt: "desc" }],
    include: withInvestorCount,
  });
}

export async function getPopularProposals(take = 3) {
  await connection();
  return prisma.proposal.findMany({
    orderBy: [{ supportCount: "desc" }, { createdAt: "desc" }],
    take,
    include: withInvestorCount,
  });
}

export async function getProposal(id: number) {
  await connection();
  const [proposal, pledged] = await Promise.all([
    prisma.proposal.findUnique({
      where: { id },
      include: { comments: { orderBy: { createdAt: "desc" } }, ...withInvestorCount },
    }),
    prisma.investmentInterest.aggregate({ where: { proposalId: id }, _sum: { amount: true } }),
  ]);
  if (!proposal) return null;
  return { ...proposal, pledgedTotal: pledged._sum.amount ?? 0 };
}

export async function getCommunityStats() {
  await connection();
  const [ideas, support, pledged] = await Promise.all([
    prisma.proposal.count(),
    prisma.proposal.aggregate({ _sum: { supportCount: true } }),
    prisma.investmentInterest.aggregate({ _sum: { amount: true } }),
  ]);
  return {
    ideas,
    supporters: support._sum.supportCount ?? 0,
    pledged: pledged._sum.amount ?? 0,
  };
}
