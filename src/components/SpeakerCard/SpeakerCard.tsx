"use client";

import { useState } from "react";

import type { PreviewStateProps } from "@/components/previewState";
import type { SanityImageSource } from "@/components/SanityImage/SanityImage";
import { SanityImage } from "@/components/SanityImage/SanityImage";
import type { SpeakerModalTalk } from "@/components/SpeakerModal/SpeakerModal";
import { SpeakerModal } from "@/components/SpeakerModal/SpeakerModal";
import type { TrackKey } from "@/lib/tracks";

import styles from "./SpeakerCard.module.css";

export type SpeakerCardProps = PreviewStateProps & {
  name: string;
  jobTitle?: string | null;
  company?: string | null;
  bio?: string | null;
  /** Title of the talk shown on the card (the speaker's primary talk). */
  talkTitle?: string | null;
  /** Photo background: the primary talk's track, or the keynote color. */
  tint: TrackKey | "keynote";
  photo?: SanityImageSource;
  /** Every talk by this speaker, shown in the modal. */
  talks: SpeakerModalTalk[];
  className?: string;
};

/** Speaker card from the design. Clicking it opens the speaker modal in place. */
export function SpeakerCard({
  name,
  jobTitle,
  company,
  bio,
  talkTitle,
  tint,
  photo,
  talks,
  className,
  previewState,
}: SpeakerCardProps) {
  const [open, setOpen] = useState(false);
  const role = [jobTitle, company].filter(Boolean).join(" @ ");

  return (
    <>
      <article
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
            <h3 className={styles.name}>
              {/* Covers the whole card (see .open::after). */}
              <button
                type="button"
                className={styles.open}
                aria-haspopup="dialog"
                onClick={() => setOpen(true)}
              >
                {name}
              </button>
            </h3>
            {role && <p className={styles.role}>{role}</p>}
          </div>
          {talkTitle && (
            <>
              <hr className={styles.divider} />
              <p className={styles.talk}>{talkTitle}</p>
            </>
          )}
        </div>
      </article>

      {open && (
        <SpeakerModal
          name={name}
          jobTitle={jobTitle}
          company={company}
          bio={bio}
          tint={tint}
          photo={photo}
          talks={talks}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
