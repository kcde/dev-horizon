import type { Metadata } from "next";

import { SpeakerCard } from "@/components/SpeakerCard/SpeakerCard";
import type { SpeakerTalk } from "@/lib/speakers";
import { listSpeakers, speakerCardProps, toSpeakerTalk } from "@/lib/speakers";
import { sanityFetch } from "@/sanity/fetch";
import { SPEAKERS_QUERY } from "@/sanity/queries";

import styles from "./page.module.css";

export const metadata: Metadata = { title: "Speakers" };

export default async function SpeakersPage() {
  const talks = await sanityFetch({
    query: SPEAKERS_QUERY,
    tags: ["talk", "speaker", "day"],
  });

  const speakers = listSpeakers(
    talks
      .map(toSpeakerTalk)
      .filter((talk): talk is SpeakerTalk => talk !== null),
  );

  return (
    <div className={styles.page}>
      <h1 className={`text-preset-2 ${styles.heading}`}>{"// speakers"}</h1>
      <h2 className="visually-hidden">All speakers</h2>
      <ul role="list" className={styles.grid}>
        {speakers.map(({ primary, talks: speakerTalks }) => (
          <li key={primary.speakerSlug}>
            <SpeakerCard
              {...speakerCardProps(primary, speakerTalks)}
              className={styles.fill}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
