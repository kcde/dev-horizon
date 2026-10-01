# Dev Horizon

Tech conference site.

Build a multi-page site for a tech conference. Browse the speakers, filter the schedule by day and track, and save talks. Using Sanity as the CMS to pull content.

## Setup

Requires Node 24 (see `.nvmrc`).

```sh
npm install
cp .env.example .env.local   # then fill in SANITY_API_WRITE_TOKEN if you need to seed
npm run dev                  # http://localhost:3000, Studio at /studio
```

Sanity login at `/studio` needs `http://localhost:3000` listed as a CORS origin (with credentials) in sanity.io/manage.

## Scripts

| Script              | What it does                                                       |
| ------------------- | ------------------------------------------------------------------ |
| `npm run dev`       | Start the dev server                                               |
| `npm run build`     | Production build                                                   |
| `npm run lint`      | ESLint                                                             |
| `npm run typecheck` | Generate Next route types, then `tsc`                              |
| `npm test`          | Vitest (rule logic only)                                           |
| `npm run format`    | Prettier                                                           |
| `npm run typegen`   | Regenerate Sanity types (`src/sanity/types.ts`) after schema edits |
| `npm run seed`      | Load placeholder content into Sanity (safe to re-run)              |

## Docs

- [PRD.md](PRD.md): product requirements
- [DECISIONS.md](DECISIONS.md): decisions made after the PRD (wins over it)
- [MILESTONES.md](MILESTONES.md): build plan and progress
