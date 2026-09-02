"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { rules, termsClosing, termsPreamble } from "@/content/rules";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const ENTER = { duration: 0.25, ease: EASE_OUT };
const EXIT = { duration: 0.18, ease: EASE_OUT };

type TermsDialogProps = {
  open: boolean;
  termsRead: boolean;
  onClose: () => void;
  onAccept: () => void;
  onScrollEnd: () => void;
};

export function TermsDialog({
  open,
  termsRead,
  onClose,
  onAccept,
  onScrollEnd,
}: TermsDialogProps) {
  const titleId = useId();
  const reduce = useReducedMotion();
  // true after hydration only — the portal target does not exist on the server.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) return;
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
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="dialog-backdrop"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: ENTER }}
          exit={{ opacity: 0, transition: EXIT }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="dialog"
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "scale(0.96)" }}
            animate={{ opacity: 1, transform: "scale(1)", transition: ENTER }}
            exit={reduce ? { opacity: 0, transition: EXIT } : { opacity: 0, transform: "scale(0.98)", transition: EXIT }}
          >
            <div id={titleId} className="dialog-title">
              Terms &amp; conditions
            </div>
            <div
              className="dialog-body"
              onScroll={(e) => {
                const el = e.currentTarget;
                if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) {
                  onScrollEnd();
                }
              }}
            >
              <p className="mb-4">{termsPreamble}</p>
              {rules.map((rule) => (
                <div
                  key={rule.no}
                  className="grid grid-cols-[32px_1fr] gap-3 border-t border-[var(--color-divider)] py-3"
                >
                  <div className="font-mono text-xs font-medium text-[#888]">{rule.no}</div>
                  <div>
                    <div className="mb-1 text-[0.9375rem] font-medium tracking-[-0.02em]">{rule.title}</div>
                    <div className="text-[0.8125rem] opacity-85">{rule.body}</div>
                  </div>
                </div>
              ))}
              <p className="mt-3 border-t border-[var(--color-divider)] pt-3 text-[0.8125rem] opacity-85">
                {termsClosing}
              </p>
            </div>
            <div className="dialog-actions">
              <span className="text-muted mr-auto text-xs">
                {termsRead ? "You have reached the end." : "Scroll to the end to accept."}
              </span>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onAccept}
                disabled={!termsRead}
              >
                Accept &amp; continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
