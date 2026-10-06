// Schedule filter rules (see DECISIONS.md → Pages → Schedule).

import type { TrackKey } from "./tracks";
import { isTrackKey } from "./tracks";

export type ScheduleFilters = {
  /** 1-based conference day, in date order. There's always one. */
  day: number;
  track: TrackKey | null;
  /** Only the talks saved in this browser. */
  mine: boolean;
  /** Slug of the talk whose details are open. */
  talk: string | null;
};

export type FilterableTalk = {
  id: string;
  /** "YYYY-MM-DD" */
  date: string;
  track: TrackKey;
  isKeynote?: boolean | null;
  slug?: string | null;
};

export const DEFAULT_FILTERS: ScheduleFilters = {
  day: 1,
  track: null,
  mine: false,
  talk: null,
};

/**
 * Reads `?day=&track=&mine=1&talk=`. Values that don't fit fall back to the
 * defaults. A talk link without a day opens on that talk's day.
 */
export function parseFilters(
  params: Pick<URLSearchParams, "get">,
  days: readonly string[],
  talks: readonly FilterableTalk[],
): ScheduleFilters {
  const dayParam = params.get("day") ?? "";
  const track = params.get("track") ?? "";
  const linked = talks.find(
    (talk) => talk.slug && talk.slug === params.get("talk"),
  );
  const day = /^\d+$/.test(dayParam)
    ? Number(dayParam)
    : linked
      ? days.indexOf(linked.date) + 1
      : 0;
  return {
    day: day >= 1 && day <= days.length ? day : DEFAULT_FILTERS.day,
    track: isTrackKey(track) ? track : null,
    mine: params.get("mine") === "1",
    talk: linked?.slug ?? null,
  };
}

export function filtersToSearch({
  day,
  track,
  mine,
  talk,
}: ScheduleFilters): string {
  const params = new URLSearchParams({ day: String(day) });
  if (track) params.set("track", track);
  if (mine) params.set("mine", "1");
  if (talk) params.set("talk", talk);
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
