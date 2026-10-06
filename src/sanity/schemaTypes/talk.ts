import { defineField, defineType } from "sanity";

import { isEndAfterStart, isValidTime } from "@/lib/time";
import { TRACKS, TRACK_KEYS } from "@/lib/tracks";

import { validateRoomClash, validateSingleKeynote } from "../validation";

const TIME_FORMAT_MESSAGE = "Use 24-hour HH:mm, e.g. 09:00 or 14:30.";

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
    defineField({
      name: "slug",
      type: "slug",
      description: "Used in Schedule links.",
      options: { source: "title", maxLength: 96 },
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
      validation: (rule) =>
        rule
          .required()
          .custom((value?: string) =>
            !value || isValidTime(value) ? true : TIME_FORMAT_MESSAGE,
          ),
    }),
    defineField({
      name: "endTime",
      title: "End time",
      type: "string",
      description: "24-hour conference-local time, HH:mm (e.g. 10:00).",
      validation: (rule) =>
        rule.required().custom((value: string | undefined, context) => {
          if (!value) return true;
          if (!isValidTime(value)) return TIME_FORMAT_MESSAGE;
          const start = (context.document as { startTime?: string } | undefined)
            ?.startTime;
          if (start && isValidTime(start) && !isEndAfterStart(start, value)) {
            return "End time must be after start time.";
          }
          return true;
        }),
    }),
    defineField({
      name: "location",
      type: "string",
      validation: (rule) =>
        rule
          .custom((value: string | undefined, context) =>
            validateRoomClash(value, context),
          )
          .warning(),
    }),
    defineField({
      name: "isKeynote",
      title: "Keynote",
      type: "boolean",
      initialValue: false,
      validation: (rule) =>
        rule.custom((value: boolean | undefined, context) =>
          validateSingleKeynote(value, context),
        ),
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
