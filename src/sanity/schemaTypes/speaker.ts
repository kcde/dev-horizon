import { defineField, defineType } from "sanity";

export const speakerType = defineType({
  name: "speaker",
  title: "Speaker",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      description: "Used in the speaker modal URL.",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "jobTitle", title: "Job title", type: "string" }),
    defineField({ name: "company", type: "string" }),
    defineField({
      name: "photo",
      type: "image",
      description: "Transparent cut-out, PNG or WebP.",
      options: { accept: "image/png,image/webp" },
    }),
    defineField({ name: "bio", type: "text", rows: 5 }),
  ],
  preview: {
    select: { title: "name", subtitle: "company", media: "photo" },
  },
});
