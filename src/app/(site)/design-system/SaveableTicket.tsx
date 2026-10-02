"use client";

import { useState } from "react";

import type { TalkTicketProps } from "@/components/TalkTicket/TalkTicket";
import { TalkTicket } from "@/components/TalkTicket/TalkTicket";

/** Preview-only: a ticket whose star toggles locally, without touching the real saved talks. */
export function SaveableTicket(props: TalkTicketProps) {
  const [saved, setSaved] = useState(props.saved ?? false);
  return (
    <TalkTicket
      {...props}
      saved={saved}
      onToggleSave={() => setSaved((s) => !s)}
    />
  );
}
