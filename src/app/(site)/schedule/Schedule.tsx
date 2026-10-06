"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { filtersToSearch, parseFilters } from "@/lib/scheduleFilter";
import type { Ticket } from "@/lib/talkTicket";
import { useSavedTalks } from "@/lib/useSavedTalks";

import { ScheduleView } from "./ScheduleView";

/** The schedule with its filters kept in the URL. */
export function Schedule({ days, talks }: { days: string[]; talks: Ticket[] }) {
  const searchParams = useSearchParams();
  const filters = parseFilters(searchParams, days, talks);
  const { prune } = useSavedTalks();
  const [linkedTalk] = useState(filters.talk);

  useEffect(() => {
    prune(new Set(talks.map((talk) => talk.id)));
  }, [talks, prune]);

  useEffect(() => {
    if (linkedTalk) {
      document
        .getElementById(`talk-${linkedTalk}`)
        ?.scrollIntoView({ block: "start" });
    }
  }, [linkedTalk]);

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
