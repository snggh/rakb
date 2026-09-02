"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { TermsDialog } from "@/components/terms-dialog";
import { submitRegistration } from "@/lib/submit-registration";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const ENTER = { duration: 0.3, ease: EASE_OUT };
const EXIT = { duration: 0.15, ease: EASE_OUT };

type RegisterFormProps = {
  registrationOpen: boolean;
};

export function RegisterForm({ registrationOpen }: RegisterFormProps) {
  const reduce = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsRead, setTermsRead] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accepted || !registrationOpen) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const receipt = data.get("receipt");
    setPending(true);
    await submitRegistration({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      whatsapp: String(data.get("whatsapp") ?? ""),
      discord: String(data.get("discord") ?? ""),
      keyboardCount: Number(data.get("keyboardCount") ?? 0),
      receiptName: receipt instanceof File && receipt.name ? receipt.name : null,
    });
    setPending(false);
    setSubmitted(true);
    window.scrollTo(0, 0);
  }

  function resetForm() {
    setSubmitted(false);
    setAccepted(false);
    setTermsRead(false);
  }

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {submitted ? (
          <motion.div
            key="success"
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(8px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)", transition: ENTER }}
            exit={{ opacity: 0, transition: EXIT }}
            className="panel success-stagger max-w-[35rem] p-8"
          >
            <h3 className="mb-2 text-[1.375rem]">You&apos;re on the list. See you in the room.</h3>
            <p className="mb-5 text-sm leading-[1.6] text-[var(--dim)]">
              We&apos;ll send the venue details and the final schedule once the date is locked. Keep
              a screenshot of this as your registration record.
            </p>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Register someone else
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(8px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)", transition: ENTER }}
            exit={{ opacity: 0, transition: EXIT }}
            className="panel grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[1.375rem] p-8"
          >
            <div className="field">
              <label htmlFor="name">Full name or nickname</label>
              <input
                id="name"
                name="name"
                className="input"
                type="text"
                required
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                className="input"
                type="email"
                required
                placeholder="name@email.com"
                autoComplete="email"
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">WhatsApp number</label>
              <input
                id="whatsapp"
                name="whatsapp"
                className="input"
                type="tel"
                placeholder="08xx xxxx xxxx"
                autoComplete="tel"
              />
            </div>
            <div className="field">
              <label htmlFor="discord">Discord ID (optional)</label>
              <input
                id="discord"
                name="discord"
                className="input"
                type="text"
                placeholder="username#0000"
              />
            </div>
            <div className="field">
              <label htmlFor="keyboardCount">How many keyboards are you bringing?</label>
              <input
                id="keyboardCount"
                name="keyboardCount"
                className="input"
                type="number"
                min={0}
                max={5}
                step={1}
                defaultValue={0}
              />
              <div className="mt-1.5 text-[0.71875rem] text-[var(--dimmer)]">
                0 if you&apos;re coming to look and type. Maximum 5 per person.
              </div>
            </div>
            <div className="field">
              <label htmlFor="receipt">Proof of transfer</label>
              <input
                id="receipt"
                name="receipt"
                className="input py-1.5"
                type="file"
                accept="image/*,.pdf"
              />
              <div className="mt-1.5 text-[0.71875rem] text-[var(--dimmer)]">
                Upload the payment receipt — image or PDF.
              </div>
            </div>
            <div className="col-span-full border-t border-[var(--color-divider)] pt-[1.375rem]">
              <label className="flex cursor-pointer items-start gap-2.5 text-sm text-[var(--dim)]">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 accent-white"
                  checked={accepted}
                  onChange={(e) => {
                    if (!e.target.checked) setAccepted(false);
                  }}
                  onClick={(e) => {
                    if (!accepted) {
                      e.preventDefault();
                      setTermsOpen(true);
                    }
                  }}
                />
                <span>
                  I have read and accept the{" "}
                  <button type="button" className="link-inline" onClick={() => setTermsOpen(true)}>
                    terms and conditions
                  </button>{" "}
                  — the meetup rules for the day.
                </span>
              </label>
            </div>
            <div className="col-span-full flex flex-wrap items-center gap-4">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={!accepted || !registrationOpen || pending}
              >
                {pending ? "Submitting…" : "Submit registration"}
              </button>
              <span className="text-xs text-[var(--dimmer)]">Your data is used for this event only.</span>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <TermsDialog
        open={termsOpen}
        termsRead={termsRead}
        onClose={() => setTermsOpen(false)}
        onScrollEnd={() => setTermsRead(true)}
        onAccept={() => {
          if (termsRead) {
            setTermsOpen(false);
            setAccepted(true);
          }
        }}
      />
    </>
  );
}
