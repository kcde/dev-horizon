import { useSyncExternalStore } from "react";

import { parseSaved, pruneSaved, toggleSaved } from "./savedTalks";

const STORAGE_KEY = "dev-horizon:saved-talks";
const EMPTY: ReadonlySet<string> = new Set();

// The `storage` event only fires in other tabs, so writes here notify these directly.
const listeners = new Set<() => void>();
let snapshot: { raw: string | null; ids: ReadonlySet<string> } = {
  raw: null,
  ids: EMPTY,
};

// Storage access throws when it's blocked (e.g. some private modes).
function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function write(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    return;
  }
  listeners.forEach((listener) => listener());
}

// useSyncExternalStore needs the same object back while nothing has changed.
function getSnapshot(): ReadonlySet<string> {
  const raw = readRaw();
  if (raw !== snapshot.raw) snapshot = { raw, ids: new Set(parseSaved(raw)) };
  return snapshot.ids;
}

function getServerSnapshot(): ReadonlySet<string> {
  return EMPTY;
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) onChange();
  };
  listeners.add(onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function toggle(id: string) {
  write(toggleSaved([...getSnapshot()], id));
}

/** Drops saved IDs that aren't in `validIds`, writing only if something changed. */
function prune(validIds: ReadonlySet<string>) {
  const saved = [...getSnapshot()];
  const kept = pruneSaved(saved, validIds);
  if (kept.length !== saved.length) write(kept);
}

/**
 * The talks saved in this browser, shared by every component that uses it and
 * kept in sync across tabs. Static HTML renders nothing saved; the real list
 * arrives on hydration.
 */
export function useSavedTalks() {
  const savedIds = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return { savedIds, toggle, prune };
}
