# Repository Guidelines

## Project Structure & Module Organization
- `src/app/`: Next.js App Router (routes, API handlers, i18n folders).
- `src/backend/`: server-side logic
  - `config/` (DB, env), `lib/` (R2, Google GenAI), `models/` (SQL), `service/` (business rules).
- `public/`: static assets.
- `src/components/`: UI components.
- `src/backend/sql/init.sql`: database bootstrap script.
- Key routes: `/api/predictions/text_to_image`, `/api/health`, `/api/webhook/stripe`.

## Build, Test, and Development Commands
- `npm run dev`: start local Next.js dev server.
- `npm run build`: production build (requires envs; see Security & Config).
- `npm run start`: run the production build locally.
- `npm run lint`: lint with Next.js/ESLint defaults.
- Example DB init: `psql -U <user> -d <db> -f src/backend/sql/init.sql`.

## Coding Style & Naming Conventions
- Language: TypeScript, ESNext modules.
- Indentation: 2 spaces; max 100–120 cols preferred.
- Naming: `camelCase` for vars/functions, `PascalCase` for components/types, file/route segments use kebab-case.
- Imports: absolute via `@/` where configured; colocate helpers in `src/backend/lib` or `src/components`.
- Linting: `npm run lint`; format consistently (Prettier-style) before PRs.

## Testing Guidelines
- No formal unit harness included. Prefer small integration checks against API routes.
- Add tests under `src/__tests__/` when needed and document the runner in package.json.
- Keep tests deterministic; avoid real external calls—mock R2/DB/GenAI.

## Commit & Pull Request Guidelines
- Commits: imperative, concise, scoped (e.g., "fix: stripe webhook lazy init").
- PRs must include: purpose summary, screenshots for UI, steps to validate, and referenced issues.
- Keep diffs focused; avoid drive-by refactors.

## Security & Configuration Tips
- Required envs (Production):
  - `GOOGLE_API_KEY` (or `GEMINI_API_KEY`), `POSTGRES_URL`.
  - R2: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_ENDPOINT`.
  - Auth: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`.
  - Payments: `STRIPE_PRIVATE_KEY`, `STRIPE_WEBHOOK_SECRET`.
  - App: `WEB_BASE_URI`, SEO: `NEXT_PUBLIC_DOMAIN`.
- Never commit secrets; set via Vercel Project Settings. Validate at `/api/health`.
- Server-only use of AI keys; do not expose to the client.

## Agent-Specific Instructions
- Search first (`rg`), change surgically, and keep style consistent.
- Prefer lazy initialization for SDKs/DB to avoid build-time failures.
- When updating SDKs, fix imports and adapt APIs (e.g., `@google/genai`).
