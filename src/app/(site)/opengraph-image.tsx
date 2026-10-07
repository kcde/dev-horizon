import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { HorizonText } from "@/components/HorizonText/HorizonText";
import { Logo } from "@/components/Logo/Logo";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { sanityFetch } from "@/sanity/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREAM = "rgb(252, 239, 232)";
const INK = "rgb(0, 21, 29)";

// ImageResponse can't read next/font's woff2 files, so the brand fonts ship as TTFs.
const fontsDir = join(process.cwd(), "src/assets/fonts");

export default async function OpenGraphImage() {
  const [settings, display, body] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"] }),
    readFile(join(fontsDir, "ChakraPetch-Bold.ttf")),
    readFile(join(fontsDir, "JetBrainsMono-Regular.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "64px 72px",
        background: CREAM,
        color: INK,
        fontFamily: "JetBrains Mono",
      }}
    >
      <Logo width={376} height={39} />
      <div
        style={{
          position: "relative",
          display: "flex",
          marginTop: 64,
          fontFamily: "Chakra Petch",
          fontSize: 96,
        }}
      >
        <HorizonText
          width={672}
          height={112}
          style={{ position: "absolute", top: 70, left: 96 }}
        />
        <div
          style={{
            lineHeight: 1,
            letterSpacing: -3,
            textTransform: "lowercase",
          }}
        >
          {settings?.tagline ?? SITE_DESCRIPTION}
        </div>
      </div>
      {(settings?.eventDates || settings?.venue) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 24,
            borderTop: `3px solid ${INK}`,
            fontSize: 26,
            textTransform: "uppercase",
          }}
        >
          <span>{settings.eventDates}</span>
          <span>{settings.venue}</span>
        </div>
      )}
    </div>,
    {
      ...size,
      fonts: [
        { name: "Chakra Petch", data: display, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: body, weight: 400, style: "normal" },
      ],
    },
  );
}
