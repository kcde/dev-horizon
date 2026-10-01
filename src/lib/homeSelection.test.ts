import { describe, expect, it } from "vitest";

import type { SelectableTalk } from "./homeSelection";
import {
  compareTalks,
  selectFeaturedSpeakers,
  selectHighlights,
} from "./homeSelection";
import type { TrackKey } from "./tracks";

const D1 = "2026-11-15";
const D2 = "2026-11-16";
const D3 = "2026-11-17";

function talk(
  speaker: string,
  track: TrackKey,
  date: string,
  startTime: string,
  title = `${speaker} talk`,
): SelectableTalk {
  return {
    id: `${speaker}-${date}-${startTime}`,
    title,
    track,
    date,
    startTime,
    speakerSlug: speaker,
  };
}

// The keynote keeps a track in Sanity, but Home treats it separately.
function keynote(speaker: string, date: string, startTime: string) {
  return { ...talk(speaker, "frontend", date, startTime), isKeynote: true };
}

const speakers = (talks: SelectableTalk[]) => talks.map((t) => t.speakerSlug);

// Every track has one talk on every day, so the rotation is fully visible.
const FULL = (
  ["frontend", "performance", "accessibility", "tooling"] as const
).flatMap((track) =>
  [D1, D2, D3].map((date, day) =>
    talk(`${track}-d${day + 1}`, track, date, `${10 + day}:00`),
  ),
);

describe("compareTalks", () => {
  it("orders by day, then start time, then title", () => {
    const talks = [
      talk("c", "frontend", D2, "09:00"),
      talk("b", "frontend", D1, "11:00", "Beta"),
      talk("a", "frontend", D1, "11:00", "Alpha"),
      talk("d", "frontend", D1, "09:00"),
    ];
    expect(speakers([...talks].sort(compareTalks))).toEqual([
      "d",
      "a",
      "b",
      "c",
    ]);
  });
});

describe("selectFeaturedSpeakers", () => {
  it("picks 2 per track, rotating days so all three are covered", () => {
    expect(speakers(selectFeaturedSpeakers(FULL))).toEqual([
      // Sorted by day, then time. Frontend D1+D2, Performance D2+D3,
      // Accessibility D3+D1, Tooling D1+D2. Same-time ties sort by title.
      "accessibility-d1",
      "frontend-d1",
      "tooling-d1",
      "frontend-d2",
      "performance-d2",
      "tooling-d2",
      "accessibility-d3",
      "performance-d3",
    ]);
  });

  it("picks the earliest talk within a day", () => {
    const talks = [
      talk("late", "frontend", D1, "15:00"),
      talk("early", "frontend", D1, "09:00"),
    ];
    expect(speakers(selectFeaturedSpeakers(talks))).toContain("early");
    expect(speakers(selectFeaturedSpeakers(talks))[0]).toBe("early");
  });

  it("breaks ties on the same time by title", () => {
    const talks = [
      talk("zed", "frontend", D1, "09:00", "Zebra"),
      talk("ann", "frontend", D1, "09:00", "Aardvark"),
      talk("other", "frontend", D2, "09:00"),
    ];
    expect(speakers(selectFeaturedSpeakers(talks))).toEqual(["ann", "other"]);
  });

  it("falls back to the earliest talk on another day when the track has none on its day", () => {
    // Performance wants D2 + D3 but only has talks on D1.
    const talks = [
      talk("p-late", "performance", D1, "14:00"),
      talk("p-early", "performance", D1, "10:00"),
      talk("x", "frontend", D2, "09:00"),
      talk("y", "frontend", D3, "09:00"),
    ];
    const picked = speakers(selectFeaturedSpeakers(talks));
    expect(picked).toContain("p-early");
    expect(picked).toContain("p-late");
  });

  it("does not repeat a speaker while someone else is available", () => {
    const talks = [
      talk("busy", "frontend", D1, "09:00"),
      talk("busy", "frontend", D2, "09:00"),
      talk("free", "frontend", D3, "09:00"),
    ];
    expect(speakers(selectFeaturedSpeakers(talks))).toEqual(["busy", "free"]);
  });

  it("repeats a speaker (with a different talk) only when no one else is left", () => {
    const talks = [
      talk("solo", "tooling", D1, "09:00"),
      talk("solo", "tooling", D2, "09:00"),
    ];
    const picked = selectFeaturedSpeakers(talks);
    expect(speakers(picked)).toEqual(["solo", "solo"]);
    expect(new Set(picked.map((t) => t.id)).size).toBe(2);
  });

  it("puts the keynote speaker first, then 7 from the tracks", () => {
    const talks = [...FULL, keynote("keynote", D1, "09:00")];
    expect(speakers(selectFeaturedSpeakers(talks))).toEqual([
      "keynote",
      // Tracks get one each, then a second in track order until 7: Tooling
      // ends up with one.
      "accessibility-d1",
      "frontend-d1",
      "tooling-d1",
      "frontend-d2",
      "performance-d2",
      "accessibility-d3",
      "performance-d3",
    ]);
  });

  it("doesn't count the keynote toward its track or repeat its speaker", () => {
    const talks = [
      keynote("star", D1, "09:00"),
      talk("star", "frontend", D2, "09:00"),
      talk("f1", "frontend", D1, "13:00"),
      talk("f2", "frontend", D3, "09:00"),
    ];
    expect(speakers(selectFeaturedSpeakers(talks))).toEqual([
      "star",
      "f1",
      "f2",
    ]);
  });

  it("returns fewer cards when there aren't enough talks", () => {
    expect(selectFeaturedSpeakers([])).toEqual([]);
    expect(
      speakers(selectFeaturedSpeakers([talk("one", "frontend", D1, "09:00")])),
    ).toEqual(["one"]);
  });

  it("works with a single conference day", () => {
    const talks = FULL.filter((t) => t.date === D1).concat(
      talk("frontend-extra", "frontend", D1, "16:00"),
    );
    const picked = speakers(selectFeaturedSpeakers(talks));
    expect(picked).toHaveLength(5);
    expect(picked).toContain("frontend-extra");
  });

  it("keeps the extra fields of the input talks", () => {
    const input = [{ ...talk("a", "frontend", D1, "09:00"), extra: 42 }];
    expect(selectFeaturedSpeakers(input)[0]?.extra).toBe(42);
  });
});

describe("selectHighlights", () => {
  it("picks 1 per track, spreading tracks across days", () => {
    expect(speakers(selectHighlights(FULL))).toEqual([
      // Frontend D1, Tooling D1, Performance D2, Accessibility D3.
      "frontend-d1",
      "tooling-d1",
      "performance-d2",
      "accessibility-d3",
    ]);
  });

  it("falls back to another day and skips tracks with no talks", () => {
    const talks = [
      talk("p", "performance", D1, "10:00"),
      talk("f", "frontend", D3, "09:00"),
    ];
    expect(speakers(selectHighlights(talks))).toEqual(["p", "f"]);
  });

  it("adds the keynote on top of one per track, all in time order", () => {
    const talks = [
      keynote("keynote", D1, "09:00"),
      talk("frontend", "frontend", D1, "13:00"),
      talk("performance", "performance", D2, "10:00"),
    ];
    expect(speakers(selectHighlights(talks))).toEqual([
      "keynote",
      "frontend",
      "performance",
    ]);
  });
});
