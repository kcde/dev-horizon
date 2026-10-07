import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // The API CDN holds answers for 60s, so a webhook revalidation would re-cache stale content.
  useCdn: false,
  perspective: "published",
});
