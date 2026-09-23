import Link from "next/link";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { InstagramLogoIcon } from "@phosphor-icons/react/dist/ssr/InstagramLogo";
import { WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr/WhatsappLogo";
import { YoutubeLogoIcon } from "@phosphor-icons/react/dist/ssr/YoutubeLogo";
import type { Icon, IconWeight } from "@phosphor-icons/react";
import { RegisterCta } from "@/components/register-cta";
import { LogoBadge } from "@/components/logo";
import { site } from "@/lib/site";

const contactIcon = {
  size: 16,
  weight: "regular" as IconWeight,
  "aria-hidden": true,
  focusable: false,
} as const;

function ContactLink({
  href,
  label,
  icon: Icon,
  external,
  children,
}: {
  href: string;
  label: string;
  icon: Icon;
  external?: boolean;
  children: string;
}) {
  return (
    <a
      href={href}
      aria-label={`${label}, ${children}`}
      className="inline-flex items-center gap-2"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <Icon {...contactIcon} className="shrink-0" />
      {children}
    </a>
  );
}

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
        <div className="grid gap-2 text-ui-md">
          <div className="mono mb-0.5">Contact</div>
          <ContactLink href={site.instagram} label="Instagram" icon={InstagramLogoIcon} external>
            {site.instagramHandle}
          </ContactLink>
          <ContactLink href={site.youtube} label="YouTube" icon={YoutubeLogoIcon} external>
            {site.youtubeHandle}
          </ContactLink>
          <ContactLink href={`mailto:${site.email}`} label="Email" icon={EnvelopeSimpleIcon}>
            {site.email}
          </ContactLink>
          <ContactLink href={site.whatsapp} label="WhatsApp" icon={WhatsappLogoIcon} external>
            {site.whatsappNumber}
          </ContactLink>
          <div className="mt-2.5 text-(--dimmer)">© 2026 {site.name}</div>
        </div>
      </div>
    </footer>
  );
}
