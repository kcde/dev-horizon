import { describe, expect, it } from "vitest";

import { isEndAfterStart, isValidTime, rangesOverlap, toMinutes } from "./time";

describe("isValidTime", () => {
  it.each(["00:00", "09:00", "13:30", "23:59"])("accepts %s", (value) => {
    expect(isValidTime(value)).toBe(true);
  });

  it.each(["9:00", "24:00", "12:60", "12:5", "noon", "", "09:00 "])(
    "rejects %j",
    (value) => {
      expect(isValidTime(value)).toBe(false);
    },
  );
});

describe("toMinutes", () => {
  it("converts to minutes since midnight", () => {
    expect(toMinutes("00:00")).toBe(0);
    expect(toMinutes("13:45")).toBe(825);
  });

  it("returns null for invalid input", () => {
    expect(toMinutes("25:00")).toBeNull();
  });
});

describe("isEndAfterStart", () => {
  it("is true when end is later", () => {
    expect(isEndAfterStart("09:00", "10:00")).toBe(true);
  });

  it("is false when end equals start", () => {
    expect(isEndAfterStart("09:00", "09:00")).toBe(false);
  });

  it("is false when end is earlier", () => {
    expect(isEndAfterStart("10:00", "09:00")).toBe(false);
  });

  it("is false when either time is invalid", () => {
    expect(isEndAfterStart("9am", "10:00")).toBe(false);
  });
});

describe("rangesOverlap", () => {
  const talk = { startTime: "10:00", endTime: "11:00" };

  it("detects partial overlap", () => {
    expect(rangesOverlap(talk, { startTime: "10:30", endTime: "11:30" })).toBe(
      true,
    );
  });

  it("detects containment", () => {
    expect(rangesOverlap(talk, { startTime: "10:15", endTime: "10:45" })).toBe(
      true,
    );
  });

  it("detects identical ranges", () => {
    expect(rangesOverlap(talk, talk)).toBe(true);
  });

  it("treats back-to-back ranges as not overlapping", () => {
    expect(rangesOverlap(talk, { startTime: "11:00", endTime: "12:00" })).toBe(
      false,
    );
    expect(rangesOverlap(talk, { startTime: "09:00", endTime: "10:00" })).toBe(
      false,
    );
  });

  it("is false for invalid times", () => {
    expect(rangesOverlap(talk, { startTime: "x", endTime: "11:00" })).toBe(
      false,
    );
  });
});
