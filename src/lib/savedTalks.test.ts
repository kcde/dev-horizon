import { describe, expect, it } from "vitest";

import { parseSaved, pruneSaved, toggleSaved } from "./savedTalks";

describe("parseSaved", () => {
  it("reads a stored list of IDs", () => {
    expect(parseSaved('["a","b"]')).toEqual(["a", "b"]);
  });

  it("treats a missing or broken value as nothing saved", () => {
    for (const raw of [null, "", "not json", "{}", '"a"', "42", "null"]) {
      expect(parseSaved(raw)).toEqual([]);
    }
  });

  it("drops non-string entries and duplicates", () => {
    expect(parseSaved('["a", 1, null, "b", "a", {}]')).toEqual(["a", "b"]);
  });
});

describe("toggleSaved", () => {
  it("adds an unsaved ID at the end", () => {
    expect(toggleSaved(["a"], "b")).toEqual(["a", "b"]);
  });

  it("removes a saved ID", () => {
    expect(toggleSaved(["a", "b", "c"], "b")).toEqual(["a", "c"]);
  });
});

describe("pruneSaved", () => {
  it("drops IDs that no longer match a talk, keeping the rest in order", () => {
    expect(pruneSaved(["c", "gone", "a"], new Set(["a", "b", "c"]))).toEqual([
      "c",
      "a",
    ]);
  });

  it("drops everything when no talks remain", () => {
    expect(pruneSaved(["a"], new Set())).toEqual([]);
  });
});
