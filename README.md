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

## Deployment

Pushes to `main` build and deploy the site through GitHub Pages.
