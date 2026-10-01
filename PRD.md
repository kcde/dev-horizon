# Product Requirements Document — Dev Horizon

**A website for a 3-day tech conference: browse speakers, filter the schedule, save talks**

---

## 1. Overview

Dev Horizon is a 3-day tech conference with speakers scheduled across multiple days and tracks. The website is the primary tool for attendees to discover speakers and plan which talks to attend, and for the client to publish and update conference content without developer involvement.

**Site structure:** 3 pages — Home, Speakers, Schedule **Content:** Fully managed through a headless CMS (Sanity)

---

## 2. Goals

- Give attendees a fast way to browse speakers and plan their 3 days
- Let the client manage all conference content (speakers, talks, schedule, photos) without touching code
- Ship a lightweight, low-maintenance build — no accounts, no backend beyond the CMS

---

## 3. Users

| User | Needs |
| --- | --- |
| **Attendee** | Browse speakers, see what's happening each day/track, bookmark talks they plan to attend |
| **Client (conference organizer)** | Add/edit speakers, talks, and schedule via CMS; feature specific content on the homepage indirectly through scheduling |
| **Keside (developer)** | Build and maintain the site; also enters some content alongside the client |

---

## 4. Pages & Features

### 4.1 Home

- Hero section with event name, tagline, dates, and venue
- Featured Keynote spotlight — pulled from the Talk marked `isKeynote`
- Track overview — 4 cards (Frontend, Performance, Accessibility, Tooling) with short descriptions
- Featured speakers — 8 speakers shown (2 per track, earliest time slot within each track)
- Schedule highlights — 4 talks shown (1 per track, earliest time slot within each track)
- Links to full Speakers and Schedule pages

### 4.2 Speakers

- Grid of all speakers: photo, name, job title, company, and their talk title
- No manual curation — every speaker in the CMS appears here

### 4.3 Schedule

- Combined filter bar: **Day** (01/02/03) + **Track** (Performance/Frontend/Accessibility/Tooling) + **My Schedule** (saved-only view) + Clear — all filters combinable
- Each talk row: track color tag, title, speaker + company, start/end time, expandable details (description + location), and a save/bookmark toggle
- **Save Talks:** client-side only, stored in the browser via `localStorage`. No login or account system — saved talks are per-device/per-browser and do not sync across devices.

---

## 5. Content Model (CMS Schema)

| Type | Fields |
| --- | --- |
| **Speaker** | name, jobTitle, company, photo, bio |
| **Talk** | title, description, speaker (single reference — a talk never has more than one), day (reference), track (reference), startTime, endTime, location, isKeynote (boolean) |
| **Track** | name, color — fixed list, not client-editable |
| **Day** | date, label (e.g. "Day 1") |

**Relationships:** Talk → Speaker is a one-way reference. The Speaker's own talks are retrieved by querying Talks where the speaker reference matches — nothing is duplicated or stored on the Speaker side.

**Keynote handling:** Not a 5th track. It's a boolean flag on Talk (`isKeynote`), so a keynote talk still belongs to a real track and simply gets an additional visual treatment.

**Featured/highlight selection:** No manual "featured" flag anywhere in the schema. Homepage featured speakers and schedule highlights are both derived by rule (per-track, earliest time slot) rather than curated by the client.

---

## 6. Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js (App Router) |
| CMS | Sanity |
| Styling | CSS Modules |
| Saved talks | Browser `localStorage` — no auth |
| Hosting | Vercel |

---

## 7. Out of Scope (for this build)

- User accounts / login
- Ticketing or payment
- Speaker self-service portal
- Cross-device sync of saved talks

---

## 8. Open Items (not yet decided)

- Domain & environments — staging URL for client review, or straight to production
- Speaker photo spec (aspect ratio / resolution requirements)
- Timeline and budget

---

## 9. Success Criteria

- Client can independently add/edit a speaker or talk and see it reflected correctly across Home, Speakers, and Schedule
- Attendees can filter the schedule by any combination of day and track, and save talks that persist on return visits to the same browser
- Site is fully populated and live ahead of the conference dates