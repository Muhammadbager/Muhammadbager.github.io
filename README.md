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

The `Greater Seattle Job Watch` workflow runs at 8:00 AM and 8:00 PM in the `America/Los_Angeles` timezone. It filters the public Simplify new-grad list for entry-level software roles in the Greater Seattle area, excludes remote and senior roles, stores new matches privately, and sends a Discord digest.

It activates after these repository secrets are configured:

```text
SUPABASE_URL
SUPABASE_SECRET_KEY
OWNER_USER_ID
DISCORD_WEBHOOK_URL
```

Run the parser without private secrets for a safe dry run:

```bash
node scripts/job-watch.mjs
```

## Deployment

Pushes to `main` build and deploy the site through GitHub Pages.
