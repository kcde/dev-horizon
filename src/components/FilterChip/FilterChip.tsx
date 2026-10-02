import type { ReactNode } from "react";

import type { PreviewStateProps } from "@/components/previewState";

import styles from "./FilterChip.module.css";

export type FilterChipProps = PreviewStateProps & {
  /** tab = day (square), filter = track (pill), toggle = My Schedule (dashed), clear = Clear (red). */
  variant: "tab" | "filter" | "toggle" | "clear";
  /** Ignored for clear, which is an action rather than an on/off filter. */
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
};

/** Schedule filter bar button ("Control Buttons" in the design). */
export function FilterChip({
  variant,
  selected = false,
  onClick,
  children,
  previewState,
}: FilterChipProps) {
  return (
    <button
      type="button"
      className={styles.chip}
      data-variant={variant}
      aria-pressed={variant === "clear" ? undefined : selected}
      onClick={onClick}
      data-preview-state={previewState}
    >
      {children}
    </button>
  );
}
