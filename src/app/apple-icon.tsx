import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS ignores SVG icons and rounds the corners itself, so this is icon.svg as a square PNG.
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "rgb(0, 21, 29)",
      }}
    >
      <svg width={96} height={118} viewBox="0 0 13.632 16.8">
        <path
          fill="rgb(209, 255, 102)"
          d="M 0 0 L 10.752 0 L 13.632 2.88 L 13.632 13.92 L 10.752 16.8 L 0 16.8 L 0 0 Z M 9.144 14.016 L 10.368 12.792 L 10.368 4.008 L 9.144 2.784 L 3.264 2.784 L 3.264 14.016 L 9.144 14.016 Z"
        />
      </svg>
    </div>,
    size,
  );
}
