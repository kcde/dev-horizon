import { defineQuery } from "next-sanity";

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings"][0]{ eventName, tagline, eventDates, venue }`,
);

// Home picks the keynote, featured speakers and highlights from `talks` (src/lib/homeSelection.ts).
export const HOME_QUERY = defineQuery(`{
  "settings": *[_type == "siteSettings"][0]{ tagline, eventDates, venue },
  "talks": *[_type == "talk" && defined(speaker) && defined(day)]
    | order(day->date asc, startTime asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      track,
      isKeynote,
      startTime,
      endTime,
      location,
      "day": day->{ label, date },
      "speaker": speaker->{ name, "slug": slug.current, jobTitle, company, bio, photo }
    }
}`);

export const SCHEDULE_QUERY = defineQuery(`{
  "days": *[_type == "day" && defined(date)] | order(date asc).date,
  "talks": *[_type == "talk" && defined(speaker) && defined(day)]
    | order(day->date asc, startTime asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      track,
      isKeynote,
      startTime,
      endTime,
      location,
      "day": day->{ label, date },
      "speaker": speaker->{ name, company }
    }
}`);

// The page lists speakers from their talks (src/lib/speakers.ts), so speakers without a talk never appear.
export const SPEAKERS_QUERY =
  defineQuery(`*[_type == "talk" && defined(speaker) && defined(day)]
  | order(day->date asc, startTime asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    track,
    isKeynote,
    startTime,
    endTime,
    location,
    "day": day->{ label, date },
    "speaker": speaker->{ name, "slug": slug.current, jobTitle, company, bio, photo }
  }`);

// Dev-only: sample content for the /design-system page.
export const DESIGN_SYSTEM_SAMPLES_QUERY = defineQuery(`{
  "settings": *[_type == "siteSettings"][0]{ tagline, eventDates, venue },
  "keynote": *[_type == "talk" && isKeynote][0]{
    title,
    startTime,
    location,
    "date": day->date,
    "speaker": speaker->{ name, jobTitle, company, photo }
  },
  "speakers": *[_type == "speaker" && slug.current in ["elena-vasquez", "james-okonkwo", "priya-sharma", "ryan-osullivan"]]
    | order(name asc) {
      name,
      "slug": slug.current,
      jobTitle,
      company,
      bio,
      photo,
      "talks": *[_type == "talk" && references(^._id)] | order(day->date asc, startTime asc, title asc){
        _id,
        title,
        track,
        isKeynote,
        startTime,
        endTime,
        "date": day->date
      }
    },
  "talks": *[_type == "talk"] | order(day->date asc, startTime asc)[0...3]{
    _id,
    title,
    description,
    track,
    isKeynote,
    startTime,
    endTime,
    location,
    "speaker": speaker->{ name, company },
    "day": day->{ label, date }
  }
}`);
