import type { ValidationContext } from "sanity";

import { rangesOverlap } from "@/lib/time";

/** Strips the draft/release prefix so a draft and its published copy share one id. */
function publishedId(id: string): string {
  return id.replace(/^(drafts|versions\.[^.]+)\./, "");
}

function client(context: ValidationContext) {
  return context.getClient({ apiVersion: "2026-10-01" });
}

/** Error message when another talk is already the keynote, otherwise true. */
export async function validateSingleKeynote(
  isKeynote: boolean | undefined,
  context: ValidationContext,
): Promise<true | string> {
  const ownId = context.document?._id;
  if (!isKeynote || !ownId) return true;

  const keynotes = await client(context).fetch<
    { _id: string; title?: string }[]
  >(
    `*[_type == "talk" && isKeynote == true]{ _id, title }`,
    {},
    { perspective: "raw" },
  );

  const other = keynotes.find(
    (talk) => publishedId(talk._id) !== publishedId(ownId),
  );
  return other
    ? `Only one talk can be the keynote. "${other.title ?? "Untitled"}" already is.`
    : true;
}

type TalkTiming = {
  _id: string;
  day?: { _ref?: string };
  location?: string;
  startTime?: string;
  endTime?: string;
};

/** Warning message when another talk uses the same room at an overlapping time, otherwise true. */
export async function validateRoomClash(
  location: string | undefined,
  context: ValidationContext,
): Promise<true | string> {
  const talk = context.document as TalkTiming | undefined;
  const room = location?.trim();
  const dayId = talk?.day?._ref;
  if (!talk || !room || !dayId || !talk.startTime || !talk.endTime) return true;

  const sameRoom = await client(context).fetch<
    { _id: string; title?: string; startTime?: string; endTime?: string }[]
  >(
    `*[_type == "talk" && day._ref == $dayId && lower(location) == lower($room)]{ _id, title, startTime, endTime }`,
    { dayId, room },
  );

  const ownId = publishedId(talk._id);
  const clash = sameRoom.find(
    (other) =>
      publishedId(other._id) !== ownId &&
      other.startTime &&
      other.endTime &&
      rangesOverlap(
        { startTime: talk.startTime!, endTime: talk.endTime! },
        { startTime: other.startTime, endTime: other.endTime },
      ),
  );
  return clash
    ? `Room clash with "${clash.title ?? "Untitled"}" (${clash.startTime}–${clash.endTime}).`
    : true;
}

/** Image asset refs look like "image-<hash>-<w>x<h>-<ext>". */
export function imageFormat(assetRef: string): string | undefined {
  return /-([a-z0-9]+)$/.exec(assetRef)?.[1];
}
