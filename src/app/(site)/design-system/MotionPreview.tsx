"use client";

import { useState } from "react";

import styles from "./page.module.css";

const CURVES = [
  { label: "browser ease-out", value: "ease-out" },
  { label: "--ease-out", value: "var(--ease-out)" },
  { label: "--ease-in-out", value: "var(--ease-in-out)" },
];

const DURATIONS = [
  "--duration-fast",
  "--duration-base",
  "--duration-slow",
  "custom",
] as const;

/** Runs the motion tokens side by side against the browser's ease-out. */
export function MotionPreview() {
  const [duration, setDuration] =
    useState<(typeof DURATIONS)[number]>("--duration-base");
  const [customMs, setCustomMs] = useState(400);
  const [atEnd, setAtEnd] = useState(false);

  return (
    <div className={styles.motion}>
      <div className={styles.motionControls}>
        {DURATIONS.map((token) => (
          <label key={token} className="text-preset-7">
            <input
              type="radio"
              name="motion-duration"
              checked={duration === token}
              onChange={() => setDuration(token)}
            />{" "}
            {token}
          </label>
        ))}
        {duration === "custom" && (
          <label className="text-preset-7">
            <input
              type="range"
              min={100}
              max={1200}
              step={25}
              value={customMs}
              onChange={(event) => setCustomMs(Number(event.target.value))}
            />{" "}
            {customMs}ms
          </label>
        )}
        <button
          type="button"
          className={styles.sampleButton}
          onClick={() => setAtEnd(!atEnd)}
        >
          Play
        </button>
      </div>
      <ul role="list" className={styles.scale}>
        {CURVES.map(({ label, value }) => (
          <li key={label} className={styles.motionRow}>
            <code className="text-preset-7">{label}</code>
            <span className={styles.motionTrack}>
              <span
                className={styles.motionBox}
                data-at-end={atEnd}
                style={{
                  transitionDuration:
                    duration === "custom"
                      ? `${customMs}ms`
                      : `var(${duration})`,
                  transitionTimingFunction: value,
                }}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
