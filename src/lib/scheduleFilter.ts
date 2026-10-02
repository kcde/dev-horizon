// Schedule filter rules (see DECISIONS.md → Pages → Schedule).

import type { TrackKey } from "./tracks";
import { isTrackKey } from "./tracks";

export type ScheduleFilters = {
  /** 1-based conference day, in date order. There's always one. */
  day: number;
  track: TrackKey | null;
  /** Only the talks saved in this browser. */
  mine: boolean;
};

export type FilterableTalk = {
  id: string;
  /** "YYYY-MM-DD" */
  date: string;
  track: TrackKey;
  isKeynote?: boolean | null;
};

export const DEFAULT_FILTERS: ScheduleFilters = {
  day: 1,
  track: null,
  mine: false,
};

/** Reads `?day=&track=&mine=1`. Values that don't fit fall back to the defaults. */
export function parseFilters(
  params: Pick<URLSearchParams, "get">,
  dayCount: number,
): ScheduleFilters {
  const dayParam = params.get("day") ?? "";
  const day = /^\d+$/.test(dayParam) ? Number(dayParam) : 0;
  const track = params.get("track") ?? "";
  return {
    day: day >= 1 && day <= dayCount ? day : DEFAULT_FILTERS.day,
    track: isTrackKey(track) ? track : null,
    mine: params.get("mine") === "1",
  };
}

export function filtersToSearch({ day, track, mine }: ScheduleFilters): string {
  const params = new URLSearchParams({ day: String(day) });
  if (track) params.set("track", track);
  if (mine) params.set("mine", "1");
  return `?${params}`;
}

/**
 * Talks matching every filter, in their original order. The keynote isn't a
 * track, so any track filter hides it.
 */
export function filterTalks<T extends FilterableTalk>(
  talks: T[],
  { day, track, mine }: ScheduleFilters,
  { days, savedIds }: { days: string[]; savedIds: ReadonlySet<string> },
): T[] {
  const date = days[day - 1];
  return talks.filter(
    (talk) =>
      talk.date === date &&
      (!track || (talk.track === track && !talk.isKeynote)) &&
      (!mine || savedIds.has(talk.id)),
  );
}
