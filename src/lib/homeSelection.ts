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
 * Picks talks per track. Track i fills its slots from days i, i+1, … (wrapping),
 * so tracks start on different days and every day is represented.
 */
function selectPerTrack<T extends SelectableTalk>(
  talks: T[],
  slotsPerTrack: number,
): T[] {
  const sorted = [...talks].sort(compareTalks);
  const days = [...new Set(sorted.map((talk) => talk.date))];
  if (days.length === 0) return [];

  const pickedTalks = new Set<string>();
  const pickedSpeakers = new Set<string>();
  const result: T[] = [];

  TRACK_KEYS.forEach((track, trackIndex) => {
    const trackTalks = sorted.filter((talk) => talk.track === track);
    for (let slot = 0; slot < slotsPerTrack; slot++) {
      const day = days[(trackIndex + slot) % days.length];
      const unused = trackTalks.filter((talk) => !pickedTalks.has(talk.id));
      const newSpeaker = unused.filter(
        (talk) => !pickedSpeakers.has(talk.speakerSlug),
      );
      // Prefer someone new on this slot's day, then someone new on any day.
      // A speaker repeats only when the track has no one else left.
      const choice =
        newSpeaker.find((talk) => talk.date === day) ??
        newSpeaker[0] ??
        unused.find((talk) => talk.date === day) ??
        unused[0];
      if (!choice) break;
      pickedTalks.add(choice.id);
      pickedSpeakers.add(choice.speakerSlug);
      result.push(choice);
    }
  });

  return result.sort(compareTalks);
}

/** Featured speakers (8): two per track, from different days. Returns each speaker's talk. */
export function selectFeaturedSpeakers<T extends SelectableTalk>(
  talks: T[],
): T[] {
  return selectPerTrack(talks, 2);
}

/** Schedule highlights (4): one per track, spread across days. */
export function selectHighlights<T extends SelectableTalk>(talks: T[]): T[] {
  return selectPerTrack(talks, 1);
}
