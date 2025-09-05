# Repository Guidelines

## Project Structure & Module Organization
- `src/app/`: Next.js App Router (routes, API handlers, i18n folders).
- `src/backend/`: server logic
  - `config/` (DB pool), `lib/` (R2, Google GenAI), `models/` (SQL), `service/` (business rules).
- `src/components/`: UI components and feature modules.
- `public/`: static assets (e.g., `favicon.ico`, images).
- `src/backend/sql/init.sql`: database bootstrap.
- Key APIs: `/api/predictions/text_to_image`, `/api/health`, `/api/webhook/stripe`.

## Build, Test, and Development Commands
- `npm run dev`: Start local dev server.
- `npm run build`: Production build (requires env vars).
- `npm run start`: Run the production build locally.
- `npm run lint`: Lint with Next.js/ESLint config.
- DB init (example): `psql -U <user> -d <db> -f src/backend/sql/init.sql`.

## Coding Style & Naming Conventions
- Language: TypeScript, ESNext modules; indentation: 2 spaces.
- Naming: `camelCase` (vars/functions), `PascalCase` (components/types), kebab-case for files/routes.
- Imports: prefer absolute `@/` paths; colocate helpers under `lib/` or component folders.
- Keep lines ~100–120 chars; run `npm run lint` before PRs.

## Testing Guidelines
- No formal test harness included. Prefer lightweight integration checks against API routes.
- If adding tests, use `src/__tests__/` and mock external calls (DB/R2/GenAI).
- Document the test command in `package.json` when introducing a framework.

## Commit & Pull Request Guidelines
- Commits: imperative and scoped (e.g., `fix: lazy-init Stripe webhook`).
- PRs include: purpose/why, linked issues, screenshots (UI), validation steps (commands/routes), and risk notes.
- Keep diffs focused; avoid unrelated refactors.

## Security & Configuration Tips
- Required envs (Production):
  - Google: `GOOGLE_API_KEY` (or `GEMINI_API_KEY`)
  - DB: `POSTGRES_URL` (use Supabase Pooler on port 6543; URL-encode special chars)
  - R2: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_ENDPOINT`
  - Auth: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
  - Stripe (if used): `STRIPE_PRIVATE_KEY`, `STRIPE_WEBHOOK_SECRET`
  - App: `WEB_BASE_URI`, SEO: `NEXT_PUBLIC_DOMAIN`
- Verify via `/api/health`. Never commit secrets.

## Agent-Specific Instructions
- Search first (`rg`), change surgically, keep style consistent.
- Prefer lazy initialization for SDKs/DB to avoid build-time failures.
- When updating SDKs, fix imports and adapt APIs (e.g., `@google/genai`).
