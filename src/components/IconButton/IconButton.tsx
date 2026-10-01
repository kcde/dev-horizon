import type { ReactNode, Ref } from "react";

import type { PreviewStateProps } from "@/components/previewState";

import styles from "./IconButton.module.css";

type IconButtonProps = PreviewStateProps & {
  /** Accessible name, e.g. "Close". Visually hidden. */
  label: string;
  /** The icon. */
  children: ReactNode;
  onClick?: () => void;
  ref?: Ref<HTMLButtonElement>;
  className?: string;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
};

/** 40×40 outlined square button with one icon: the mobile menu toggle and modal close ("Menu" in the design). */
export function IconButton({
  label,
  children,
  onClick,
  ref,
  className,
  previewState,
  ...aria
}: IconButtonProps) {
  return (
    <button
      ref={ref}
      type="button"
      className={[styles.button, className].filter(Boolean).join(" ")}
      onClick={onClick}
      data-preview-state={previewState}
      {...aria}
    >
      {children}
      <span className="visually-hidden">{label}</span>
    </button>
  );
}
