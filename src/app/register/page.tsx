import type { Metadata } from "next";
import { RegisterForm } from "@/components/register-form";
import { event } from "@/content/event";

export const metadata: Metadata = {
  title: "Register",
  description: "Claim your slot for Ruang Aksara Keyboard Meetup Vol. 2.",
};

export default function RegisterPage() {
  return (
    <main>
      <section className="wrap wrap-narrow pt-16 pb-20">
        <p className="page-kicker">Registration · {event.volume}</p>
        <h1 className="page-title">Claim your slot</h1>
        <p className="mb-10 max-w-[54ch] text-base leading-[1.65] text-[var(--dim)]">
          Display tables are limited, so tell us how many boards you&apos;re bringing and attach
          your proof of transfer. Confirmation goes out by email or WhatsApp.
        </p>
        {!event.registrationOpen ? (
          <p className="mb-6 text-sm text-[#8fbcff]">{event.ctaClosed}</p>
        ) : null}
        <RegisterForm registrationOpen={event.registrationOpen} />
      </section>
    </main>
  );
}
