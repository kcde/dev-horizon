"use client";

import { useId, useState } from "react";

import {
  MinusIcon,
  PlusIcon,
  StarIcon,
  StarSolidIcon,
} from "@/components/icons/icons";
import { formatTime, timeZoneLabel } from "@/lib/time";
import type { TrackKey } from "@/lib/tracks";
import { TRACKS } from "@/lib/tracks";

import styles from "./TalkTicket.module.css";

export type TalkTicketProps = {
  title: string;
  description?: string | null;
  speakerName?: string | null;
  company?: string | null;
  track: TrackKey;
  isKeynote?: boolean | null;
  /** "HH:mm", conference-local. */
  startTime: string;
  endTime: string;
  /** The talk's day ("YYYY-MM-DD"), used for the PDT/PST label. */
  date: string;
  /** e.g. "Day 1". Shown instead of the save star in the highlight variant. */
  dayLabel?: string | null;
  location?: string | null;
  /** "highlight" is the Home page row: shows the day, no save star. */
  variant?: "schedule" | "highlight";
  saved?: boolean;
  onToggleSave?: () => void;
  defaultExpanded?: boolean;
  className?: string;
};

/** Schedule row ("Schedule Component" in the design). Responsive: one component for all sizes. */
export function TalkTicket({
  title,
  description,
  speakerName,
  company,
  track,
  isKeynote = false,
  startTime,
  endTime,
  date,
  dayLabel,
  location,
  variant = "schedule",
  saved = false,
  onToggleSave,
  defaultExpanded = false,
  className,
}: TalkTicketProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const detailsId = useId();
  const tag = isKeynote ? "Keynote" : TRACKS[track].name;
  const hasDetails = Boolean(description || location);

  return (
    <article
      className={[styles.ticket, className].filter(Boolean).join(" ")}
      data-tint={isKeynote ? "keynote" : track}
    >
      <div className={styles.tag}>
        <span className={styles.tagText}>{tag}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.heading}>
          <h3 className={styles.title}>{title}</h3>
          {speakerName && (
            <p className={styles.speaker}>
              <span className={styles.speakerName}>{speakerName}</span>
              {company && (
                <>
                  <span className={styles.muted} aria-hidden="true">
                    {" // "}
                  </span>
                  <span className={`visually-hidden`}>, </span>
                  <span className={styles.muted}>{company}</span>
                </>
              )}
            </p>
          )}
        </div>

        {hasDetails && (
          <>
            <div id={detailsId} className={styles.details} hidden={!expanded}>
              {description && <p>{description}</p>}
              {location && (
                <p className={styles.location}>Location: {location}</p>
              )}
            </div>
            <button
              type="button"
              className={styles.toggle}
              aria-expanded={expanded}
              aria-controls={detailsId}
              onClick={() => setExpanded((open) => !open)}
            >
              {expanded ? <MinusIcon /> : <PlusIcon />}
              {expanded ? "Hide details" : "Show details"}
              <span className="visually-hidden">: {title}</span>
            </button>
          </>
        )}
      </div>

      <div className={styles.stub}>
        <p className={styles.times}>
          <span className={styles.start}>{formatTime(startTime)}</span>
          <span className={styles.end}>
            <span className="visually-hidden">to </span>
            {formatTime(endTime)} {timeZoneLabel(date)}
          </span>
        </p>
        <span className={styles.barcode} aria-hidden="true" />
        {variant === "highlight" ? (
          dayLabel && <span className={styles.day}>{dayLabel}</span>
        ) : (
          <button
            type="button"
            className={styles.save}
            aria-pressed={saved}
            onClick={onToggleSave}
          >
            {saved ? <StarSolidIcon /> : <StarIcon />}
            <span className="visually-hidden">
              {saved ? "Remove from my schedule" : "Save to my schedule"}:{" "}
              {title}
            </span>
          </button>
        )}
      </div>
    </article>
  );
}
