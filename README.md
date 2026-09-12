# Make Your Neighborhood

A hackathon prototype where San Francisco residents propose ideas for vacant or underused spaces, browse proposals, comment, signal support, and share non-binding interest in investing.

Built with Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Prisma 7 + SQLite. Local development only; no auth.

## Quick start

Requires Node.js 20.9+.

```bash
# 1. Install dependencies (also generates the Prisma client)
npm install

# 2. Configure the database (SQLite file at prisma/dev.db)
cp .env.example .env

# 3. Create tables and load demo data
npm run db:setup

# 4. Start the dev server
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run db:setup` | Apply migrations and seed demo data |
| `npm run db:seed` | Re-seed (wipes proposals, comments, and investment interest) |
| `npm run db:reset` | Drop the database, re-apply migrations, and seed |
| `npm run db:migrate` | Create a new migration after editing `prisma/schema.prisma` |
| `npm run db:studio` | Browse the data in Prisma Studio |
| `npm run lint` / `npm run typecheck` | Static checks |

## What's in the demo

- **`/`** — landing page with calls to action, community stats, and popular proposals
- **`/ideas`** — proposal feed with neighborhood and category filters
- **`/submit`** — two-step form: location (with an illustrated map placeholder), then photos, idea, category, mock "AI" neighborhood needs, and an inspiration image
- **`/ideas/[id]`** — before/after images, why it helps, "I want this" support, "I'd invest" non-binding pledge, comments, share, and a community momentum banner at 50+ supporters

## Project structure

```
prisma/
  schema.prisma          Proposal, Comment, InvestmentInterest
  migrations/            SQL migrations
  seed.ts                7 SF demo proposals
prisma.config.ts         Prisma CLI config (datasource URL, seed command)
src/
  app/
    actions.ts           Server actions: create proposal, support, comment, invest
    page.tsx             Landing page
    ideas/page.tsx       Browse + filters
    ideas/[id]/page.tsx  Proposal detail
    submit/page.tsx      Submit wizard
  components/            UI (cards, support/invest/comment forms, submit wizard)
  lib/
    constants.ts         Neighborhoods, categories, needs, momentum threshold
    proposals.ts         Database queries
    uploads.ts           Local photo uploads (public/uploads)
    prisma.ts            Prisma client (better-sqlite3 adapter)
  generated/prisma/      Generated client (git-ignored)
```

## Notes and next steps

- Uploaded photos are saved to `public/uploads/`, which only works for local dev. Swap `src/lib/uploads.ts` for object storage before deploying.
- The map, voice dictation, and "AI" neighborhood insights are placeholders. The data they use lives in `src/lib/constants.ts` so real maps, vacancy data, and AI analysis can plug in later.
- Support is an anonymous counter, and all server actions are public. Add authentication and rate limiting before real use.
- Investment interest is non-binding and does not constitute an investment offer.
