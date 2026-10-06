"use client";

import { usePathname } from "next/navigation";
import { useEffect, ViewTransition } from "react";

import styles from "./PageTransition.module.css";

// React renders back/forward synchronously (so the browser can restore scroll) and skips view
// transitions for them. Those navigations get a plain fade-in instead, unless the browser is
// already animating its own (e.g. a swipe back).
let traversalTo: string | null = null;
if (typeof window !== "undefined") {
  window.addEventListener("popstate", (event) => {
    const browserAnimates =
      "hasUAVisualTransition" in event && event.hasUAVisualTransition === true;
    traversalTo = browserAnimates ? null : window.location.pathname;
  });
}

/**
 * Crossfades the page on navigation. Keyed by pathname because the layout persists:
 * without the key there's no exit/enter, and same-page changes (filters, the modal) stay still.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    traversalTo = null;
  });

  return (
    <ViewTransition key={pathname} enter="page" exit="page" default="none">
      <div className={traversalTo === pathname ? styles.fadeIn : undefined}>
        {children}
      </div>
    </ViewTransition>
  );
}
