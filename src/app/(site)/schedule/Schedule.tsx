"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import type { SpeakerModalTalk } from "@/components/SpeakerModal/SpeakerModal";
import { filtersToSearch, parseFilters } from "@/lib/scheduleFilter";
import { useSavedTalks } from "@/lib/useSavedTalks";

import { ScheduleView } from "./ScheduleView";

/** The schedule with its filters kept in the URL. */
export function Schedule({
  days,
  talks,
}: {
  days: string[];
  talks: SpeakerModalTalk[];
}) {
  const searchParams = useSearchParams();
  const filters = parseFilters(searchParams, days.length);
  const { prune } = useSavedTalks();

  useEffect(() => {
    prune(new Set(talks.map((talk) => talk.id)));
  }, [talks, prune]);

  return (
    <ScheduleView
      days={days}
      talks={talks}
      filters={filters}
      onFiltersChange={(next) =>
        // Next syncs useSearchParams with replaceState, and filter clicks stay out of history.
        window.history.replaceState(null, "", filtersToSearch(next))
      }
    />
  );
}
