import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevHorizon 26",
  description:
    "A three-day conference for engineers who build the interfaces humans use every day.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
