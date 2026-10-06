"use client";

import { FilterChip } from "@/components/FilterChip/FilterChip";
import { TalkTicket } from "@/components/TalkTicket/TalkTicket";
import type { ScheduleFilters } from "@/lib/scheduleFilter";
import { filterTalks } from "@/lib/scheduleFilter";
import type { Ticket } from "@/lib/talkTicket";
import type { TrackKey } from "@/lib/tracks";
import { TRACK_KEYS, TRACKS } from "@/lib/tracks";
import { useSavedTalks } from "@/lib/useSavedTalks";

import styles from "./page.module.css";

// The design shortens "Accessibility" on its chip.
const CHIP_LABELS: Partial<Record<TrackKey, string>> = {
  accessibility: "A11y",
};

/** Filter bar and talk list for the given filters. Without onFiltersChange, the filters are inert. */
export function ScheduleView({
  days,
  talks,
  filters,
  onFiltersChange,
}: {
  /** Conference days ("YYYY-MM-DD"), in order. */
  days: string[];
  talks: Ticket[];
  filters: ScheduleFilters;
  onFiltersChange?: (filters: ScheduleFilters) => void;
}) {
  const { savedIds, toggle } = useSavedTalks();
  const shown = filterTalks(talks, filters, { days, savedIds });
  const update = (change: Partial<ScheduleFilters>) =>
    onFiltersChange?.({ ...filters, ...change });

  return (
    <>
      <h1 className={`text-preset-2 ${styles.heading}`}>{"// schedule"}</h1>
      <div className={styles.filters}>
        <div role="group" aria-label="Day" className={styles.filterGroup}>
          {days.map((date, index) => (
            <FilterChip
              key={date}
              variant="tab"
              selected={filters.day === index + 1}
              onClick={() => update({ day: index + 1, talk: null })}
            >
              Day {String(index + 1).padStart(2, "0")}
            </FilterChip>
          ))}
        </div>
        <span className={styles.divider} aria-hidden="true" />
        <div role="group" aria-label="Track" className={styles.filterGroup}>
          {TRACK_KEYS.map((track) => {
            const short = CHIP_LABELS[track];
            return (
              <FilterChip
                key={track}
                variant="filter"
                selected={filters.track === track}
                onClick={() =>
                  update({ track: filters.track === track ? null : track })
                }
              >
                {short ? (
                  <>
                    <span aria-hidden="true">{short}</span>
                    <span className="visually-hidden">
                      {TRACKS[track].name}
                    </span>
                  </>
                ) : (
                  TRACKS[track].name
                )}
              </FilterChip>
            );
          })}
        </div>
        <div className={styles.filterGroup}>
          <FilterChip
            variant="toggle"
            selected={filters.mine}
            onClick={() => update({ mine: !filters.mine })}
          >
            My Schedule
          </FilterChip>
          <FilterChip
            variant="clear"
            onClick={() => update({ track: null, mine: false })}
          >
            Clear
          </FilterChip>
        </div>
      </div>

      <p className="visually-hidden" aria-live="polite">
        {shown.length === 1 ? "1 talk" : `${shown.length} talks`}
      </p>

      {shown.length > 0 ? (
        <ul role="list" className={styles.ticketStack}>
          {shown.map((talk) => (
            <li
              key={talk.id}
              id={talk.slug ? `talk-${talk.slug}` : undefined}
              className={styles.ticketItem}
              data-filter-item
            >
              <TalkTicket
                {...talk}
                saved={savedIds.has(talk.id)}
                onToggleSave={() => toggle(talk.id)}
                defaultExpanded={
                  Boolean(talk.slug) && talk.slug === filters.talk
                }
                onExpandedChange={(open) => {
                  if (!talk.slug) return;
                  if (open) update({ talk: talk.slug });
                  else if (filters.talk === talk.slug) update({ talk: null });
                }}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty} data-filter-item>
          {filters.mine && savedIds.size === 0
            ? "Nothing saved yet. Star a talk to add it to your schedule."
            : "No talks match these filters."}
        </p>
      )}
    </>
  );
}
