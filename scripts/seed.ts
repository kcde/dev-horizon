// Seeds the Sanity dataset with placeholder content. Safe to re-run: documents
// use fixed _ids and createOrReplace, and image uploads are deduplicated by hash.
// Usage: npm run seed (needs SANITY_API_WRITE_TOKEN in .env.local)

import { createReadStream, existsSync } from "node:fs";
import { join } from "node:path";

import { createClient } from "@sanity/client";

import { ROOMS, days, siteSettings, speakers, talks } from "./seed-data.ts";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  throw new Error("Missing SANITY_API_WRITE_TOKEN in .env.local");
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token,
  useCdn: false,
});

const ASSETS_DIR = join(import.meta.dirname, "seed-assets");

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uploadPhoto(slug: string) {
  const path = join(ASSETS_DIR, `${slug}.png`);
  if (!existsSync(path)) return undefined;
  const asset = await client.assets.upload("image", createReadStream(path), {
    filename: `${slug}.png`,
  });
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: asset._id },
  };
}

async function main() {
  const tx = client.transaction();

  tx.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    ...siteSettings,
  });

  for (const day of days) {
    tx.createOrReplace({
      _id: `day-${day.number}`,
      _type: "day",
      label: day.label,
      date: day.date,
    });
  }

  let photos = 0;
  for (const speaker of speakers) {
    const photo = await uploadPhoto(speaker.slug);
    if (photo) photos++;
    tx.createOrReplace({
      _id: `speaker-${speaker.slug}`,
      _type: "speaker",
      name: speaker.name,
      slug: { _type: "slug", current: speaker.slug },
      jobTitle: speaker.jobTitle,
      company: speaker.company,
      bio: speaker.bio,
      ...(photo && { photo }),
    });
  }

  for (const talk of talks) {
    tx.createOrReplace({
      _id: `talk-${slugify(talk.title)}`,
      _type: "talk",
      title: talk.title,
      description: talk.description,
      speaker: { _type: "reference", _ref: `speaker-${talk.speaker}` },
      day: { _type: "reference", _ref: `day-${talk.day}` },
      track: talk.track,
      startTime: talk.startTime,
      endTime: talk.endTime,
      location: ROOMS[talk.track],
      isKeynote: talk.isKeynote ?? false,
    });
  }

  await tx.commit();
  console.log(
    `Seeded 1 site settings, ${days.length} days, ${speakers.length} speakers (${photos} with photos), ${talks.length} talks.`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
