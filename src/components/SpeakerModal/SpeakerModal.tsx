"use client";

import type { Ref } from "react";
import { useId, useLayoutEffect, useRef } from "react";

import { CloseIcon } from "@/components/icons/icons";
import { IconButton } from "@/components/IconButton/IconButton";
import type { SanityImageSource } from "@/components/SanityImage/SanityImage";
import { SanityImage } from "@/components/SanityImage/SanityImage";
import type { TalkTicketProps } from "@/components/TalkTicket/TalkTicket";
import { TalkTicket } from "@/components/TalkTicket/TalkTicket";
import type { TrackKey } from "@/lib/tracks";
import { useSavedTalks } from "@/lib/useSavedTalks";

import styles from "./SpeakerModal.module.css";

export type SpeakerModalTalk = TalkTicketProps & { id: string };

export type SpeakerModalProps = {
  name: string;
  jobTitle?: string | null;
  company?: string | null;
  bio?: string | null;
  /** Photo background: the primary talk's track, or the keynote color. */
  tint: TrackKey | "keynote";
  photo?: SanityImageSource;
  /** All of the speaker's talks, earliest first. */
  talks: SpeakerModalTalk[];
  onClose: () => void;
  /** Close button, backdrop and Escape call this first; return true if it closed the modal itself. */
  onRequestClose?: () => boolean;
  photoRef?: Ref<HTMLDivElement>;
};

/**
 * Speaker details ("Speaker Modal" in the design). Opens as soon as it mounts.
 * A native modal <dialog> handles the focus trap, Escape and returning focus.
 */
export function SpeakerModal({
  name,
  jobTitle,
  company,
  bio,
  tint,
  photo,
  talks,
  onClose,
  onRequestClose,
  photoRef,
}: SpeakerModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const { savedIds, toggle } = useSavedTalks();
  const role = [jobTitle, company && `@${company}`].filter(Boolean).join(" ");

  const requestClose = () => {
    if (!onRequestClose?.()) dialog.current?.close();
  };

  // A layout effect so the dialog is already open when a view transition takes its "after" snapshot.
  useLayoutEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!element.open) element.showModal();
    // Stop the page behind from scrolling while the modal is open.
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    // Don't call close() here: its async "close" event would run onClose after
    // a remount (e.g. Strict Mode) and shut the modal straight away. Unmounting
    // removes the dialog anyway.
    return () => {
      root.style.overflow = overflow;
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      className={styles.modal}
      aria-labelledby={headingId}
      // Unmount only after the closing transition, or it would be cut off.
      onClose={(event) => {
        const animations = event.currentTarget.getAnimations({
          subtree: true,
        });
        void Promise.all(animations.map((a) => a.finished)).then(
          onClose,
          onClose,
        );
      }}
      onCancel={(event) => {
        if (onRequestClose?.()) event.preventDefault();
      }}
      // The dialog is exactly the panel's size, so a click on the dialog itself is on the backdrop.
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div className={styles.panel} data-tint={tint}>
        <IconButton
          label="Close"
          onClick={requestClose}
          className={styles.close}
        >
          <CloseIcon />
        </IconButton>

        <div className={styles.header}>
          <div ref={photoRef} className={`grid-paper ${styles.photo}`}>
            <SanityImage
              image={photo}
              alt=""
              sizes="152px"
              className={styles.image}
            />
          </div>
          <div className={styles.who}>
            <h2 id={headingId} className={styles.name}>
              {name}
            </h2>
            {role && <p className={styles.role}>{role}</p>}
          </div>
        </div>

        {bio && (
          <>
            <hr className={styles.divider} />
            <p className={styles.bio}>{bio}</p>
          </>
        )}

        {talks.length > 0 && (
          <>
            <hr className={styles.divider} />
            <h3 className="section-label">
              {talks.length > 1 ? "// Talks" : "// Talk"}
            </h3>
            <ul role="list" className={styles.talks}>
              {talks.map(({ id, ...talk }) => (
                <li key={id}>
                  <TalkTicket
                    {...talk}
                    showDetails={false}
                    saved={savedIds.has(id)}
                    onToggleSave={() => toggle(id)}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </dialog>
  );
}
