import type { Metadata } from "next";

import { NotFound } from "@/components/NotFound/NotFound";
import { SiteShell } from "@/components/SiteShell/SiteShell";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: `Page not found · ${SITE_NAME}`,
};

export default function GlobalNotFound() {
  return (
    <SiteShell>
      <NotFound />
    </SiteShell>
  );
}
