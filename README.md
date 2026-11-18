# Muhammadbager Al-Ali — Career Deck

Public portfolio and private career dashboard for [Muhammadbager Al-Ali](https://github.com/Muhammadbager).

## Local development

```bash
npm install
npm run dev
```

The public portfolio works without environment variables. The private dashboard requires a Supabase project configured with the included migration and these values:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Private application records and resume source files are intentionally excluded from Git.

## Job discovery

The `Greater Seattle Job Watch` workflow runs at 8:00 AM and 8:00 PM in the `America/Los_Angeles` timezone. It reads Simplify's structured new-grad feed and keeps only software roles posted within the last seven days that explicitly target bachelor's-level new grads, early-career candidates, entry-level candidates, Engineer I/SDE I, a 2026 start, or zero-to-two years of experience. It excludes remote, internship, PhD-only, research-track, mid-level, senior+, 2027+, later-graduation, required-internship, and required-professional-experience roles. Supabase stores canonical requisition IDs for persistent deduplication, so alternate URLs and repeated workflow runs do not create duplicate alerts. Newly seen roles can alert for their first 24 hours; roles posted within the last hour include a direct Discord mention. The private dashboard's Wishlist tab controls which companies receive priority styling in the dashboard and Discord alerts; the next scheduled run reads the saved list.

It activates after these repository secrets are configured:

```text
SUPABASE_URL
SUPABASE_SECRET_KEY
OWNER_USER_ID
DISCORD_WEBHOOK_URL
DISCORD_USER_ID
```

Run the parser without private secrets for a safe dry run:

```bash
node scripts/job-watch.mjs
```

## Deployment

Pushes to `main` build and deploy the site through GitHub Pages.
