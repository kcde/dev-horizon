import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "eventName",
      title: "Event name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "tagline", type: "string" }),
    defineField({
      name: "eventDates",
      title: "Event dates",
      type: "string",
      description: 'Free text, e.g. "Nov 15–17, 2026".',
    }),
    defineField({ name: "venue", type: "string" }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
