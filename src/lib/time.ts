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
