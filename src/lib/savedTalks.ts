// Saved talks (see DECISIONS.md → Saved talks): talk `_id`s, stored as a JSON array.

/** Reads the stored value. Anything that isn't a list of IDs counts as nothing saved. */
export function parseSaved(raw: string | null): string[] {
  if (!raw) return [];
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(value)) return [];
  return [
    ...new Set(value.filter((id): id is string => typeof id === "string")),
  ];
}

export function toggleSaved(ids: readonly string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((saved) => saved !== id) : [...ids, id];
}

/** Drops IDs that no longer match a talk. */
export function pruneSaved(
  ids: readonly string[],
  validIds: ReadonlySet<string>,
): string[] {
  return ids.filter((id) => validIds.has(id));
}
