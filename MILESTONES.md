# Dev Horizon — Milestones

Breakdown of the Figma file ([tech-conference-site](https://www.figma.com/design/9Y0LpufCqUnXblZcIOiYVE/tech-conference-site)) into buildable milestones. Keside picks what gets built next; the order below is the dependency order, not a schedule.

Figma pages: `👋 Overview` (cover, `208:3302`) and `✨ Designs` (`0:1`), which holds every screen plus the component sets.

Breakpoints in the design: **375** (mobile), **768** (tablet), **1440** (desktop).

---

## M0 — Project foundation

Progress:

- [x] M0.1 Scaffold Next.js app
- [x] M0.2 Embed Sanity Studio
- [x] M0.3 Tracks + schemas
- [x] M0.4 Talk validations
- [x] M0.5 Typed data access
- [ ] M0.6 Seed content
- [ ] M0.7 Vercel + PR

- Next.js App Router + TypeScript (strict), npm, ESLint + Prettier, CSS Modules, Vitest.
- Sanity: Studio embedded at `/studio`, project `8tnqf6xe`.
- Schemas per DECISIONS.md: Speaker (with slug), Talk, Day, Site Settings (singleton); tracks (with descriptions) hard-coded.
- Talk validations: required fields, `endTime > startTime`, single keynote, room-clash warning.
- Seed content matching the Figma (20 speakers, 20 talks, 3 days).
- Vercel project + preview deployments.

**Done when:** `npm run dev` serves an empty app, Studio works at `/studio`, and seed content is queryable.

## M1 — Design system

Source: Figma variables (from `Desktop - Home`, `90:363`).

- **Colors**
  - Neutral: 900 `#00151d` (page bg), 800 `#001a24`, 600 `#33444a`, 200 `#c2c5c2`, 100 `#fcefe8`
  - Accent: green/200 `#d1ff66` (logo, links, active, focus)
  - Track colors: frontend = yellow/100 `#ffe6ba`, performance = red/100 `#fec9c3`, accessibility = blue/100 `#bbd8ff`, tooling = purple/100 `#ccc4fd`
  - Keynote: cyan/100 `#b5e9fc`
- **Typography** (fonts: Chakra Petch for headings, JetBrains Mono for body, both via `next/font`)
  - text-preset-1: Chakra Petch Bold 80 / 1.0 / -2
  - text-preset-2: Chakra Petch Bold 32 / 1.2
  - text-preset-3: Chakra Petch SemiBold 24 / 1.3
  - text-preset-4: Chakra Petch Bold 20 / 1.4
  - text-preset-5: JetBrains Mono 16 / 1.4 (Regular, Bold)
  - text-preset-6: JetBrains Mono 14 / 1.4 (Regular, Medium, ExtraBold)
  - text-preset-7: JetBrains Mono 12 / 1.4 / 0.5
- **Spacing scale:** 0, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80 (`spacing/0`–`spacing/1000`).
- **Globals:** reset, page container + gutters per breakpoint, breakpoint media queries, grid-paper background pattern, shared focus ring (dashed lime outline), `// label` section-heading style.

**Done when:** tokens are exposed as CSS custom properties, fonts load, and a `/dev/tokens` page (removed before launch) renders the palette and type scale.

## M2 — Components

Built against the Figma component sets, with every state from the design (default / hover / focus, plus the variants listed).

| Component         | Figma                                   | Variants / states                                                                                                                                                                                               |
| ----------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation        | `Navbar` section (`115:656`)            | desktop, tablet, mobile; active page; mobile menu open (`Mobile Nav`, `193:5254`)                                                                                                                               |
| Footer            | `Footer` section (`179:2571`)           | desktop, tablet, mobile; back-to-top                                                                                                                                                                            |
| Buttons           | from screens                            | primary (`VIEW TALK →`), outline (`VIEW ALL SPEAKERS`), nav button (active), icon close (×)                                                                                                                     |
| Filter chips      | `Desktop - Schedule`                    | day (square, selected = lime fill), track (pill), My Schedule (dashed), Clear (red)                                                                                                                             |
| Track card        | `Track` (`246:3640`)                    | default, hover, focus                                                                                                                                                                                           |
| Speaker card      | `Speaker` (`246:3624`)                  | default, hover, focus; background = track color, keynote = cyan; grid-paper photo area                                                                                                                          |
| Talk ticket       | `Schedule Component` (`129:787`)        | collapsed / expanded, saved / not saved, desktop / mobile; side tag = track or KEYNOTE; barcode; start/end time (12-hour, PDT/PST — not the design's 24-hour); "Day N" variant without star for Home highlights |
| Speaker modal     | `Speaker Modal Components` (`193:5252`) | desktop, tablet, mobile; overlay, close, focus trap, Esc to close                                                                                                                                               |
| Hero              | `Desktop - Home` → Hero                 | headline with outlined "HORIZON" text, date + venue                                                                                                                                                             |
| Keynote spotlight | `Desktop - Home` → Featured Keynote     | label, speaker, talk, time/room, CTA, cut-out photo                                                                                                                                                             |

**Done when:** each component renders all of its states on the `/dev` page at all three breakpoints, with keyboard and focus behavior working.

## M3 — Schedule page

Figma: `Desktop - Schedule` (`115:669`), `Tablet - Schedule` (`193:1423`), `Mobile - Schedule` (`193:1929`), hover states (`249:3909`), focus states (`249:4311`).

- Sanity query for talks with speaker, day, and track.
- Filter logic (Day × Track × My Schedule, combinable) + Vitest.
- Filter state ↔ URL (`?day=&track=&mine=1`), client-side.
- Saved talks in `localStorage` keyed by `_id`, with stale-ID cleanup + Vitest.
- Expand/collapse details, empty states (no talks match / nothing saved).

## M4 — Speakers page + modal

Figma: `Desktop/Tablet/Mobile - Speakers` (`133:1157`, `193:2621`, `193:3120`) and the `- Modal` variants (`193:3616`, `193:4048`, `193:4370`).

- Query speakers who have at least one talk; primary talk = earliest.
- Grid at 4 / 2 / 1 columns (check the tablet/mobile frames).
- Card → modal with bio + all talks (talk tickets, save toggle works here too).
- Modal state in the URL (`?speaker=<slug>`), client-side; shareable, closes cleanly with back/close/Esc.

## M5 — Home page

Figma: `Desktop - Home` (`90:363`), `Tablet - Home` (`173:1470`), `Mobile - Home` (`175:1774`), hover states (`210:4798`), focus states (`249:4251`).

- Hero from Site Settings.
- Keynote spotlight from the `isKeynote` talk.
- Track cards → `/schedule?track=<key>`.
- Featured-speaker (8) and schedule-highlight (4) selection rules + Vitest.
- "View all speakers" / "View full schedule" links.

Home comes last because it reuses components from every other page and has the most rule logic.

## M6 — Launch readiness

- Sanity webhook → on-demand revalidation, plus hourly fallback.
- Accessibility pass (keyboard, focus order, contrast, reduced motion, alt text).
- Metadata / OG image / favicon, 404 page.
- Lighthouse pass and real content entry.
- Transfer or share the Sanity and Vercel projects with the client.

---

## Design vs. DECISIONS.md — resolved

All five conflicts are settled in DECISIONS.md:

1. Times: 12-hour with PDT/PST (DECISIONS wins over the design).
2. Keynote speaker is eligible for Home featured speakers (design wins).
3. Tracks have hard-coded one-line descriptions (Home screen copy).
4. Keynote row shows a cyan "KEYNOTE" tag but still filters under its track.
5. Speaker modal is reflected in the URL (`/speakers?speaker=<slug>`); Speaker gets a `slug` field.
