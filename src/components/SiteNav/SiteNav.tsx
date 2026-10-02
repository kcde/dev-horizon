"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { IconButton } from "@/components/IconButton/IconButton";
import { BarsIcon, CloseIcon } from "@/components/icons/icons";
import { Logo } from "@/components/Logo/Logo";
import { NavButton } from "@/components/NavButton/NavButton";
import { NAV_LINKS } from "@/lib/navigation";

import styles from "./SiteNav.module.css";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuButton = useRef<HTMLButtonElement>(null);

  // Close the mobile menu on Escape and hand focus back to the toggle.
  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const links = NAV_LINKS.map((link) => (
    <li key={link.href}>
      <NavButton
        href={link.href}
        active={isActive(pathname, link.href)}
        onClick={() => setMenuOpen(false)}
        className={styles.navButton}
      >
        {link.label}
      </NavButton>
    </li>
  ));

  return (
    <header className={styles.header}>
      <nav aria-label="Main" className={styles.bar}>
        <Link href="/" className={styles.logoLink}>
          <Logo className={styles.logo} />
        </Link>

        <ul role="list" className={styles.links}>
          {links}
        </ul>

        <IconButton
          ref={menuButton}
          label={menuOpen ? "Close menu" : "Open menu"}
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseIcon /> : <BarsIcon />}
        </IconButton>
      </nav>

      <ul role="list" id={menuId} className={styles.menu} hidden={!menuOpen}>
        {links}
      </ul>
    </header>
  );
}
