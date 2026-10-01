import { defineField, defineType } from "sanity";

import { TRACKS, TRACK_KEYS } from "@/lib/tracks";

export const talkType = defineType({
  name: "talk",
  title: "Talk",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", type: "text", rows: 5 }),
    defineField({
      name: "speaker",
      type: "reference",
      to: [{ type: "speaker" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "day",
      type: "reference",
      to: [{ type: "day" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "track",
      type: "string",
      options: {
        list: TRACK_KEYS.map((key) => ({
          title: TRACKS[key].name,
          value: key,
        })),
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "startTime",
      title: "Start time",
      type: "string",
      description: "24-hour conference-local time, HH:mm (e.g. 09:00).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endTime",
      title: "End time",
      type: "string",
      description: "24-hour conference-local time, HH:mm (e.g. 10:00).",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "location", type: "string" }),
    defineField({
      name: "isKeynote",
      title: "Keynote",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      day: "day.label",
      start: "startTime",
      end: "endTime",
      speaker: "speaker.name",
      isKeynote: "isKeynote",
    },
    prepare({ title, day, start, end, speaker, isKeynote }) {
      const when = [day, start && end ? `${start}–${end}` : start, speaker]
        .filter(Boolean)
        .join(" · ");
      return { title: isKeynote ? `★ ${title}` : title, subtitle: when };
    },
  },
});
