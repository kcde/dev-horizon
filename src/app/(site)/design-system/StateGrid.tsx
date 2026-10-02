import type { ReactNode } from "react";

import type { PreviewState } from "@/components/previewState";

import styles from "./page.module.css";

const STATES: (PreviewState | undefined)[] = [undefined, "hover", "focus"];

/** Renders a component once per state: default, hover and focus. */
export function StateGrid({
  title,
  render,
  minColumnWidth = "240px",
}: {
  title: string;
  render: (state: PreviewState | undefined) => ReactNode;
  minColumnWidth?: string;
}) {
  return (
    <div className={styles.group}>
      <h3 className="text-preset-4">{title}</h3>
      <div
        className={styles.stateGrid}
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(min(${minColumnWidth}, 100%), 1fr))`,
        }}
      >
        {STATES.map((state) => (
          <div key={state ?? "default"} className={styles.stateCell}>
            <span className={`text-preset-7 ${styles.muted}`}>
              {state ?? "default"}
            </span>
            {render(state)}
          </div>
        ))}
      </div>
    </div>
  );
}
