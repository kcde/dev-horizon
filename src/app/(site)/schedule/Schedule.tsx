"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

import { filtersToSearch, parseFilters } from "@/lib/scheduleFilter";
import type { Ticket } from "@/lib/talkTicket";
import { useSavedTalks } from "@/lib/useSavedTalks";

import { ScheduleView } from "./ScheduleView";

/** The schedule with its filters kept in the URL. */
export function Schedule({ days, talks }: { days: string[]; talks: Ticket[] }) {
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  // Filters live in state so a filter change can be applied synchronously inside a view transition;
  // outside URL changes (e.g. a footer track link while here) still win.
  const [filters, setFilters] = useState(() =>
    parseFilters(searchParams, days, talks),
  );
  const [syncedSearch, setSyncedSearch] = useState(search);
  if (search !== syncedSearch) {
    setSyncedSearch(search);
    setFilters(parseFilters(searchParams, days, talks));
  }
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
      onFiltersChange={(next) => {
        const apply = () => {
          setFilters(next);
          // Next syncs useSearchParams with replaceState, and filter clicks stay out of history.
          window.history.replaceState(null, "", filtersToSearch(next));
        };
        const isFilter =
          next.day !== filters.day ||
          next.track !== filters.track ||
          next.mine !== filters.mine;
        if (!isFilter || !document.startViewTransition) return apply();
        // React's <ViewTransition> can't see these updates (Next applies its URL sync later, outside
        // our transition), so drive the browser's API directly. data-vt scopes the CSS to filtering.
        const root = document.documentElement;
        root.dataset.vt = "filter";
        const transition = document.startViewTransition(() => flushSync(apply));
        void transition.finished.finally(() => delete root.dataset.vt);
      }}
    />
  );
}
