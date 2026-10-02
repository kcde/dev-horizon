import { defineField, defineType } from "sanity";

import { imageFormat } from "../validation";

const PHOTO_FORMATS = new Set(["png", "webp"]);

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
      description: "Stable identifier for the speaker.",
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
      validation: (rule) =>
        rule.custom((value?: { asset?: { _ref?: string } }) => {
          const ref = value?.asset?._ref;
          if (!ref) return true;
          const format = imageFormat(ref);
          return format && PHOTO_FORMATS.has(format)
            ? true
            : "Photo must be a PNG or WebP.";
        }),
    }),
    defineField({ name: "bio", type: "text", rows: 5 }),
  ],
  preview: {
    select: { title: "name", subtitle: "company", media: "photo" },
  },
});
