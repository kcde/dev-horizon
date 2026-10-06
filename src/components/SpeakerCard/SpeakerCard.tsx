"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";

import type { PreviewStateProps } from "@/components/previewState";
import type { SanityImageSource } from "@/components/SanityImage/SanityImage";
import { SanityImage } from "@/components/SanityImage/SanityImage";
import type { SpeakerModalTalk } from "@/components/SpeakerModal/SpeakerModal";
import { SpeakerModal } from "@/components/SpeakerModal/SpeakerModal";
import type { TrackKey } from "@/lib/tracks";

import styles from "./SpeakerCard.module.css";
import { useMagneticPull } from "./useMagneticPull";

const PHOTO_TRANSITION = "speaker-photo";
const IMAGE_WAIT_MS = 300;

const canMorph = () =>
  typeof document.startViewTransition === "function" &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Flies the photo between the card and the modal with a view transition. Only one element may
 * carry the name at a time, so it moves from `from` to `to` inside the update.
 */
function morphPhoto(
  update: () => void,
  from: HTMLElement | null,
  to: () => HTMLElement | null,
  afterUpdate?: () => void,
) {
  const root = document.documentElement;
  if (from) from.style.viewTransitionName = PHOTO_TRANSITION;
  root.dataset.vt = "speaker";
  const transition = document.startViewTransition(async () => {
    if (from) from.style.viewTransitionName = "";
    flushSync(update);
    afterUpdate?.();
    const target = to();
    if (!target) return;
    target.style.viewTransitionName = PHOTO_TRANSITION;
    // The modal's photo is a different (smaller) image file: give it a moment to load so the
    // photo doesn't land empty. The page stays frozen on the "before" snapshot meanwhile.
    const image = target.querySelector("img");
    if (image)
      await Promise.race([
        image.decode().catch(() => {}),
        new Promise((resolve) => setTimeout(resolve, IMAGE_WAIT_MS)),
      ]);
  });
  void transition.finished.finally(() => {
    const target = to();
    if (target) target.style.viewTransitionName = "";
    delete root.dataset.vt;
  });
}

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
  const cardRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const modalPhotoRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  useMagneticPull(cardRef, photoRef);

  const openModal = () => {
    if (!canMorph()) return setOpen(true);
    morphPhoto(
      () => setOpen(true),
      photoRef.current,
      () => modalPhotoRef.current,
    );
  };

  const closeModal = () => {
    if (!canMorph()) return false;
    morphPhoto(
      () => setOpen(false),
      modalPhotoRef.current,
      () => photoRef.current,
      // Unmounting skips the dialog's own focus return.
      () => openButtonRef.current?.focus({ preventScroll: true }),
    );
    return true;
  };
  const role = [jobTitle, company].filter(Boolean).join(" @ ");

  return (
    <>
      <article
        ref={cardRef}
        className={[styles.card, className].filter(Boolean).join(" ")}
        data-tint={tint}
        data-preview-state={previewState}
      >
        <div ref={photoRef} className={`grid-paper ${styles.photo}`}>
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
                ref={openButtonRef}
                aria-haspopup="dialog"
                onClick={openModal}
              >
                {name}
              </button>
            </h3>
            {role && <p className={styles.role}>{role}</p>}
          </div>
          {talkTitle && (
            <>
              <hr className={styles.divider} />
              <p className={styles.talk}>
                <span className={styles.talkText}>{talkTitle}</span>
              </p>
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
          onRequestClose={closeModal}
          photoRef={modalPhotoRef}
        />
      )}
    </>
  );
}
