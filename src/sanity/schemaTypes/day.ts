import { defineField, defineType } from "sanity";

export const dayType = defineType({
  name: "day",
  title: "Day",
  type: "document",
  fields: [
    defineField({
      name: "label",
      type: "string",
      description: 'For example "Day 1".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Date",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "label", subtitle: "date" },
  },
});
