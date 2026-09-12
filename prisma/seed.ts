import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" }),
});

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;
const daysAgo = (days: number) => new Date(Date.now() - days * 86_400_000);

type SeedComment = { authorName: string; body: string; daysAgo: number };
type SeedInvestment = { name: string; email: string; amount?: number; note?: string; daysAgo: number };
type SeedProposal = {
  title: string;
  description: string;
  address: string;
  neighborhood: string;
  category: string;
  needs: string[];
  supportCount: number;
  existingImageUrl: string;
  inspirationImageUrl: string;
  daysAgo: number;
  comments: SeedComment[];
  investments: SeedInvestment[];
};

const proposals: SeedProposal[] = [
  {
    title: "Little Sprouts Family Hub",
    description:
      "This storefront has been empty for three years. Let's turn it into a sliding-scale childcare co-op with a drop-in play room, a lactation nook, and evening workshops for new parents.\n\nSoMa has thousands of new apartments and almost no licensed infant care within walking distance.",
    address: "Folsom St & 7th St",
    neighborhood: "SoMa",
    category: "childcare",
    needs: ["childcare", "green"],
    supportCount: 72,
    existingImageUrl: unsplash("1474901963208-accc1ba91782"),
    inspirationImageUrl: unsplash("1545558014-8692077e9b5c"),
    daysAgo: 21,
    comments: [
      { authorName: "Priya", body: "We're on three waitlists right now. I would walk here every single day.", daysAgo: 20 },
      { authorName: "Marcus", body: "Could the back lot become a small fenced play yard?", daysAgo: 14 },
      { authorName: "Dana", body: "Retired preschool teacher here — happy to volunteer for story time.", daysAgo: 3 },
    ],
    investments: [
      { name: "Priya S.", email: "priya@example.com", amount: 1500, daysAgo: 19 },
      { name: "SoMa Parents Network", email: "hello@example.com", amount: 10000, note: "Can help with licensing.", daysAgo: 10 },
      { name: "Leo", email: "leo@example.com", daysAgo: 2 },
    ],
  },
  {
    title: "Dogpatch Backyard Stage",
    description:
      "A weekend music stage in the unused lot behind the old warehouses: string lights, a small shade canopy, food trucks, and an all-ages lineup of Bay Area bands. Quiet by 9pm so neighbors stay happy.",
    address: "Illinois St & 22nd St",
    neighborhood: "Dogpatch",
    category: "music",
    needs: ["music", "green"],
    supportCount: 58,
    existingImageUrl: unsplash("1698879398790-8c3bed75094a"),
    inspirationImageUrl: unsplash("1565035010268-a3816f98589a"),
    daysAgo: 16,
    comments: [
      { authorName: "Jules", body: "My band would play here for free to get it started!", daysAgo: 15 },
      { authorName: "Ramon", body: "Love it — please keep it all-ages so teens have somewhere to go.", daysAgo: 7 },
    ],
    investments: [
      { name: "Jules R.", email: "jules@example.com", amount: 750, daysAgo: 12 },
      { name: "Dogpatch Brewing Collective", email: "collective@example.com", amount: 5000, daysAgo: 6 },
    ],
  },
  {
    title: "Pages on 24th: A Community Bookstore",
    description:
      "A bilingual bookstore and reading room run as a co-op. Shelves up front, a kids' corner in the back, and a free zine library. Local authors host readings on Thursday nights.",
    address: "24th St & Bryant St",
    neighborhood: "Mission",
    category: "books",
    needs: ["bookstore", "childcare"],
    supportCount: 41,
    existingImageUrl: unsplash("1498811008858-d95a730b2ffc"),
    inspirationImageUrl: unsplash("1760636803247-588f983d1b49"),
    daysAgo: 12,
    comments: [
      { authorName: "Ana", body: "¡Sí! We lost two bookstores on this corridor. Bilingual kids' books please.", daysAgo: 11 },
      { authorName: "Tom", body: "I'd join a member co-op for this in a heartbeat.", daysAgo: 4 },
    ],
    investments: [{ name: "Ana G.", email: "ana@example.com", amount: 400, daysAgo: 9 }],
  },
  {
    title: "Eddy Street Pocket Park",
    description:
      "Transform this fenced-off lot into a pocket park with shade trees, benches, a dog run, and a small play structure. Neighbors could steward raised planter beds year-round.",
    address: "Eddy St & Jones St",
    neighborhood: "Tenderloin",
    category: "green",
    needs: ["green", "childcare"],
    supportCount: 47,
    existingImageUrl: unsplash("1688862719614-dd7b8aeea0cf"),
    inspirationImageUrl: unsplash("1542800952-e5471ed41326"),
    daysAgo: 9,
    comments: [
      { authorName: "Mei", body: "The Tenderloin has the most kids per block and the least green space. This matters.", daysAgo: 8 },
      { authorName: "Kevin", body: "Our tenants' association can help organize cleanup days.", daysAgo: 2 },
    ],
    investments: [
      { name: "Mei L.", email: "mei@example.com", amount: 250, daysAgo: 7 },
      { name: "Kevin", email: "kevin@example.com", amount: 100, daysAgo: 2 },
    ],
  },
  {
    title: "Third Street Artist Commons",
    description:
      "Below-market studios for 20 artists in a vacant warehouse, with a shared print shop, a gallery wall facing the street, and free open studio nights for Bayview families.",
    address: "3rd St & Oakdale Ave",
    neighborhood: "Bayview",
    category: "arts",
    needs: ["workspace"],
    supportCount: 33,
    existingImageUrl: unsplash("1771530789155-b1f03fbf82b5"),
    inspirationImageUrl: unsplash("1740710543611-80b658171bc3"),
    daysAgo: 7,
    comments: [
      { authorName: "Keisha", body: "Artists who grew up here are getting pushed out. This keeps them in the neighborhood.", daysAgo: 6 },
    ],
    investments: [
      { name: "Keisha W.", email: "keisha@example.com", amount: 2000, daysAgo: 5 },
      { name: "Bayview Arts Fund", email: "fund@example.com", amount: 15000, daysAgo: 3 },
    ],
  },
  {
    title: "Abuela's Table Community Kitchen",
    description:
      "A licensed shared kitchen where home cooks can launch food businesses, plus weekly community dinners and cooking classes led by neighborhood elders.",
    address: "Mission St & 20th St",
    neighborhood: "Mission",
    category: "food",
    needs: ["kitchen", "workspace"],
    supportCount: 26,
    existingImageUrl: unsplash("1788252574787-ee49a0ae6a26"),
    inspirationImageUrl: unsplash("1772724317488-b901d235d419"),
    daysAgo: 5,
    comments: [
      { authorName: "Rosa", body: "I sell tamales from home — a commercial kitchen would change everything.", daysAgo: 4 },
    ],
    investments: [{ name: "Rosa M.", email: "rosa@example.com", amount: 300, daysAgo: 4 }],
  },
  {
    title: "Second-Floor Neighbor Desks",
    description:
      "An affordable coworking floor above a vacant office lobby: $50/month desks for freelancers and caregivers, with a quiet room and on-site childcare hours two mornings a week.",
    address: "Howard St & 6th St",
    neighborhood: "SoMa",
    category: "workspace",
    needs: ["workspace", "childcare"],
    supportCount: 14,
    existingImageUrl: unsplash("1785599954475-01ea848f97c8"),
    inspirationImageUrl: unsplash("1772723822651-d2161754d61b"),
    daysAgo: 2,
    comments: [],
    investments: [],
  },
];

async function main() {
  await prisma.investmentInterest.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.proposal.deleteMany();

  for (const { comments, investments, needs, daysAgo: age, ...proposal } of proposals) {
    await prisma.proposal.create({
      data: {
        ...proposal,
        needs: JSON.stringify(needs),
        createdAt: daysAgo(age),
        comments: {
          create: comments.map(({ daysAgo: commentAge, ...comment }) => ({ ...comment, createdAt: daysAgo(commentAge) })),
        },
        investments: {
          create: investments.map(({ daysAgo: investmentAge, ...investment }) => ({
            ...investment,
            createdAt: daysAgo(investmentAge),
          })),
        },
      },
    });
  }

  console.log(`Seeded ${proposals.length} proposals.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
