import type { SpeakerModalTalk } from "@/components/SpeakerModal/SpeakerModal";

import type { TrackKey } from "./tracks";

/** The talk fields Home and Schedule both project from Sanity. */
export type QueryTalk = {
  _id: string;
  title: string | null;
  slug: string | null;
  description: string | null;
  track: TrackKey | null;
  isKeynote: boolean | null;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  day: { label: string | null; date: string | null };
  speaker: { name: string | null; company: string | null };
};

/** TalkTicket props for a talk, or null if it's missing a field a ticket needs. */
export type Ticket = SpeakerModalTalk & {
  /** Without one, the talk can't be linked to. */
  slug: string | null;
};

export function toTicket(talk: QueryTalk): Ticket | null {
  const { title, track, startTime, endTime, day, speaker } = talk;
  if (!title || !track || !startTime || !endTime || !day.date) return null;
  return {
    id: talk._id,
    slug: talk.slug,
    title,
    description: talk.description,
    speakerName: speaker.name,
    company: speaker.company,
    track,
    isKeynote: talk.isKeynote,
    startTime,
    endTime,
    date: day.date,
    dayLabel: day.label,
    location: talk.location,
  };
}
