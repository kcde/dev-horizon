import { HorizonText } from "@/components/HorizonText/HorizonText";

import styles from "./Hero.module.css";

type HeroProps = {
  /** Site Settings tagline, e.g. "where code meets the machine_". */
  tagline: string;
  eventDates?: string | null;
  venue?: string | null;
  /** Opacity of the outlined "HORIZON" behind the headline. */
  horizonOpacity?: number;
  className?: string;
};

/** Home hero panel from the design. */
export function Hero({
  tagline,
  eventDates,
  venue,
  horizonOpacity,
  className,
}: HeroProps) {
  return (
    <section className={[styles.hero, className].filter(Boolean).join(" ")}>
      <h1 className={styles.headline}>{tagline}</h1>
      {(eventDates || venue) && (
        <p className={styles.meta}>
          {eventDates && <span>{eventDates}</span>}
          {venue && <span>{venue}</span>}
        </p>
      )}
      <div className={styles.horizon}>
        <HorizonText opacity={horizonOpacity} className={styles.horizonSvg} />
      </div>
    </section>
  );
}
