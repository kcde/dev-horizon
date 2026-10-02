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
- [x] M0.6 Seed content
- [x] M0.7 Vercel + PR

- Next.js App Router + TypeScript (strict), npm, ESLint + Prettier, CSS Modules, Vitest.
- Sanity: Studio embedded at `/studio`, project `8tnqf6xe`.
- Schemas per DECISIONS.md: Speaker (with slug), Talk, Day, Site Settings (singleton); tracks (with descriptions) hard-coded.
- Talk validations: required fields, `endTime > startTime`, single keynote, room-clash warning.
- Seed content matching the Figma (20 speakers, 20 talks, 3 days).
- Vercel project + preview deployments.

**Done when:** `npm run dev` serves an empty app, Studio works at `/studio`, and seed content is queryable.

## M1 — Design system

Progress:

- [x] M1.1 Separate site and Studio layouts
- [x] M1.2 Tokens
- [x] M1.3 Fonts
- [x] M1.4 Type presets
- [x] M1.5 Global styles + layout primitives
- [x] M1.6 /design-system preview page
- [x] M1.7 Docs + PR

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

**Done when:** tokens are exposed as CSS custom properties, fonts load self-hosted, and the dev-only `/design-system` page shows every token at all three breakpoints. Home (M3) is then built only from these tokens.

M1, M2 and M3 run together. The Home page is where the tokens and components get looked at and adjusted, so each component is built and then used on Home right away.

## M2 — Components (the ones Home uses)

Progress:

- [x] M2.1 Foundations (icons, logo, time format, images, preview harness)
- [x] M2.2 Buttons
- [x] M2.3 Navigation + footer
- [x] M2.4 Track card
- [x] M2.5 Speaker card
- [x] M2.6 Talk ticket
- [x] M2.7 Hero + keynote spotlight
- [x] M2.8 Keyboard/visual pass + docs

Built against the Figma component sets, with every state from the design (default / hover / focus, plus the variants listed). Components that only Schedule or Speakers use are built in those milestones.

| Component         | Figma                               | Variants / states                                                                                                                                                                                               |
| ----------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation        | `Navbar` section (`115:656`)        | desktop, tablet, mobile; active page; mobile menu open (`Mobile Nav`, `193:5254`)                                                                                                                               |
| Footer            | `Footer` section (`179:2571`)       | desktop, tablet, mobile; back-to-top                                                                                                                                                                            |
| Buttons           | from screens                        | primary (`VIEW TALK →`), outline (`VIEW ALL SPEAKERS`), nav button (active)                                                                                                                                     |
| Hero              | `Desktop - Home` → Hero             | headline with outlined "HORIZON" text, date + venue                                                                                                                                                             |
| Keynote spotlight | `Desktop - Home` → Featured Keynote | label, speaker, talk, time/room, CTA, cut-out photo                                                                                                                                                             |
| Track card        | `Track` (`246:3640`)                | default, hover, focus                                                                                                                                                                                           |
| Speaker card      | `Speaker` (`246:3624`)              | default, hover, focus; background = track color, keynote = cyan; grid-paper photo area                                                                                                                          |
| Talk ticket       | `Schedule Component` (`129:787`)    | collapsed / expanded, saved / not saved, desktop / mobile; side tag = track or KEYNOTE; barcode; start/end time (12-hour, PDT/PST — not the design's 24-hour); "Day N" variant without star for Home highlights |

**Done when:** each component matches the design at all three breakpoints on the Home page, with keyboard and focus behavior working.

## M3 — Home page

Progress:

- [x] M3.1 Home query
- [x] M3.2 Featured-speaker and highlight selection + Vitest
- [x] M3.3 Page assembly
- [x] M3.4 Checks + visual/keyboard pass
- [x] M3.5 Design review rounds (Keside's feedback folded back into tokens and components)

Figma: `Desktop - Home` (`90:363`), `Tablet - Home` (`173:1470`), `Mobile - Home` (`175:1774`), hover states (`210:4798`), focus states (`249:4251`). Also the Claude Design handoff (`Home.dc.html`).

- Hero from Site Settings.
- Keynote spotlight from the `isKeynote` talk.
- Track cards → `/schedule?track=<key>`.
- Featured-speaker (8) and schedule-highlight (4) selection rules + Vitest.
- "View all speakers" / "View full schedule" links.

## M4 — Schedule page

Progress:

- [x] M4.1 Schedule query + shared talk mapping
- [x] M4.2 Filter logic + URL parse/serialize + Vitest
- [x] M4.3 Saved-talks storage + Vitest
- [x] M4.4 Filter chips (+ /design-system states)
- [ ] M4.5 Page assembly (filters, list, empty states)
- [ ] M4.6 Saving in the speaker modal + docs
- [ ] M4.7 Checks + visual/keyboard pass
- [ ] M4.8 Design review rounds

Figma: `Desktop - Schedule` (`115:669`), `Tablet - Schedule` (`193:1423`), `Mobile - Schedule` (`193:1929`), hover states (`249:3909`), focus states (`249:4311`).

- New component: filter chips: day (square, selected = lime fill), track (pill), My Schedule (dashed), Clear (red).
- Sanity query for talks with speaker, day, and track.
- Filter logic (Day × Track × My Schedule, combinable) + Vitest.
- Filter state ↔ URL (`?day=&track=&mine=1`), client-side.
- Saved talks in `localStorage` keyed by `_id`, with stale-ID cleanup + Vitest.
- Expand/collapse details, empty states (no talks match / nothing saved).

## M5 — Speakers page + modal

Figma: `Desktop/Tablet/Mobile - Speakers` (`133:1157`, `193:2621`, `193:3120`) and the `- Modal` variants (`193:3616`, `193:4048`, `193:4370`).

- Speaker modal: already built during the M3 review (`SpeakerModal`, owned by `SpeakerCard`). Speakers only needs to pass each card its bio and talks.
- Query speakers who have at least one talk; primary talk = earliest.
- Grid at 4 / 2 / 1 columns (check the tablet/mobile frames).
- Card → modal with bio + all talks (talk tickets; the save star works once M4 lands).

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
2. Keynote speaker always leads Home featured speakers (design wins); the other 7 come from the tracks.
3. Tracks have hard-coded one-line descriptions (Home screen copy).
4. The keynote is not a track: its row shows a cyan "KEYNOTE" tag, it never shows under a track filter, and it's left out of Home highlights.
5. Speaker modal opens in place from any speaker card and isn't in the URL (changed during the M3 review). Speaker keeps a `slug` field as a stable identifier.
