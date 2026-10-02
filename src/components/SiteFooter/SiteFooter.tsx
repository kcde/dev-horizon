import Link from "next/link";

import { Logo } from "@/components/Logo/Logo";
import { NAV_LINKS } from "@/lib/navigation";
import { TRACKS, TRACK_KEYS } from "@/lib/tracks";

import styles from "./SiteFooter.module.css";

type SiteFooterProps = {
  description: string;
  /** e.g. "Pier 70, San Francisco, CA". Split on the first comma for two lines. */
  venue?: string | null;
  eventDates?: string | null;
};

export function SiteFooter({
  description,
  venue,
  eventDates,
}: SiteFooterProps) {
  const [venueName, ...venueRest] = (venue ?? "").split(",");
  const venueLines = [
    venueName?.trim(),
    venueRest.join(",").trim(),
    eventDates,
  ].filter((line): line is string => Boolean(line));

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Logo className={styles.logo} />
          <p className={styles.tagline}>{description}</p>
        </div>

        <div className={styles.columns}>
          <nav aria-label="Footer" className={styles.column}>
            <h2 className={styles.heading}>{"// Navigate"}</h2>
            <ul role="list" className={styles.items}>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.column}>
            <h2 className={styles.heading}>{"// Tracks"}</h2>
            <ul role="list" className={styles.items}>
              {TRACK_KEYS.map((key) => (
                <li key={key}>
                  <Link href={`/schedule?track=${key}`} className={styles.link}>
                    {TRACKS[key].name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {venueLines.length > 0 && (
            <div className={styles.column}>
              <h2 className={styles.heading}>{"// Venue"}</h2>
              <address className={styles.items}>
                {venueLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
            </div>
          )}
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2026 DEVHORIZON. ALL RIGHTS RESERVED.</p>
        <a href="#top" className={styles.link}>
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
