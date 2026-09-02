"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { rules, termsClosing, termsPreamble } from "@/content/rules";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="dialog"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 8 }}
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
                    <div className="mb-1 text-[15px] font-medium tracking-[-0.02em]">{rule.title}</div>
                    <div className="text-[13px] opacity-85">{rule.body}</div>
                  </div>
                </div>
              ))}
              <p className="mt-3 border-t border-[var(--color-divider)] pt-3 text-[13px] opacity-85">
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
