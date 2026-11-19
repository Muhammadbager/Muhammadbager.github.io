# Muhammadbager Al-Ali — Portfolio

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

The `Greater Seattle Job Watch` workflow runs at 8:00 AM and 8:00 PM Pacific and reads Simplify's structured new-grad feed. The dashboard shows open, non-remote Greater Seattle software listings from the past 30 days, excluding internships and PhD-only roles. Strong matches must be posted within seven days, have an explicit entry-level or new-grad signal, and pass the job-description check for degree, experience and graduation requirements.

Discord alerts are limited to strong matches first eligible within 24 hours of posting, with a direct mention within the first hour. Supabase stores canonical requisition IDs and alert status to suppress repeats. The Wishlist tab controls which companies are highlighted. A manual workflow run with `refresh_only` updates the dashboard and leaves any pending Discord alerts for the next regular run.

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

Pushes to `main` build and deploy the site through GitHub Pages at
`https://muhammadbager.github.io/portfolio/`.
