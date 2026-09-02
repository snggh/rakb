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
        <h1 className="page-title mb-6 max-w-[22ch] text-[clamp(34px,5.4vw,58px)]">
          {communityIntro.headline}
        </h1>
        <p className="max-w-[52ch] text-lg leading-[1.6] text-pretty text-[var(--dim)]">
          {communityIntro.lead}
        </p>
        <p className="max-w-[52ch] text-[0.8125rem] text-[var(--dimmer)]">{communityIntro.note}</p>
      </section>

      <div className="band">
        <div
          className="wrap cell-grid"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}
        >
          {pillars.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05} className="cell !py-[1.875rem]">
              <div className="mb-2 text-lg font-medium tracking-[-0.02em]">{item.title}</div>
              <div className="text-[0.84375rem] leading-[1.6] text-[var(--dim)]">{item.body}</div>
            </Reveal>
          ))}
        </div>
      </div>

      <section className="wrap py-14">
        <h2 className="mb-[1.625rem]">The team</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
          {members.map((member, i) => (
            <Reveal key={member.id} delay={i * 0.04}>
              <div>
                <ImageSlot src={member.photo} alt="Photo" ratio="1 / 1" className="mb-3" />
                <div className="text-[0.96875rem] font-medium tracking-[-0.015em]">{member.name}</div>
                <div className="mono mt-1">{member.role}</div>
                <div className="mt-0.5 text-[0.78125rem] text-[var(--dimmer)]">{member.kb}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-[1.125rem] text-xs text-[var(--dimmer)]">{membersNote}</p>
      </section>

      <div className="band-top">
        <div className="wrap pt-14 pb-20">
          <h2 className="mb-2.5">Sponsors &amp; vendors</h2>
          <p className="mb-[1.625rem] max-w-[52ch] text-[var(--dim)]">
            Vol. 1 ran on support from shops, artisans, and friends who supplied prizes and equipment.
            Slots for Vol. 2 are open.
          </p>
          <div className="mb-[1.875rem] grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2.5">
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
