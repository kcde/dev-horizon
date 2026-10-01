import type { Metadata } from "next";
import { Chakra_Petch, JetBrains_Mono } from "next/font/google";

import "@/styles/tokens.css";
import "@/styles/typography.css";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "DevHorizon 26",
  description:
    "A three-day conference for engineers who build the interfaces humans use every day.",
};

export default function SiteRootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
