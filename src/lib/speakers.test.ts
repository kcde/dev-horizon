import { describe, expect, it } from "vitest";

import { listSpeakers } from "./speakers";

// Input order is earliest-first, as the queries return talks.
const TALKS = [
  { id: "a-1", speakerSlug: "a" },
  { id: "b-1", speakerSlug: "b" },
  { id: "k-1", speakerSlug: "keynote-speaker" },
  { id: "a-2", speakerSlug: "a" },
  { id: "k-keynote", speakerSlug: "keynote-speaker", isKeynote: true },
];

describe("listSpeakers", () => {
  const speakers = listSpeakers(TALKS);

  it("puts the keynote speaker first, then speakers in order of their first talk", () => {
    expect(speakers.map((s) => s.primary.speakerSlug)).toEqual([
      "keynote-speaker",
      "a",
      "b",
    ]);
  });

  it("uses the earliest talk as the primary one", () => {
    expect(speakers[1]?.primary.id).toBe("a-1");
  });

  it("uses the keynote as the keynote speaker's primary talk", () => {
    expect(speakers[0]?.primary.id).toBe("k-keynote");
  });

  it("keeps every talk per speaker, earliest first", () => {
    expect(speakers.map((s) => s.talks.map((t) => t.id))).toEqual([
      ["k-1", "k-keynote"],
      ["a-1", "a-2"],
      ["b-1"],
    ]);
  });

  it("returns nothing without talks", () => {
    expect(listSpeakers([])).toEqual([]);
  });
});
