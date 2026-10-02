import Link from "next/link";
import type { ReactNode } from "react";

import type { PreviewStateProps } from "@/components/previewState";

import styles from "./NavButton.module.css";

type NavButtonProps = PreviewStateProps & {
  href: string;
  children: ReactNode;
  active?: boolean;
  className?: string;
  onClick?: () => void;
};

export function NavButton({
  href,
  children,
  active = false,
  className,
  onClick,
  previewState,
}: NavButtonProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={[styles.navButton, className].filter(Boolean).join(" ")}
      data-preview-state={previewState}
    >
      {children}
    </Link>
  );
}
