import Link from "next/link";
import type { ReactNode } from "react";

import { ArrowRightIcon } from "@/components/icons/icons";
import type { PreviewStateProps } from "@/components/previewState";

import styles from "./Button.module.css";

type ButtonProps = PreviewStateProps & {
  children: ReactNode;
  /** "light" is for use on the cyan keynote surface. */
  variant?: "primary" | "light";
  /** Shows a trailing arrow, as on "View talk →". */
  arrow?: boolean;
  className?: string;
} & (
    | { href: string; type?: never; onClick?: never }
    | { href?: never; type?: "button" | "submit"; onClick?: () => void }
  );

export function Button({
  children,
  variant = "primary",
  arrow = false,
  className,
  previewState,
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      <span>{children}</span>
      {arrow && <ArrowRightIcon className={styles.icon} />}
    </>
  );

  if (rest.href !== undefined) {
    return (
      <Link
        href={rest.href}
        className={classes}
        data-preview-state={previewState}
      >
        {content}
      </Link>
    );
  }
  return (
    <button
      type={rest.type ?? "button"}
      onClick={rest.onClick}
      className={classes}
      data-preview-state={previewState}
    >
      {content}
    </button>
  );
}
