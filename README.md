# Make My Neighborhood

San Francisco residents propose ideas for vacant or underused spaces, browse proposals, comment, signal support, and share non-binding interest in investing.

Built with Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Prisma 7 + Postgres. Photos go to S3-compatible storage. No auth.

## Local development

Requires Node.js 20.9+ and Docker (for local Postgres).

```bash
npm install          # also generates the Prisma client
cp .env.example .env # points at the local Postgres below
npm run db:up        # start Postgres in Docker (localhost:5440)
npm run db:setup     # apply migrations and load demo data
npm run dev
```

Open http://localhost:3000. Without `S3_*` variables, uploaded photos are saved to `./.uploads`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run db:up` | Start local Postgres in Docker |
| `npm run db:setup` | Apply migrations and seed demo data (skips seeding if data exists) |
| `npm run db:seed` | Seed demo data into an empty database |
| `npm run db:reset` | Drop everything, re-apply migrations, and re-seed |
| `npm run db:migrate` | Create a new migration after editing `prisma/schema.prisma` |
| `npm run db:deploy` | Apply pending migrations (used on deploy) |
| `npm run db:studio` | Browse the data in Prisma Studio |
| `npm run lint` / `npm run typecheck` | Static checks |

## Pages

- **`/`** — landing page with calls to action, community stats, and popular proposals
- **`/ideas`** — proposal feed with neighborhood and category filters
- **`/submit`** — two steps: location (neighborhood map picker), then photos, idea, category, community needs, and an inspiration image
- **`/ideas/[id]`** — before/after images, "I want this" support, "I'd invest" non-binding pledge, comments, share, and a community momentum banner at 50+ supporters

## Project structure

```
prisma/
  schema.prisma          Proposal, Comment, InvestmentInterest
  migrations/            SQL migrations
  seed.ts                Demo proposals for local development
prisma.config.ts         Prisma CLI config (datasource URL, seed command)
railway.json             Railway build, pre-deploy migrations, health check
docker-compose.yml       Local Postgres
src/
  app/
    actions.ts           Server actions: create proposal, support, comment, invest
    page.tsx             Landing page
    ideas/page.tsx       Browse + filters
    ideas/[id]/page.tsx  Proposal detail
    submit/page.tsx      Submit wizard
    uploads/[key]/       Serves stored photos
    api/health/          Health check (verifies the database connection)
  components/            UI (cards, support/invest/comment forms, submit wizard)
  lib/
    constants.ts         Neighborhoods, categories, needs, momentum threshold
    proposals.ts         Database queries
    uploads.ts           Photo uploads (S3-compatible bucket, or ./.uploads locally)
    prisma.ts            Prisma client (pg adapter)
  generated/prisma/      Generated client (git-ignored)
```

## Deploying (Railway + Neon or Supabase)

All data lives outside the Railway container, so redeploys never lose anything. `railway.json` builds with `npm run build`, runs `npm run db:deploy` (migrations) before each deploy goes live, and health-checks `/api/health`. A failed migration or an unreachable database stops the deploy and leaves the previous one running.

Set these variables on the Railway service (see `.env.example` for details):

**Database**

- **Neon:** `DATABASE_URL` = pooled connection string (host contains `-pooler`), `DIRECT_URL` = the same string without `-pooler`.
- **Supabase:** `DATABASE_URL` = the **Session pooler** connection string (Connect → Session pooler). Supabase's direct connection is IPv6-only, so don't use it from Railway.

**Photos** (`S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`)

- **Supabase Storage:** create a bucket (it can stay private), then Project Settings → Storage → S3 access keys. The endpoint is `https://<project-ref>.supabase.co/storage/v1/s3` and the region is your project's region.
- **Cloudflare R2** (a good pairing with Neon): create a bucket and an R2 API token with object read/write. The endpoint is `https://<account-id>.r2.cloudflarestorage.com` and the region is `auto`.

Photos are served through the app at `/uploads/<key>`, so the bucket doesn't need to be public. In production, uploads fail with a clear message if `S3_BUCKET` isn't set, rather than writing to the container's disk.

Production starts with an empty database. To load the demo proposals, run `npm run db:seed` with `DATABASE_URL` pointed at it.

**Free-tier notes:** Neon suspends compute after ~5 minutes idle, so the first request afterwards takes a second or two longer. Supabase pauses free projects after a week with no activity.

## Notes and next steps

- The map is an illustrated neighborhood picker. Neighborhood and need data live in `src/lib/constants.ts`, so real maps and geocoding can plug in later.
- Support is an anonymous counter, and all server actions are public. Add authentication and rate limiting before promoting widely.
- Investment interest is non-binding and does not constitute an investment offer.
