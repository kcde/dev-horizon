import type { QueryParams } from "next-sanity";

import { client } from "./client";

// Fallback when the publish webhook (M6) doesn't fire.
const REVALIDATE_SECONDS = 60 * 60;

/**
 * Fetches from Sanity with Next caching. `tags` are document types (e.g. "talk"),
 * so the publish webhook can revalidate everything that depends on a changed type.
 */
export function sanityFetch<const Query extends string>({
  query,
  params = {},
  tags,
}: {
  query: Query;
  params?: QueryParams;
  tags: string[];
}) {
  return client.fetch(query, params, {
    next: { revalidate: REVALIDATE_SECONDS, tags },
  });
}
