import Link from "next/link";
import { ImageSlot } from "@/components/image-slot";
import { Reveal } from "@/components/reveal";
import { VenueMap } from "@/components/venue-map";
import { event } from "@/content/event";
import { gallery } from "@/content/gallery";
import { highlights } from "@/content/highlights";
import { sponsors, sponsorsIntro } from "@/content/sponsors";
import { transport } from "@/content/transport";

export default function HomePage() {
  const ctaLabel = event.registrationOpen ? event.ctaOpen : event.ctaClosed;
  const preview = gallery.slice(0, 4);

  return (
    <main>
      <section className="band-bottom relative overflow-hidden">
        <div className="glow" />
        <div className="wrap relative pt-22 pb-18">
          <div className="hero-grid">
            <Reveal>
              <div className="mb-6.5 flex items-center gap-2.5">
                <span className="status-dot" />
                <span className="mono">
                  {event.status} · {event.volume}
                </span>
              </div>
              <h1 className="hero-title">
                {event.titleLines[0]}
                <br />
                {event.titleLines[1]}
                <br />
                <span className="dim">{event.titleLines[2]}</span>
              </h1>
              <p className="mb-8 max-w-46ch text-hero-lead leading-body text-pretty text-(--dim)">
                {event.tagline}
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Link href="/register" className="btn btn-primary">
                  {ctaLabel}
                </Link>
                <Link href="/schedule" className="btn btn-secondary">
                  See the schedule
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <ImageSlot src={event.heroImage} alt="Hero photo — Meetup Vol. 1" ratio="4 / 3" />
            </Reveal>
          </div>
        </div>
      </section>

      <div className="band-bottom">
        <div className="wrap cell-grid">
          <Reveal className="cell">
            <div className="mono mb-2.5">Date</div>
            <div className="text-stat font-medium tracking-display">{event.dateLabel}</div>
            <div className="mt-1.5 text-ui text-(--dimmer)">{event.dayLabel}</div>
          </Reveal>
          <Reveal className="cell" delay={0.05}>
            <div className="mono mb-2.5">Location</div>
            <div className="text-stat font-medium tracking-display">{event.venue.shortName}</div>
            <div className="mt-1.5 text-ui text-(--dimmer)">{event.venue.shortAddress}</div>
          </Reveal>
          <Reveal className="cell" delay={0.1}>
            <div className="mono mb-2.5">Capacity</div>
            <div className="text-stat font-medium tracking-display">{event.capacity}</div>
            <div className="mt-1.5 text-ui text-(--dimmer)">{event.capacityNote}</div>
          </Reveal>
        </div>
      </div>

      <div className="wrap py-18">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(18.75rem,1fr))] gap-14">
          <Reveal>
            <div className="mono mb-4.5">Announcement</div>
            <p className="max-w-52ch text-base leading-prose text-pretty whitespace-pre-line text-(--dim)">
              {event.announcement}
            </p>
            <p className="mb-7 text-ui text-(--dimmer)">{event.announcementSignoff}</p>
            <ImageSlot src={event.announcementImage} alt="Photo from Vol. 1" ratio="3 / 2" />
          </Reveal>
          <div>
            <div className="mono mb-4.5">What happens in the room</div>
            <div>
              {highlights.map((item, i) => (
                <Reveal key={item.no} delay={i * 0.04}>
                  <div className="row">
                    <div className="pt-0.5 font-mono text-xs text-(--dimmer)">{item.no}</div>
                    <div>
                      <div className="mb-0.75 text-base font-medium tracking-heading">{item.title}</div>
                      <div className="text-ui-md leading-body text-(--dim)">{item.body}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="band-top">
        <div className="wrap pt-14">
          <div className="mb-3.5 flex items-baseline justify-between gap-4">
            <h2 className="m-0">Getting there</h2>
            <Link href="/getting-there" className="link-accent">
              Full access details →
            </Link>
          </div>
          <p className="mb-7 max-w-56ch text-(--dim)">
            Vol. 2 runs at the{" "}
            <strong className="font-medium text-(--color-text)">{event.venue.fullName}</strong>,{" "}
            {event.venue.address}.
          </p>
        </div>
        <div className="wrap grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-8 pb-18">
          <Reveal>
            <VenueMap query={event.venue.mapQuery} title="Meetup area map" />
          </Reveal>
          <div className="grid content-start">
            {transport.map((item, i) => (
              <Reveal key={item.kind} delay={i * 0.04}>
                <div className="stack-row">
                  <div className="mono mb-1.5">{item.kind}</div>
                  <div className="text-base font-medium tracking-heading">{item.name}</div>
                  <div className="text-ui-md leading-body text-(--dim)">{item.body}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="band-top">
        <div className="wrap pt-14 pb-18">
          <div className="mb-5.5 flex items-baseline justify-between gap-4">
            <h2 className="m-0">From Vol. 1</h2>
            <Link href="/gallery" className="link-accent">
              All photos →
            </Link>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))] gap-2.5">
            {preview.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.05}>
                <ImageSlot src={item.src} alt={item.cap} ratio="1 / 1" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="band-top relative overflow-hidden">
        <div className="glow-soft" />
        <div className="wrap relative pt-16 pb-6">
          <h2 className="mb-2.5">Vendors &amp; supporters</h2>
          <p className="m-0 max-w-54ch text-(--dim)">{sponsorsIntro}</p>
        </div>
        <div className="wrap relative pt-7 pb-9">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-2.5">
            {sponsors.map((item) => (
              <ImageSlot key={item.id} src={item.logo} alt={item.name} ratio="5 / 3" />
            ))}
          </div>
        </div>
        <div className="wrap relative pb-18">
          <div className="flex flex-wrap gap-2.5">
            <Link href="/register" className="btn btn-primary">
              Become a supporter
            </Link>
            <Link href="/community" className="btn btn-secondary">
              About the community
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
