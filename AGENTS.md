# Repository Guidelines

## Project Structure & Module Organization
This repository is a Next.js App Router project. Core route files live in `app/` (`page.tsx`, `layout.tsx`, and dynamic routes like `app/lessons/[slug]/page.tsx`). Reusable UI is split between feature components in `components/` and ShadCN primitives in `components/ui/`. Shared logic lives in `lib/` (lesson loading, quiz parsing, category helpers). Lesson source files are in `lessons/<lesson-slug>/` with a `lesson.json` metadata file, `core.md`, and optional deep lessons under `deep/<deep-slug>/lesson.md`. Quiz payloads are stored alongside lessons (`quiz.json`) plus category quizzes in `lessons/_category-quizzes/`. Static assets are in `public/`, and product/reference docs are in `docs/`.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start local dev server at `http://localhost:3000`.
- `npm run lint`: run ESLint (Next Core Web Vitals + TypeScript rules).
- `npm run build`: create production build.
- `npm start`: run the built app.

There is no dedicated automated test script yet, so lint + build checks are required before opening a PR.

## Coding Style & Naming Conventions
Use TypeScript with strict typing (`tsconfig.json` has `"strict": true`). Follow existing formatting: 2-space indentation, semicolons, and double quotes. Use PascalCase for React components/types, camelCase for functions/variables, and keep route file names aligned with Next conventions (`page.tsx`, `layout.tsx`). Prefer path aliases (`@/`) over long relative imports when possible.

## Testing Guidelines
Automated unit/integration tests are not yet configured. Minimum validation for each change:
- Run `npm run lint`.
- Run `npm run build`.
- Manually smoke-test affected flows (catalog, lesson page, category page, quiz page).

If you add tests, use `*.test.ts` / `*.test.tsx` naming and keep them near the feature they validate.

## Commit & Pull Request Guidelines
Recent history favors conventional-style commits (`feat:`, `chore:`, `style:`, `deps:`). Keep commit subjects short, imperative, and focused. For PRs, include:
- What changed and why.
- Screenshots/GIFs for UI updates.
- Any content slugs or routes impacted.
- Manual verification steps executed locally.

## Content Authoring Notes
Each lesson pack should use a stable slug folder (`lessons/<slug>/`). Core content goes in `core.md`, deep dives go in `deep/<deep-slug>/lesson.md`, and metadata is defined in `lesson.json` (`slug`, `title`, `category`, `tags`, `summary`, `order`, `readMinutes`, `deepDives`). Lesson quizzes live at `lessons/<slug>/quiz.json`, and category quizzes live under `lessons/_category-quizzes/`.
