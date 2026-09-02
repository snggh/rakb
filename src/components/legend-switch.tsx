"use client";

import { useCallback, useSyncExternalStore } from "react";
import { defaultLegendMode, type LegendMode, legendModes, themeStorageKey } from "@/content/theme";

/**
 * WoB / BoW switch.
 *
 * The `data-theme` attribute on <html> is the single source of truth — it is
 * stamped by the pre-paint script in the layout, long before React runs. This
 * component subscribes to it rather than keeping a parallel copy in state, so
 * the switch can never disagree with what is on screen.
 */

function readStoredMode(): LegendMode | null {
  try {
    const stored = localStorage.getItem(themeStorageKey);
    return stored === "wob" || stored === "bow" ? stored : null;
  } catch {
    return null;
  }
}

function applyMode(mode: LegendMode) {
  document.documentElement.setAttribute("data-theme", mode);
}

function subscribe(onStoreChange: () => void) {
  const root = document.documentElement;
  const observer = new MutationObserver(onStoreChange);
  observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  // Until someone pins a mode, keep following the OS setting live.
  const query = window.matchMedia("(prefers-color-scheme: light)");
  const onSystemChange = (e: MediaQueryListEvent) => {
    if (readStoredMode()) return;
    applyMode(e.matches ? "bow" : "wob");
  };
  query.addEventListener("change", onSystemChange);

  return () => {
    observer.disconnect();
    query.removeEventListener("change", onSystemChange);
  };
}

function getSnapshot(): LegendMode {
  return document.documentElement.getAttribute("data-theme") === "bow" ? "bow" : "wob";
}

function getServerSnapshot(): LegendMode {
  return defaultLegendMode;
}

export function LegendSwitch({ className }: { className?: string }) {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const choose = useCallback((next: LegendMode) => {
    if (next === getSnapshot()) return;
    const root = document.documentElement;

    // Cross-fade the colour change, then get out of the way so hover and press
    // timings stay as designed.
    root.setAttribute("data-theme-switching", "");
    window.setTimeout(() => root.removeAttribute("data-theme-switching"), 260);

    applyMode(next);
    try {
      localStorage.setItem(themeStorageKey, next);
    } catch {
      // Private mode or storage disabled — the choice just won't persist.
    }
  }, []);

  return (
    <div
      className={`legend-switch ${className ?? ""}`.trim()}
      role="group"
      aria-label="Legend theme"
    >
      {legendModes.map((item) => (
        <button
          key={item.id}
          type="button"
          className="legend-key"
          aria-pressed={mode === item.id}
          title={`${item.name} — ${item.hint}`}
          onClick={() => choose(item.id)}
        >
          {item.label}
          <span className="sr-only"> — {item.name}</span>
        </button>
      ))}
    </div>
  );
}
