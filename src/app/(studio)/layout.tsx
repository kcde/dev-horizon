// Separate root layout so the site's global styles and fonts don't leak into Sanity Studio.
export default function StudioRootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
