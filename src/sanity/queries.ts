import { defineQuery } from "next-sanity";

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings"][0]{ eventName, tagline, eventDates, venue }`,
);

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
      photo,
      "talk": *[_type == "talk" && references(^._id)] | order(day->date asc, startTime asc)[0]{ title, track, isKeynote }
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
