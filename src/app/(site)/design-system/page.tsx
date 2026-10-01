import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { Button } from "@/components/Button/Button";
import { HorizonText } from "@/components/HorizonText/HorizonText";
import {
  ArrowRightIcon,
  BarsIcon,
  CloseIcon,
  MinusIcon,
  PlusIcon,
  StarIcon,
  StarSolidIcon,
} from "@/components/icons/icons";
import { Logo } from "@/components/Logo/Logo";
import { NavButton } from "@/components/NavButton/NavButton";
import { SpeakerCard } from "@/components/SpeakerCard/SpeakerCard";
import { TrackCard } from "@/components/TrackCard/TrackCard";
import { TRACK_KEYS } from "@/lib/tracks";
import { sanityFetch } from "@/sanity/fetch";
import { DESIGN_SYSTEM_SAMPLES_QUERY } from "@/sanity/queries";

import styles from "./page.module.css";
import { SaveableTicket } from "./SaveableTicket";
import { StateGrid } from "./StateGrid";

// Dev-only reference for tokens and (from M2) component states. Never ships.
export const metadata: Metadata = {
  title: "Design system · DevHorizon 26",
  robots: { index: false, follow: false },
};

const COLOR_GROUPS: { label: string; tokens: string[] }[] = [
  {
    label: "Neutral",
    tokens: [
      "neutral-0",
      "neutral-100",
      "neutral-200",
      "neutral-500",
      "neutral-600",
      "neutral-800",
      "neutral-900",
    ],
  },
  {
    label: "Accent and semantic",
    tokens: [
      "green-200",
      "yellow-100",
      "red-100",
      "red-300",
      "blue-100",
      "cyan-100",
      "purple-100",
    ],
  },
  {
    label: "Aliases",
    tokens: [
      "bg",
      "surface",
      "text",
      "text-muted",
      "accent",
      "danger",
      "border",
    ],
  },
  {
    label: "Tracks and keynote",
    tokens: [
      "track-frontend",
      "track-performance",
      "track-accessibility",
      "track-tooling",
      "keynote",
    ],
  },
];

const TYPE_PRESETS: { className: string; spec: string }[] = [
  {
    className: "text-preset-1",
    spec: "Chakra Petch 700 · 80 / 1.0 · -2px · mobile 38",
  },
  {
    className: "text-preset-2",
    spec: "Chakra Petch 700 · 32 / 1.2 · tablet 28 · mobile 24",
  },
  { className: "text-preset-3", spec: "Chakra Petch 600 · 24 / 1.3" },
  { className: "text-preset-4", spec: "Chakra Petch 700 · 20 / 1.4" },
  { className: "text-preset-5", spec: "JetBrains Mono 400 · 16 / 1.4" },
  { className: "text-preset-5-bold", spec: "JetBrains Mono 700 · 16 / 1.4" },
  { className: "text-preset-6", spec: "JetBrains Mono 400 · 14 / 1.4" },
  { className: "text-preset-6-medium", spec: "JetBrains Mono 500 · 14 / 1.4" },
  {
    className: "text-preset-6-extrabold",
    spec: "JetBrains Mono 800 · 14 / 1.4",
  },
  { className: "text-preset-7", spec: "JetBrains Mono 400 · 12 / 1.4 · 0.5px" },
];

const SPACING = [
  "025",
  "050",
  "075",
  "100",
  "125",
  "150",
  "200",
  "250",
  "300",
  "400",
  "500",
  "600",
  "800",
  "1000",
  "1200",
  "1400",
  "1600",
  "1800",
];

const RADII = ["0", "4", "6", "8", "10", "12", "16", "20", "24", "full"];

