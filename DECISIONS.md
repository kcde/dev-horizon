# Dev Horizon — Decisions

Decisions settled after reviewing [PRD.md](PRD.md). Where this file and the PRD differ, this file wins.

## Content model (Sanity)

### Speaker

- Fields: name, slug (generated from name, unique; used in the modal URL), jobTitle, company, photo, bio.
- Photos are transparent cut-outs (background already removed), all framed identically and prepared in advance. Framing/size follows the design.
- Photo upload accepts PNG or WebP only.
- A speaker always has a talk. As a safety net, speakers with no talk are hidden on the site.

### Talk

- Fields: title, description, speaker (single reference), day (reference), track, startTime, endTime, location, isKeynote.
- Required: speaker, day, track, startTime, endTime. Validation: endTime must be after startTime.
- Room clash (same location, overlapping time on the same day): warning, not a block.
- Only one talk may have `isKeynote` set (validation blocks a second).
- One talk per speaker is **not** enforced. If a speaker has several talks, the earliest is their "primary" talk.
- The keynote is the keynote speaker's talk. It still belongs to a real track and shows under that track's filter.
- Visually, the keynote's talk row shows a "KEYNOTE" side tag in the keynote color (cyan) instead of its track tag and color.

### Day

- Fields: date, label (e.g. "Day 1").

### Tracks

- Hard-coded in the app: Frontend, Performance, Accessibility, Tooling, each with a color and a one-line description (copy from the Home screen design):
  - Frontend: "Building modern interfaces for the web"
  - Performance: "Make every millisecond count"
  - Accessibility: "Building inclusive experiences for everyone"
  - Tooling: "Level up your developer workflow"
- In Sanity, Talk.track is a fixed dropdown of the track keys, not a document reference.

### Site Settings (singleton)

- Event name, tagline, event dates (free text, e.g. "14–16 Oct 2026"), venue (Pier 70, San Francisco).

## Pages

### Home

- Hero: from Site Settings.
- Keynote spotlight: the talk with `isKeynote`.
- Track cards: link to `/schedule?track=<key>`. Card content follows the design.
- Featured speakers (8): 2 per track, drawn from **different days**, rotating days across tracks so all 3 days are represented. Within a day, pick the earliest talk. The keynote speaker is eligible like any other speaker (the design features them). A speaker repeats only if no one else is available.
- Schedule highlights (4): 1 per track, spread across days using the same idea.
- "Earliest" means ordered by day date, then start time; ties broken by talk title.

### Speakers

- Grid of all speakers (with a talk): photo, name, job title, company, primary talk title.
- Card background color = primary talk's track color. The keynote speaker gets a special background (per design).
- Clicking a card opens a speaker modal: bio plus all of that speaker's talks.
- The open modal is reflected in the URL (`/speakers?speaker=<slug>`), updated client-side so the page stays static. The link is shareable; closing the modal removes the param.

### Schedule

- Filters: Day + Track + My Schedule + Clear, all combinable.
- Filter state is reflected in the URL (e.g. `?day=2&track=frontend&mine=1`), updated client-side so pages stay static. `mine` only reflects the current browser's saved talks.
- Talk row: track color tag, title, speaker + company, start/end time, expandable details (description + location), save toggle.
- Times: 12-hour format, America/Los_Angeles, labelled (PDT/PST). No conversion to the viewer's time zone. This overrides the design, which shows 24-hour times.
- Day filter always means conference days.

### Saved talks

- Stored in `localStorage`, keyed by Sanity document `_id` (renaming a talk keeps it saved).
- IDs that no longer match a talk are dropped silently and removed from storage on load.

## Technical

- Next.js App Router, TypeScript (strict), CSS Modules, npm, ESLint (Next default) + Prettier. No CI: checks run locally and Vercel builds each preview.
- Tests: Vitest for rule logic only: featured/highlight selection, schedule filtering, saved-talks storage. No end-to-end tests for now.
- Rendering: static pages, revalidated on demand by a Sanity webhook on publish, with time-based revalidation (hourly) as a fallback.
- Sanity Studio embedded in the app at `/studio`.
- Sanity project `dev-horizon` (ID `8tnqf6xe`), single dataset.
- Hosting: Vercel. Preview deployments serve as staging for client review.
- Sanity and Vercel projects are under Keside's accounts for now; transfer to (or add) the client before launch.

## Design

- Source: Figma and a Claude Design project, provided by Keside.
- Build is progressive: Keside decides which piece is built next.
- Design wins on visual details (track/keynote colors, card layout, photo framing).
- Breakpoints (from the Claude Design handoff): desktop ≥ 1024px, tablet 442–1023px, mobile ≤ 441px. Written as `max-width: 1023px` / `max-width: 441px` media queries.
- Tokens live in `src/styles/tokens.css` in two layers: primitives named as in Figma (`--color-neutral-900`, `--space-300`, `--radius-8`) and semantic aliases that components use (`--color-bg`, `--color-accent`, `--color-track-frontend`, `--page-pad`). Components use the aliases where one exists.
- Type presets are global classes (`.text-preset-1` … `.text-preset-7`) in `src/styles/typography.css`, used alongside each component's CSS Module.
- Site and Studio have separate root layouts (`src/app/(site)`, `src/app/(studio)`) so site styles never reach the Studio.
- `/design-system` is a dev-only reference page (404 in production) showing tokens and, from M2, every component state.

## Still open

- Domain.
- Timeline and budget.
