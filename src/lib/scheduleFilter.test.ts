import { describe, expect, it } from "vitest";

import type { FilterableTalk, ScheduleFilters } from "./scheduleFilter";
import { filterTalks, filtersToSearch, parseFilters } from "./scheduleFilter";

const D1 = "2026-11-15";
const D2 = "2026-11-16";
const D3 = "2026-11-17";
const DAYS = [D1, D2, D3];

const TALKS: FilterableTalk[] = [
  { id: "keynote", date: D1, track: "frontend", isKeynote: true },
  { id: "d1-frontend", date: D1, track: "frontend" },
  { id: "d1-tooling", date: D1, track: "tooling" },
  { id: "d2-frontend", date: D2, track: "frontend", slug: "d2-frontend" },
  { id: "d2-performance", date: D2, track: "performance" },
];

const ids = (talks: FilterableTalk[]) => talks.map((talk) => talk.id);

function filter(filters: Partial<ScheduleFilters>, saved: string[] = []) {
  return ids(
    filterTalks(
      TALKS,
      { day: 1, track: null, mine: false, talk: null, ...filters },
      { days: DAYS, savedIds: new Set(saved) },
    ),
  );
}

describe("parseFilters", () => {
  const parse = (search: string) =>
    parseFilters(new URLSearchParams(search), DAYS, TALKS);

  it("defaults to Day 1, no track, everything", () => {
    expect(parse("")).toEqual({
      day: 1,
      track: null,
      mine: false,
      talk: null,
    });
  });

  it("reads day, track and mine", () => {
    expect(parse("?day=2&track=tooling&mine=1")).toEqual({
      day: 2,
      track: "tooling",
      mine: true,
      talk: null,
    });
  });

  it("falls back to Day 1 for a day that isn't a conference day", () => {
    for (const day of ["0", "4", "-1", "1.5", "2x", "two"]) {
      expect(parse(`?day=${day}`).day).toBe(1);
    }
  });

  it("ignores unknown tracks and other mine values", () => {
    expect(parse("?track=keynote&mine=true")).toEqual({
      day: 1,
      track: null,
      mine: false,
      talk: null,
    });
  });

  it("opens a linked talk on its own day when no day is given", () => {
    expect(parse("?talk=d2-frontend")).toMatchObject({
      day: 2,
      talk: "d2-frontend",
    });
  });

  it("keeps an explicit day over the linked talk's day", () => {
    expect(parse("?day=3&talk=d2-frontend")).toMatchObject({
      day: 3,
      talk: "d2-frontend",
    });
  });

  it("ignores a talk link that matches no talk", () => {
    expect(parse("?talk=gone")).toMatchObject({ day: 1, talk: null });
  });
});

describe("filtersToSearch", () => {
  it("always writes the day and leaves out unset filters", () => {
    expect(
      filtersToSearch({ day: 1, track: null, mine: false, talk: null }),
    ).toBe("?day=1");
  });

  it("writes every set filter", () => {
    expect(
      filtersToSearch({
        day: 3,
        track: "frontend",
        mine: true,
        talk: "d2-frontend",
      }),
    ).toBe("?day=3&track=frontend&mine=1&talk=d2-frontend");
  });

  it("round-trips through parseFilters", () => {
    const filters: ScheduleFilters = {
      day: 2,
      track: "tooling",
      mine: true,
      talk: "d2-frontend",
    };
    expect(
      parseFilters(new URLSearchParams(filtersToSearch(filters)), DAYS, TALKS),
    ).toEqual(filters);
  });
});

describe("filterTalks", () => {
  it("shows the selected day, keynote included", () => {
    expect(filter({ day: 1 })).toEqual([
      "keynote",
      "d1-frontend",
      "d1-tooling",
    ]);
    expect(filter({ day: 2 })).toEqual(["d2-frontend", "d2-performance"]);
  });

  it("drops the keynote under a track filter, even the keynote's own track", () => {
    expect(filter({ day: 1, track: "frontend" })).toEqual(["d1-frontend"]);
  });

  it("shows only saved talks with My Schedule", () => {
    expect(
      filter({ day: 1, mine: true }, ["d1-tooling", "d2-frontend"]),
    ).toEqual(["d1-tooling"]);
  });

  it("keeps a saved keynote in My Schedule when no track is set", () => {
    expect(filter({ day: 1, mine: true }, ["keynote"])).toEqual(["keynote"]);
    expect(
      filter({ day: 1, track: "frontend", mine: true }, ["keynote"]),
    ).toEqual([]);
  });

  it("combines all three filters", () => {
    expect(
      filter({ day: 2, track: "frontend", mine: true }, [
        "d2-frontend",
        "d2-performance",
      ]),
    ).toEqual(["d2-frontend"]);
  });

  it("returns nothing for a day with no talks", () => {
    expect(filter({ day: 3 })).toEqual([]);
  });
});
