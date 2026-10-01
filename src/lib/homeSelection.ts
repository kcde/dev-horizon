// Home page selection rules (see DECISIONS.md → Pages → Home).

import type { TrackKey } from "./tracks";
import { TRACK_KEYS } from "./tracks";

export type SelectableTalk = {
  id: string;
  title: string;
  track: TrackKey;
  /** The talk's day, "YYYY-MM-DD". */
  date: string;
  /** "HH:mm" */
  startTime: string;
  speakerSlug: string;
  isKeynote?: boolean | null;
};

/** "Earliest" first: by day, then start time, then title. */
export function compareTalks(a: SelectableTalk, b: SelectableTalk): number {
  return (
    a.date.localeCompare(b.date) ||
    a.startTime.localeCompare(b.startTime) ||
    a.title.localeCompare(b.title)
  );
}

/**
 * Picks talks round-robin across tracks: one per track, then a second, and so
 * on, up to `perTrack` each and `limit` in total. In round r, track i prefers
 * day i + r (wrapping), so tracks start on different days and every day is
 * represented. Keynote talks are never picked; the keynote isn't a track.
 */
function selectPerTrack<T extends SelectableTalk>(
  talks: T[],
  {
    perTrack,
    limit,
    exclude = [],
  }: { perTrack: number; limit: number; exclude?: string[] },
): T[] {
  const sorted = talks.filter((talk) => !talk.isKeynote).sort(compareTalks);
  const days = [...new Set(sorted.map((talk) => talk.date))];
  if (days.length === 0) return [];

  const pickedTalks = new Set<string>();
  const pickedSpeakers = new Set<string>(exclude);
  const result: T[] = [];

  for (let round = 0; round < perTrack; round++) {
    TRACK_KEYS.forEach((track, trackIndex) => {
      if (result.length >= limit) return;
      const day = days[(trackIndex + round) % days.length];
      const unused = sorted.filter(
        (talk) => talk.track === track && !pickedTalks.has(talk.id),
      );
      const newSpeaker = unused.filter(
        (talk) => !pickedSpeakers.has(talk.speakerSlug),
      );
      // Prefer someone new on this round's day, then someone new on any day.
      // A speaker repeats only when the track has no one else left.
      const choice =
        newSpeaker.find((talk) => talk.date === day) ??
        newSpeaker[0] ??
        unused.find((talk) => talk.date === day) ??
        unused[0];
      if (!choice) return;
      pickedTalks.add(choice.id);
      pickedSpeakers.add(choice.speakerSlug);
      result.push(choice);
    });
  }

  return result.sort(compareTalks);
}

const FEATURED_COUNT = 8;

/**
 * Featured speakers (8), as each speaker's talk: the keynote speaker first,
 * then the rest from the tracks (up to two per track).
 */
export function selectFeaturedSpeakers<T extends SelectableTalk>(
  talks: T[],
): T[] {
  const keynote = talks.find((talk) => talk.isKeynote);
  const fromTracks = selectPerTrack(talks, {
    perTrack: 2,
    limit: keynote ? FEATURED_COUNT - 1 : FEATURED_COUNT,
    exclude: keynote ? [keynote.speakerSlug] : [],
  });
  return keynote ? [keynote, ...fromTracks] : fromTracks;
}

/** Schedule highlights (4): one per track, spread across days. Never the keynote. */
export function selectHighlights<T extends SelectableTalk>(talks: T[]): T[] {
  return selectPerTrack(talks, { perTrack: 1, limit: TRACK_KEYS.length });
}
