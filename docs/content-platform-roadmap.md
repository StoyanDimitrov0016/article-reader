# Content Platform Roadmap

## Why This Exists
This document preserves architecture decisions for evolving the project from local markdown lesson packs to user-managed custom lessons.

## Current Decision
- Keep local markdown lesson packs (`lessons/<slug>/`) for seed content during early development.
- Move lesson storage to the database for long-term product usage.
- Do not maintain a manual hardcoded set/map of lessons.

## Target Storage Model
Use the database as source of truth for both metadata and markdown body.

`lessons` table (initial):
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
- Add authentication before enabling custom lesson creation.
- Every created lesson must be linked to `author_id`.
- Authorization rules:
  - Users can read published content.
  - Users can create/update/delete only their own draft lessons.
  - Admin/moderator roles can manage all content.

## Per-User Limits
Introduce quota controls when custom lessons are enabled:
- `max_lessons_per_user` (for example 20 for free tier)
- optional `max_total_chars_per_user`
- enforce limits in write APIs and return clear validation errors

## Rollout Plan
1. Add DB schema and read path for lessons.
2. Backfill existing markdown lessons into DB as seed data.
3. Switch runtime reads from file system to DB queries.
4. Add auth and ownership checks.
5. Enable custom lesson CRUD with per-user quotas.
6. Add lesson version history only when needed.

## Notes
- With current expected lesson size (about 10 to 15-minute reads), `TEXT` in DB is appropriate.
- Object storage can be introduced later only if scale or cost requires it.
