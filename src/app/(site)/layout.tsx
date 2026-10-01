import type { Metadata } from "next";
import { Chakra_Petch, JetBrains_Mono } from "next/font/google";

import { SiteFooter } from "@/components/SiteFooter/SiteFooter";
import { SiteNav } from "@/components/SiteNav/SiteNav";
import { sanityFetch } from "@/sanity/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";

import "@/styles/tokens.css";
import "@/styles/typography.css";
import "./globals.css";
import styles from "./layout.module.css";

const display = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const body = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-body",
});

const SITE_DESCRIPTION =
  "A three-day conference for engineers who build the interfaces humans use every day.";

export const metadata: Metadata = {
  title: "DevHorizon 26",
  description: SITE_DESCRIPTION,
};

export default async function SiteRootLayout({ children }: LayoutProps<"/">) {
  const settings = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
  });

  return (
    <html lang="en" id="top" className={`${display.variable} ${body.variable}`}>
      <body>
        <div className={`container ${styles.shell}`}>
          <SiteNav />
          <main className={styles.main}>{children}</main>
          <SiteFooter
            description={SITE_DESCRIPTION}
            venue={settings?.venue}
            eventDates={settings?.eventDates}
          />
        </div>
      </body>
    </html>
  );
}
