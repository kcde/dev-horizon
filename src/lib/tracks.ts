// Tracks are fixed and not editable in the CMS (see DECISIONS.md).
export const TRACK_KEYS = [
  "frontend",
  "performance",
  "accessibility",
  "tooling",
] as const;

export type TrackKey = (typeof TRACK_KEYS)[number];

export type Track = {
  key: TrackKey;
  name: string;
  color: string;
  description: string;
};

export const TRACKS: Record<TrackKey, Track> = {
  frontend: {
    key: "frontend",
    name: "Frontend",
    color: "#ffe6ba",
    description: "Building modern interfaces for the web",
  },
  performance: {
    key: "performance",
    name: "Performance",
    color: "#fec9c3",
    description: "Make every millisecond count",
  },
  accessibility: {
    key: "accessibility",
    name: "Accessibility",
    color: "#bbd8ff",
    description: "Building inclusive experiences for everyone",
  },
  tooling: {
    key: "tooling",
    name: "Tooling",
    color: "#ccc4fd",
    description: "Level up your developer workflow",
  },
};

export const KEYNOTE_COLOR = "#b5e9fc";

export function isTrackKey(value: string): value is TrackKey {
  return (TRACK_KEYS as readonly string[]).includes(value);
}
