import Link from "next/link";
import { RegisterCta } from "@/components/register-cta";
import { LogoBadge } from "@/components/logo";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap grid grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))] gap-8 py-12">
        <div>
          <LogoBadge className="logo-badge mb-4" />
          <p className="m-0 max-w-32ch text-ui leading-body text-(--dimmer)">
            {site.description}
          </p>
        </div>
        <div className="grid gap-2.25 text-ui-md">
          <div className="mono mb-0.5">Event</div>
          <RegisterCta>Register for Vol. 2</RegisterCta>
          <Link href="/schedule">Schedule</Link>
          <Link href="/getting-there">Getting there</Link>
        </div>
        <div className="grid gap-2.25 text-ui-md">
          <div className="mono mb-0.5">More</div>
          <Link href="/rules">Meetup rules</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/community">About &amp; team</Link>
        </div>
        <div className="grid gap-1.5 text-ui-md">
          <div className="mono mb-0.5">Contact</div>
          <div>
            Instagram ·{" "}
            <a href={site.instagram} target="_blank" rel="noopener noreferrer">
              {site.instagramHandle}
            </a>
          </div>
          <div>
            YouTube ·{" "}
            <a href={site.youtube} target="_blank" rel="noopener noreferrer">
              {site.youtubeHandle}
            </a>
          </div>
          <div className="mt-2.5 text-(--dimmer)">© 2026 {site.name}</div>
        </div>
      </div>
    </footer>
  );
}
