import type { Metadata } from "next";
import { Suspense } from "react";

import type { SpeakerModalTalk } from "@/components/SpeakerModal/SpeakerModal";
import { DEFAULT_FILTERS } from "@/lib/scheduleFilter";
import { toTicket } from "@/lib/talkTicket";
import { sanityFetch } from "@/sanity/fetch";
import { SCHEDULE_QUERY } from "@/sanity/queries";

import styles from "./page.module.css";
import { Schedule } from "./Schedule";
import { ScheduleView } from "./ScheduleView";

export const metadata: Metadata = { title: "Schedule" };

export default async function SchedulePage() {
  const { days, talks } = await sanityFetch({
    query: SCHEDULE_QUERY,
    tags: ["talk", "speaker", "day"],
  });

  const dates = days.filter((date): date is string => date !== null);
  const tickets = talks
    .map(toTicket)
    .filter((talk): talk is SpeakerModalTalk => talk !== null);

  return (
    <div className={styles.page}>
      {/* The URL's filters are only known in the browser. The static HTML shows the default view. */}
      <Suspense
        fallback={
          <ScheduleView
            days={dates}
            talks={tickets}
            filters={DEFAULT_FILTERS}
          />
        }
      >
        <Schedule days={dates} talks={tickets} />
      </Suspense>
    </div>
  );
}