export default async function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const samples = await sanityFetch({
    query: DESIGN_SYSTEM_SAMPLES_QUERY,
    tags: ["speaker", "talk", "day"],
  });
  const speakerCards = samples.speakers.map((speaker) => ({
    slug: speaker.slug ?? "",
    name: speaker.name ?? "",
    jobTitle: speaker.jobTitle,
    company: speaker.company,
    talkTitle: speaker.talk?.title,
    tint: speaker.talk?.isKeynote
      ? ("keynote" as const)
      : (speaker.talk?.track ?? "frontend"),
    photo: speaker.photo,
  }));
  const [firstSpeaker] = speakerCards;
  const tickets = samples.talks.map((talk) => ({
    title: talk.title ?? "",
    description: talk.description,
    speakerName: talk.speaker?.name,
    company: talk.speaker?.company,
    track: talk.track ?? "frontend",
    isKeynote: talk.isKeynote,
    startTime: talk.startTime ?? "",
    endTime: talk.endTime ?? "",
    date: talk.day?.date ?? "",
    dayLabel: talk.day?.label,
    location: talk.location,
  }));
  const [keynoteTicket, secondTicket, thirdTicket] = tickets;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className="section-label">{"// design system"}</p>
        <h1 className="text-preset-1">design system</h1>
        <p className={`text-preset-6 ${styles.muted}`}>
          Dev-only. Values come from src/styles/tokens.css and typography.css.
          Resize below 1024px and 442px to see the tablet and mobile values.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className="section-label">{"// components"}</h2>
        <StateGrid
          title="Button · primary"
          render={(state) => (
            <Button href="#" previewState={state}>
              View all speakers
            </Button>
          )}
        />
        <div className={styles.lightPanel}>
          <StateGrid
            title="Button · light (keynote surface)"
            render={(state) => (
              <Button href="#" variant="light" arrow previewState={state}>
                View talk
              </Button>
            )}
          />
        </div>
        <StateGrid
          title="NavButton"
          render={(state) => (
            <NavButton href="#" previewState={state}>
              Schedule
            </NavButton>
          )}
        />
        <StateGrid
          title="TrackCard"
          minColumnWidth="300px"
          render={(state) => (
            <TrackCard track="frontend" previewState={state} className="fill" />
          )}
        />
        <div className={styles.group}>
          <h3 className="text-preset-4">TrackCard · all tracks</h3>
          <div className={styles.trackRow}>
            {TRACK_KEYS.map((key) => (
              <TrackCard key={key} track={key} />
            ))}
          </div>
        </div>
        {firstSpeaker && (
          <StateGrid
            title="SpeakerCard"
            minColumnWidth="300px"
            render={(state) => (
              <SpeakerCard
                {...firstSpeaker}
                previewState={state}
                className="fill"
              />
            )}
          />
        )}
        <div className={styles.group}>
          <h3 className="text-preset-4">SpeakerCard · tints</h3>
          <div className={styles.cardRow}>
            {speakerCards.map((card) => (
              <SpeakerCard key={card.slug} {...card} />
            ))}
          </div>
        </div>
        {keynoteTicket && secondTicket && thirdTicket && (
          <div className={styles.group}>
            <h3 className="text-preset-4">TalkTicket</h3>
            <p className={`text-preset-7 ${styles.muted}`}>
              keynote · expanded / collapsed · saved (click the stars) /
              highlight variant
            </p>
            <div className={styles.ticketStack}>
              <SaveableTicket {...keynoteTicket} defaultExpanded />
              <SaveableTicket {...secondTicket} />
              <SaveableTicket {...thirdTicket} saved />
              <SaveableTicket {...thirdTicket} variant="highlight" />
            </div>
          </div>
        )}
        <div className={styles.group}>
          <h3 className="text-preset-4">NavButton · active</h3>
          <div>
            <NavButton href="#" active>
              Home
            </NavButton>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className="section-label">{"// color"}</h2>
        {COLOR_GROUPS.map((group) => (
          <div key={group.label} className={styles.group}>
            <h3 className="text-preset-4">{group.label}</h3>
            <ul role="list" className={styles.swatches}>
              {group.tokens.map((token) => (
                <li key={token} className={styles.swatch}>
                  <span
                    className={styles.chip}
                    style={{ background: `var(--color-${token})` }}
                  />
                  <code className="text-preset-7">--color-{token}</code>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className="section-label">{"// typography"}</h2>
        {TYPE_PRESETS.map((preset) => (
          <div key={preset.className} className={styles.typeRow}>
            <div className={styles.typeMeta}>
              <code className="text-preset-7">.{preset.className}</code>
              <span className={`text-preset-7 ${styles.muted}`}>
                {preset.spec}
              </span>
            </div>
            <p className={preset.className}>where code meets the machine_</p>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className="section-label">{"// spacing"}</h2>
        <ul role="list" className={styles.scale}>
          {SPACING.map((step) => (
            <li key={step} className={styles.scaleRow}>
              <code className="text-preset-7">--space-{step}</code>
              <span
                className={styles.bar}
                style={{ width: `var(--space-${step})` }}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className="section-label">{"// radius"}</h2>
        <ul role="list" className={styles.radii}>
          {RADII.map((radius) => (
            <li key={radius} className={styles.radiusItem}>
              <span
                className={styles.radiusBox}
                style={{ borderRadius: `var(--radius-${radius})` }}
              />
              <code className="text-preset-7">--radius-{radius}</code>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className="section-label">{"// focus"}</h2>
        <p className={`text-preset-6 ${styles.muted}`}>
          Press Tab to move through these.
        </p>
        <div className={styles.focusRow}>
          <button
            type="button"
            className={`text-preset-6 ${styles.sampleButton}`}
          >
            dark surface
          </button>
          <div
            className={styles.lightSurface}
            style={
              { "--focus-color": "var(--color-neutral-600)" } as CSSProperties
            }
          >
            <button
              type="button"
              className={`text-preset-6 ${styles.sampleButtonLight}`}
            >
              light surface
            </button>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className="section-label">{"// icons & brand"}</h2>
        <div className={styles.iconRow}>
          <ArrowRightIcon />
          <BarsIcon />
          <CloseIcon />
          <PlusIcon />
          <MinusIcon />
          <StarIcon />
          <StarSolidIcon />
        </div>
        <Logo className={styles.logoSample} />
        <div className={styles.horizonSample}>
          <HorizonText opacity={0.3} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className="section-label">{"// utilities"}</h2>
        <div className={styles.utilities}>
          <div className={`grid-paper ${styles.paper}`}>
            <span className="text-preset-7">.grid-paper</span>
          </div>
          <div className={`grid-paper ${styles.paper} ${styles.paperKeynote}`}>
            <span className="text-preset-7">.grid-paper on keynote</span>
          </div>
        </div>
      </section>
    </main>
  );
}
