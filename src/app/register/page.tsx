import type { Metadata } from "next";
import Link from "next/link";
import { RegisterCta } from "@/components/register-cta";
import { event } from "@/content/event";

export const metadata: Metadata = {
  title: "Register",
  description: "Claim your slot for Ruang Aksara Keyboard Meetup Vol. 2.",
};

const bringList = [
  "The name you want on your table card.",
  "How many boards you are bringing — up to 5, or none if you are coming to type.",
  "An email address or WhatsApp number, so we can send the venue details.",
];

export default function RegisterPage() {
  const ticketUrl = event.ticketUrl;

  return (
    <main>
      <section className="wrap wrap-narrow pt-16 pb-20">
        <p className="page-kicker">Registration · {event.volume}</p>
        <h1 className="page-title">Claim your slot</h1>

        <p className="mb-8 max-w-54ch text-base leading-prose text-(--dim)">
          {event.dateLabel} · {event.venue.shortName}. Display tables are limited to{" "}
          {event.capacityNote.toLowerCase()}, so slots go in the order they are booked.
        </p>

        <div className="panel mb-10 max-w-xl p-8">
          {ticketUrl ? (
            <>
              <h3 className="mb-2">Tickets are handled by our ticketing partner</h3>
              <p className="mb-5 text-sm leading-body text-(--dim)">
                Booking, payment and your confirmation email all happen there. This site never asks
                for your personal details or your payment proof.
              </p>
              <RegisterCta className="btn btn-primary">{event.ctaOpen}</RegisterCta>
            </>
          ) : (
            <>
              <h3 className="mb-2">The ticket link is not live yet</h3>
              <p className="mb-5 text-sm leading-body text-(--dim)">
                Registration for {event.volumeLabel} runs through an external ticketing platform.
                We will publish the link here and on Instagram the moment it opens — nothing on
                this page collects your details in the meantime.
              </p>
              <Link href="/schedule" className="btn btn-secondary">
                See the schedule
              </Link>
            </>
          )}
        </div>

        <h2 className="mb-3 text-lg">What you will need</h2>
        <ul className="mb-8 grid max-w-54ch gap-2 text-sm leading-body text-(--dim)">
          {bringList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <p className="text-sm leading-body text-(--dimmer)">
          Everyone in the room follows the{" "}
          <Link href="/rules" className="link-inline">
            meetup rules
          </Link>
          . Read them before you book.
        </p>
      </section>
    </main>
  );
}
