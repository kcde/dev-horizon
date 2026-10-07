import { Chakra_Petch, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { PageTransition } from "@/components/PageTransition/PageTransition";
import { SiteFooter } from "@/components/SiteFooter/SiteFooter";
import { SiteNav } from "@/components/SiteNav/SiteNav";
import { SITE_DESCRIPTION } from "@/lib/site";
import { sanityFetch } from "@/sanity/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";

import "@/styles/tokens.css";
import "@/styles/typography.css";
import "@/styles/globals.css";
import styles from "./SiteShell.module.css";

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

/**
 * The site's full document: fonts, global styles, nav and footer. Shared by the
 * site layout and global-not-found, which skips every layout.
 */
export async function SiteShell({ children }: { children: ReactNode }) {
  const settings = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
  });

  return (
    <html lang="en" id="top" className={`${display.variable} ${body.variable}`}>
      <body>
        <div className={`container ${styles.shell}`}>
          <SiteNav />
          <main className={styles.main}>
            <PageTransition>{children}</PageTransition>
          </main>
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
