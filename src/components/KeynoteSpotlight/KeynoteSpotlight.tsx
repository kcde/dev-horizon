import type { CSSProperties } from "react";

import { Button } from "@/components/Button/Button";
import type { SanityImageSource } from "@/components/SanityImage/SanityImage";
import { SanityImage } from "@/components/SanityImage/SanityImage";
import { formatShortDate, formatTime, timeZoneLabel } from "@/lib/time";

import styles from "./KeynoteSpotlight.module.css";

type KeynoteSpotlightProps = {
  speakerName: string;
  jobTitle?: string | null;
  company?: string | null;
  talkTitle: string;
  /** "YYYY-MM-DD" */
  date: string;
  /** "HH:mm" */
  startTime: string;
  location?: string | null;
  photo?: SanityImageSource;
  /** Where "View talk" goes. */
  href: string;
  className?: string;
};

/** "Featured Keynote" panel from the Home design. */
export function KeynoteSpotlight({
  speakerName,
  jobTitle,
  company,
  talkTitle,
  date,
  startTime,
  location,
  photo,
  href,
  className,
}: KeynoteSpotlightProps) {
  const role = [jobTitle, company && `@${company}`].filter(Boolean).join(" ");
  const when = [
    formatShortDate(date),
    `${formatTime(startTime)} ${timeZoneLabel(date)}`,
    location,
  ]
    .filter(Boolean)
    .join(" / ");

  return (
    <section
      className={[styles.spotlight, className].filter(Boolean).join(" ")}
      aria-labelledby="keynote-heading"
      // Focus rings on this light surface use a dark color instead of lime.
      style={{ "--focus-color": "var(--color-neutral-600)" } as CSSProperties}
    >
      <div className={styles.circles} aria-hidden="true">
        <span />
        <span />
      </div>

      <div className={styles.info}>
        <div className={styles.speaker}>
          <p className={styles.label}>{"// Featured keynote"}</p>
          <div className={styles.who}>
            <h2 id="keynote-heading" className={styles.name}>
              {speakerName}
            </h2>
            {role && <p className={styles.muted}>{role}</p>}
          </div>
        </div>

        <div className={styles.talk}>
          <div className={styles.talkText}>
            <p className={styles.talkTitle}>{talkTitle}</p>
            <p className={styles.muted}>{when}</p>
          </div>
          <Button href={href} variant="light" arrow className={styles.button}>
            View talk
          </Button>
        </div>
      </div>

      <div className={styles.photoFrame}>
        <div className={styles.photo}>
          <SanityImage
            image={photo}
            alt=""
            sizes="482px"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
