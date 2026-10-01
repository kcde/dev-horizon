import Link from "next/link";

import type { PreviewStateProps } from "@/components/previewState";
import type { TrackKey } from "@/lib/tracks";
import { TRACKS } from "@/lib/tracks";

import styles from "./TrackCard.module.css";

type TrackCardProps = PreviewStateProps & {
  track: TrackKey;
  className?: string;
};

/** Track card from the design. Links to the schedule filtered by this track. */
export function TrackCard({ track, className, previewState }: TrackCardProps) {
  const { name, description } = TRACKS[track];
  return (
    <Link
      href={`/schedule?track=${track}`}
      className={[styles.card, className].filter(Boolean).join(" ")}
      data-track={track}
      data-preview-state={previewState}
    >
      <span className={styles.name}>{name}</span>
      <span className={styles.description}>{description}</span>
    </Link>
  );
}
