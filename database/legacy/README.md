# Legacy SQL files

These files are kept for historical reference only. Do not run them on a fresh setup.

| File | Purpose |
|------|---------|
| `marketplace_original.sql` | Original schema + seed written during initial MySQL integration |
| `marketplace_patch_original.sql` | Patch applied to add missing columns (`shipping`, `accent`, `created_at`) to an existing install |

## What to use instead

- **Fresh setup:** run `database/migrations/001_create_tables.sql` then `database/seeds/001_seed_data.sql`
- See `SETUP.md` for full instructions
