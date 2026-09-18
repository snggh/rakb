"use client";

import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { MascotRunGame } from "./mascot-run-game";

type MascotRunOverlayProps = {
  onClose: () => void;
};

/**
 * The mini game as a modal, for when the homepage mascot gives up its secret.
 * Loaded on demand (see `hero-mascot.tsx`), so it is only ever rendered on the
 * client and can portal straight into `document.body`.
 */
export function MascotRunOverlay({ onClose }: MascotRunOverlayProps) {
  const titleId = useId();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="dialog-backdrop run-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="run-dialog">
        <div className="run-dialog-head">
          <div>
            <div id={titleId} className="dialog-title">
              You found the mascot run
            </div>
            <div className="mt-1 text-ui text-(--dim)">
              Space or ↑ jumps, ↓ ducks, Esc closes. Keycaps and switches are the cactus now.
            </div>
          </div>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
        <MascotRunGame autoFocus />
      </div>
    </div>,
    document.body,
  );
}
