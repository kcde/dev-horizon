import { Button } from "@/components/Button/Button";
import { Hero } from "@/components/Hero/Hero";
import { KeynoteSpotlight } from "@/components/KeynoteSpotlight/KeynoteSpotlight";
import { SpeakerCard } from "@/components/SpeakerCard/SpeakerCard";
import { TalkTicket } from "@/components/TalkTicket/TalkTicket";
import { TrackCard } from "@/components/TrackCard/TrackCard";
import { selectFeaturedSpeakers, selectHighlights } from "@/lib/homeSelection";
import type { SpeakerTalk } from "@/lib/speakers";
import { speakerCardProps, toSpeakerTalk } from "@/lib/speakers";
import { TRACK_KEYS } from "@/lib/tracks";
import { sanityFetch } from "@/sanity/fetch";
import { HOME_QUERY } from "@/sanity/queries";

import styles from "./page.module.css";

export default async function HomePage() {
  const { settings, talks } = await sanityFetch({
    query: HOME_QUERY,
    tags: ["siteSettings", "talk", "speaker", "day"],
  });

  const speakerTalks = talks
    .map(toSpeakerTalk)
    .filter((talk): talk is SpeakerTalk => talk !== null);
  const keynote = speakerTalks.find((talk) => talk.isKeynote);
  const featured = selectFeaturedSpeakers(speakerTalks);
  const highlights = selectHighlights(speakerTalks);
  // Every talk per speaker, for their modal. speakerTalks is already earliest-first.
  const talksBySpeaker = Map.groupBy(speakerTalks, (talk) => talk.speakerSlug);

  return (
    <div className={styles.page}>
      {(settings?.tagline || keynote) && (
        <div className={styles.heroRow}>
          {settings?.tagline && (
            <Hero
              tagline={settings.tagline}
              eventDates={settings.eventDates}
              venue={settings.venue}
              className={styles.hero}
            />
          )}
          {keynote && (
            <KeynoteSpotlight
              speakerName={keynote.speaker.name ?? ""}
              jobTitle={keynote.speaker.jobTitle}
              company={keynote.speaker.company}
              talkTitle={keynote.title}
              date={keynote.date}
              startTime={keynote.startTime}
              location={keynote.location}
              photo={keynote.speaker.photo}
              href={
                keynote.ticket.slug
                  ? `/schedule?talk=${keynote.ticket.slug}`
                  : "/schedule"
              }
              className={styles.keynote}
            />
          )}
        </div>
      )}

      <section className={styles.sectionBody} aria-labelledby="tracks-heading">
        <h2 id="tracks-heading" className="section-label">
          {"// Tracks"}
        </h2>
        <ul role="list" className={styles.trackGrid}>
          {TRACK_KEYS.map((track) => (
            <li key={track}>
              <TrackCard track={track} className={styles.fill} />
            </li>
          ))}
        </ul>
      </section>

      {featured.length > 0 && (
        <section className={styles.section} aria-labelledby="speakers-heading">
          <div className={styles.sectionBody}>
            <h2 id="speakers-heading" className="section-label">
              {"// Featured_speakers"}
            </h2>
            <ul role="list" className={styles.speakerGrid}>
              {featured.map((talk) => (
                <li key={talk.id}>
                  <SpeakerCard
                    {...speakerCardProps(
                      talk,
                      talksBySpeaker.get(talk.speakerSlug) ?? [],
                    )}
                    className={styles.fill}
                  />
                </li>
              ))}
            </ul>
          </div>
          <Button href="/speakers" className={styles.cta}>
            View all speakers
          </Button>
        </section>
      )}

      {highlights.length > 0 && (
        <section
          className={styles.section}
          aria-labelledby="highlights-heading"
        >
          <div className={styles.sectionBody}>
            <h2 id="highlights-heading" className="section-label">
              {"// Schedule_highlights"}
            </h2>
            <ul role="list" className={styles.ticketStack}>
              {highlights.map((talk) => (
                <li key={talk.id}>
                  <TalkTicket {...talk.ticket} variant="highlight" />
                </li>
              ))}
            </ul>
          </div>
          <Button href="/schedule" className={styles.cta}>
            View full schedule
          </Button>
        </section>
      )}
    </div>
  );
}
