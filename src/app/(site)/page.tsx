import { Button } from "@/components/Button/Button";
import { Hero } from "@/components/Hero/Hero";
import { KeynoteSpotlight } from "@/components/KeynoteSpotlight/KeynoteSpotlight";
import { SpeakerCard } from "@/components/SpeakerCard/SpeakerCard";
import { TalkTicket } from "@/components/TalkTicket/TalkTicket";
import { TrackCard } from "@/components/TrackCard/TrackCard";
import type { SelectableTalk } from "@/lib/homeSelection";
import { selectFeaturedSpeakers, selectHighlights } from "@/lib/homeSelection";
import type { Ticket } from "@/lib/talkTicket";
import { toTicket } from "@/lib/talkTicket";
import { TRACK_KEYS } from "@/lib/tracks";
import { sanityFetch } from "@/sanity/fetch";
import { HOME_QUERY } from "@/sanity/queries";
import type { HOME_QUERY_RESULT } from "@/sanity/types";

import styles from "./page.module.css";

type HomeQueryTalk = HOME_QUERY_RESULT["talks"][number];
type HomeTalk = SelectableTalk & {
  ticket: Ticket;
  speaker: HomeQueryTalk["speaker"];
  location: string | null;
};

/** Drops talks missing a field Home needs, and adds the fields the selection rules use. */
function toHomeTalk(talk: HomeQueryTalk): HomeTalk | null {
  const ticket = toTicket(talk);
  if (!ticket || !talk.speaker.slug) return null;
  return {
    id: ticket.id,
    title: ticket.title,
    track: ticket.track,
    date: ticket.date,
    startTime: ticket.startTime,
    speakerSlug: talk.speaker.slug,
    isKeynote: talk.isKeynote,
    ticket,
    speaker: talk.speaker,
    location: talk.location,
  };
}

export default async function HomePage() {
  const { settings, talks } = await sanityFetch({
    query: HOME_QUERY,
    tags: ["siteSettings", "talk", "speaker", "day"],
  });

  const homeTalks = talks
    .map(toHomeTalk)
    .filter((talk): talk is HomeTalk => talk !== null);
  const keynote = homeTalks.find((talk) => talk.isKeynote);
  const featured = selectFeaturedSpeakers(homeTalks);
  const highlights = selectHighlights(homeTalks);
  // Every talk per speaker, for their modal. homeTalks is already earliest-first.
  const ticketsBySpeaker = Map.groupBy(homeTalks, (talk) => talk.speakerSlug);

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
                    name={talk.speaker.name ?? ""}
                    jobTitle={talk.speaker.jobTitle}
                    company={talk.speaker.company}
                    bio={talk.speaker.bio}
                    talkTitle={talk.title}
                    talks={(ticketsBySpeaker.get(talk.speakerSlug) ?? []).map(
                      (speakerTalk) => speakerTalk.ticket,
                    )}
                    tint={talk.isKeynote ? "keynote" : talk.track}
                    photo={talk.speaker.photo}
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
