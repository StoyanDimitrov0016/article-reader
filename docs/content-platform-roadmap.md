# Content Platform Roadmap

## Why This Exists
This document preserves architecture decisions for evolving the project from local markdown files to user-managed custom articles.

## Current Decision
- Keep local markdown (`content/*.md`) for seed content during early development.
- Move article storage to the database for long-term product usage.
- Do not maintain a manual hardcoded set/map of articles.

## Target Storage Model
Use the database as source of truth for both metadata and markdown body.

`articles` table (initial):
- `id` (PK)
- `slug` (unique)
- `title`
- `markdown_text` (TEXT)
- `category_id` (nullable FK)
- `author_id` (FK)
- `status` (`draft` | `published` | `archived`)
- `created_at`
- `updated_at`

Recommended indexes:
- unique index on `slug`
- index on `author_id`
- index on `category_id`
- index on `status, updated_at`

## Auth and Ownership
- Add authentication before enabling custom article creation.
- Every created article must be linked to `author_id`.
- Authorization rules:
  - Users can read published content.
  - Users can create/update/delete only their own draft articles.
  - Admin/moderator roles can manage all content.

## Per-User Limits
Introduce quota controls when custom articles are enabled:
- `max_articles_per_user` (for example 20 for free tier)
- optional `max_total_chars_per_user`
- enforce limits in write APIs and return clear validation errors

## Rollout Plan
1. Add DB schema and read path for articles.
2. Backfill existing markdown articles into DB as seed data.
3. Switch runtime reads from file system to DB queries.
4. Add auth and ownership checks.
5. Enable custom article CRUD with per-user quotas.
6. Add article version history only when needed.

## Notes
- With current expected article size (about 10-minute reads), `TEXT` in DB is appropriate.
- Object storage can be introduced later only if scale or cost requires it.
