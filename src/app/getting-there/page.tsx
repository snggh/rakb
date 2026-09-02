import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { VenueMap } from "@/components/venue-map";
import { event } from "@/content/event";
import { arrivalNotes, transport } from "@/content/transport";

export const metadata: Metadata = {
  title: "Getting there",
  description: "How to reach the Ruang Aksara Keyboard meetup venue.",
};

export default function GettingTherePage() {
  return (
    <main>
      <section className="wrap pt-16 pb-14">
        <p className="page-kicker">Location &amp; access</p>
        <h1 className="page-title mb-4.5">How to reach the room</h1>
        <p className="mb-3 max-w-56ch text-lead leading-body">
          <strong className="font-medium">{event.venue.fullName}</strong>
          <br />
          <span className="text-(--dim)">{event.venue.address}</span>
        </p>
        <p className="max-w-56ch text-(--dim)">
          A five-storey building on TB Simatupang with the bike-rack facade — hard to miss. The
          exact entrance and floor for the meetup are confirmed closer to the date.
        </p>
      </section>

      <div className="band">
        <div className="wrap cell-grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]">
          {transport.map((item, i) => (
            <Reveal key={item.kind} delay={i * 0.04} className="cell py-7.5!">
              <div className="mono mb-3">{item.kind}</div>
              <div className="mb-2 text-lg font-medium tracking-display">{item.name}</div>
              <div className="text-ui-md leading-body text-(--dim)">{item.body}</div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="wrap grid grid-cols-[repeat(auto-fit,minmax(18.75rem,1fr))] gap-8 pt-12 pb-20">
        <Reveal>
          <VenueMap
            query={event.venue.mapQuery}
            caption="Showing the general area — the exact pin is added once the venue is final."
          />
        </Reveal>
        <Reveal delay={0.08}>
          <h4 className="mb-3.5 text-lg">Arrival notes</h4>
          <ul className="m-0 grid list-disc gap-2.5 pl-4.5 text-sm leading-body text-(--dim)">
            {arrivalNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </main>
  );
}
