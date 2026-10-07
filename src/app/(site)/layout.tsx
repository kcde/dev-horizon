import type { Metadata } from "next";

import { SiteShell } from "@/components/SiteShell/SiteShell";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
};

export default function SiteRootLayout({ children }: LayoutProps<"/">) {
  return <SiteShell>{children}</SiteShell>;
}
