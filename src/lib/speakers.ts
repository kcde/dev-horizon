// Speakers as the site lists them (see DECISIONS.md → Pages → Speakers).

import type { SanityImageSource } from "@/components/SanityImage/SanityImage";
import type { SpeakerCardProps } from "@/components/SpeakerCard/SpeakerCard";

import type { SelectableTalk } from "./homeSelection";
import type { QueryTalk, Ticket } from "./talkTicket";
import { toTicket } from "./talkTicket";

type QuerySpeaker = {
  name: string | null;
  slug: string | null;
  jobTitle: string | null;
  company: string | null;
  bio: string | null;
  photo: SanityImageSource;
};

/** A talk with its speaker, as Home and Speakers use it. */
export type SpeakerTalk = SelectableTalk & {
  ticket: Ticket;
  speaker: QuerySpeaker;
  location: string | null;
};

/** Drops talks missing a field the site needs. */
export function toSpeakerTalk(
  talk: QueryTalk & { speaker: QuerySpeaker },
): SpeakerTalk | null {
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

type ListableTalk = { speakerSlug: string; isKeynote?: boolean | null };

/**
 * One entry per speaker with a talk, from talks ordered earliest-first. The
 * keynote speaker comes first, then everyone in order of their first talk. The
 * primary talk is the earliest, except the keynote speaker's, which is the keynote.
 */
export function listSpeakers<T extends ListableTalk>(
  talks: T[],
): { primary: T; talks: T[] }[] {
  const speakers = [...Map.groupBy(talks, (talk) => talk.speakerSlug).values()]
    .map((own) => ({
      primary: own.find((talk) => talk.isKeynote) ?? own[0],
      talks: own,
    }))
    .filter((speaker): speaker is { primary: T; talks: T[] } =>
      Boolean(speaker.primary),
    );
  const keynote = speakers.findIndex((speaker) => speaker.primary.isKeynote);
  if (keynote > 0) speakers.unshift(...speakers.splice(keynote, 1));
  return speakers;
}

/** SpeakerCard props for a speaker, from their primary talk and all their talks. */
export function speakerCardProps(
  primary: SpeakerTalk,
  talks: SpeakerTalk[],
): Omit<SpeakerCardProps, "className" | "previewState"> {
  return {
    name: primary.speaker.name ?? "",
    jobTitle: primary.speaker.jobTitle,
    company: primary.speaker.company,
    bio: primary.speaker.bio,
    talkTitle: primary.title,
    talks: talks.map((talk) => talk.ticket),
    tint: primary.isKeynote ? "keynote" : primary.track,
    photo: primary.speaker.photo,
  };
}
