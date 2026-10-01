// Talk times are stored as 24-hour "HH:mm" strings in conference-local time
// (America/Los_Angeles). The talk's Day supplies the date.

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isValidTime(value: string): boolean {
  return TIME_PATTERN.test(value);
}

/** Minutes since midnight, or null if the value isn't a valid "HH:mm" time. */
export function toMinutes(value: string): number | null {
  const match = TIME_PATTERN.exec(value);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function isEndAfterStart(start: string, end: string): boolean {
  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);
  if (startMinutes === null || endMinutes === null) return false;
  return endMinutes > startMinutes;
}

export type TimeRange = { startTime: string; endTime: string };

/** True when two ranges share time. Back-to-back ranges (10:00–11:00, 11:00–12:00) don't overlap. */
export function rangesOverlap(a: TimeRange, b: TimeRange): boolean {
  const aStart = toMinutes(a.startTime);
  const aEnd = toMinutes(a.endTime);
  const bStart = toMinutes(b.startTime);
  const bEnd = toMinutes(b.endTime);
  if (aStart === null || aEnd === null || bStart === null || bEnd === null) {
    return false;
  }
  return aStart < bEnd && bStart < aEnd;
}

export const CONFERENCE_TIME_ZONE = "America/Los_Angeles";

/** "13:00" → "1:00 PM". Returns the input unchanged if it isn't a valid "HH:mm" time. */
export function formatTime(value: string): string {
  const minutes = toMinutes(value);
  if (minutes === null) return value;
  const hours24 = Math.floor(minutes / 60);
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const suffix = hours24 < 12 ? "AM" : "PM";
  return `${hours12}:${String(minutes % 60).padStart(2, "0")} ${suffix}`;
}

/** Conference time zone abbreviation on a given date ("2026-11-15" → "PST"). */
export function timeZoneLabel(date: string): string {
  // Noon UTC is the same calendar day in Los Angeles and clear of the 2am DST switch.
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CONFERENCE_TIME_ZONE,
    timeZoneName: "short",
  }).formatToParts(new Date(`${date}T12:00:00Z`));
  return parts.find((part) => part.type === "timeZoneName")?.value ?? "PT";
}
