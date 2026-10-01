import Link from "next/link";

import type { PreviewStateProps } from "@/components/previewState";
import type { SanityImageSource } from "@/components/SanityImage/SanityImage";
import { SanityImage } from "@/components/SanityImage/SanityImage";
import type { TrackKey } from "@/lib/tracks";

import styles from "./SpeakerCard.module.css";

export type SpeakerCardProps = PreviewStateProps & {
  slug: string;
  name: string;
  jobTitle?: string | null;
  company?: string | null;
  /** Title of the speaker's primary (earliest) talk. */
  talkTitle?: string | null;
  /** Photo background: the primary talk's track, or the keynote color. */
  tint: TrackKey | "keynote";
  photo?: SanityImageSource;
  className?: string;
};

/** Speaker card from the design. Opens the speaker modal on /speakers (M5). */
export function SpeakerCard({
  slug,
  name,
  jobTitle,
  company,
  talkTitle,
  tint,
  photo,
  className,
  previewState,
}: SpeakerCardProps) {
  const role = [jobTitle, company].filter(Boolean).join(" @ ");
  return (
    <Link
      href={`/speakers?speaker=${slug}`}
      className={[styles.card, className].filter(Boolean).join(" ")}
      data-tint={tint}
      data-preview-state={previewState}
    >
      <div className={`grid-paper ${styles.photo}`}>
        <SanityImage
          image={photo}
          alt=""
          sizes="(max-width: 441px) 100vw, (max-width: 1023px) 50vw, 340px"
          className={styles.image}
        />
      </div>
      <div className={styles.body}>
        <div className={styles.who}>
          <h3 className={styles.name}>{name}</h3>
          {role && <p className={styles.role}>{role}</p>}
        </div>
        {talkTitle && (
          <>
            <hr className={styles.divider} />
            <p className={styles.talk}>{talkTitle}</p>
          </>
        )}
      </div>
    </Link>
  );
}
