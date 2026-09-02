import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 py-12">
        <div>
          <div className="mb-2.5 text-[15px] font-semibold tracking-[-0.02em] text-[var(--color-text)]">
            {site.name}
          </div>
          <p className="m-0 max-w-[32ch] text-[13px] leading-[1.6] text-[var(--dimmer)]">
            A mechanical keyboard community. Meetups, group buys, and learning together.
          </p>
        </div>
        <div className="grid gap-[9px] text-[13.5px]">
          <div className="mono mb-0.5">Event</div>
          <Link href="/register">Register for Vol. 2</Link>
          <Link href="/schedule">Schedule</Link>
          <Link href="/getting-there">Getting there</Link>
        </div>
        <div className="grid gap-[9px] text-[13.5px]">
          <div className="mono mb-0.5">More</div>
          <Link href="/rules">Meetup rules</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/community">About &amp; team</Link>
        </div>
        <div className="grid gap-1.5 text-[13.5px]">
          <div className="mono mb-0.5">Contact</div>
          <div>
            Instagram ·{" "}
            <a href={site.instagram} target="_blank" rel="noreferrer">
              {site.instagramHandle}
            </a>
          </div>
          <div>
            YouTube ·{" "}
            <a href={site.youtube} target="_blank" rel="noreferrer">
              {site.youtubeHandle}
            </a>
          </div>
          <div className="mt-2.5 text-[var(--dimmer)]">© 2026 {site.name}</div>
        </div>
      </div>
    </footer>
  );
}
