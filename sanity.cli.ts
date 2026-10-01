import { existsSync } from "node:fs";
import { defineCliConfig } from "sanity/cli";

// The Sanity CLI only loads SANITY_STUDIO_* env vars on its own; load the Next ones too.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});
