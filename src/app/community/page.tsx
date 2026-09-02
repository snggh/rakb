import type { Metadata } from "next";
import Link from "next/link";
import { ImageSlot } from "@/components/image-slot";
import { Reveal } from "@/components/reveal";
import { members, membersNote } from "@/content/members";
import { communityIntro, pillars } from "@/content/pillars";
import { sponsors } from "@/content/sponsors";

export const metadata: Metadata = {
  title: "Community",
  description: "Who we are — Ruang Aksara Keyboard, the team, and our supporters.",
};

export default function CommunityPage() {
  return (
    <main>
      <section className="wrap pt-16 pb-14">
        <p className="page-kicker">{communityIntro.kicker}</p>
        <h1 className="page-title page-title-lg mb-6 max-w-22ch">{communityIntro.headline}</h1>
        <p className="max-w-52ch text-lg leading-body text-pretty text-(--dim)">
          {communityIntro.lead}
        </p>
        <p className="max-w-52ch text-ui text-(--dimmer)">{communityIntro.note}</p>
      </section>

      <div className="band">
        <div className="wrap cell-grid grid-cols-[repeat(auto-fit,minmax(14.375rem,1fr))]">
          {pillars.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05} className="cell py-7.5!">
              <div className="mb-2 text-lg font-medium tracking-display">{item.title}</div>
              <div className="text-ui-md leading-body text-(--dim)">{item.body}</div>
            </Reveal>
          ))}
        </div>
      </div>

      <section className="wrap py-14">
        <h2 className="mb-6.5">The team</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(12.5rem,1fr))] gap-5">
          {members.map((member, i) => (
            <Reveal key={member.id} delay={i * 0.04}>
              <div>
                <ImageSlot src={member.photo} alt="Photo" ratio="1 / 1" className="mb-3" />
                <div className="text-body-md font-medium tracking-heading">{member.name}</div>
                <div className="mono mt-1">{member.role}</div>
                <div className="mt-0.5 text-ui-sm text-(--dimmer)">{member.kb}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-4.5 text-xs text-(--dimmer)">{membersNote}</p>
      </section>

      <div className="band-top">
        <div className="wrap pt-14 pb-20">
          <h2 className="mb-2.5">Sponsors &amp; vendors</h2>
          <p className="mb-6.5 max-w-52ch text-(--dim)">
            Vol. 1 ran on support from shops, artisans, and friends who supplied prizes and equipment.
            Slots for Vol. 2 are open.
          </p>
          <div className="mb-7.5 grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-2.5">
            {sponsors.slice(0, 4).map((item) => (
              <ImageSlot key={item.id} src={item.logo} alt={item.name} ratio="5 / 3" />
            ))}
          </div>
          <Link href="/register" className="btn btn-primary">
            Sponsor Vol. 2
          </Link>
        </div>
      </div>
    </main>
  );
}
