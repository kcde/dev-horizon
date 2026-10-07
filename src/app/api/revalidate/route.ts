import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return new Response("Missing SANITY_REVALIDATE_SECRET", { status: 500 });
  }

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(
    req,
    secret,
    true,
  );

  if (!isValidSignature) {
    return new Response("Invalid signature", { status: 401 });
  }
  if (!body?._type) {
    return new Response("Missing _type", { status: 400 });
  }

  // Webhooks can't use updateTag, and `"max"` would show editors the old
  // content on their first reload after publishing.
  revalidateTag(body._type, { expire: 0 });

  return Response.json({ revalidated: body._type });
}
