import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { rules, rulesIntro, zeroTolerance } from "@/content/rules";

export const metadata: Metadata = {
  title: "Rules",
  description: "House rules for Ruang Aksara Keyboard meetups.",
};

export default function RulesPage() {
  return (
    <main>
      <section className="wrap pt-16 pb-12">
        <p className="page-kicker">Meetup rules</p>
        <h1 className="page-title mb-[18px]">House rules</h1>
        <p className="max-w-[58ch] leading-[1.65] text-[var(--dim)]">{rulesIntro}</p>
      </section>
      <div className="wrap pb-4">
        {rules.map((rule, i) => (
          <Reveal key={rule.no} delay={i * 0.03}>
            <div className="row-lg">
              <div className="pt-1 font-mono text-[13px] text-[var(--dimmer)]">{rule.no}</div>
              <div>
                <div className="mb-2 text-xl font-medium tracking-[-0.02em]">{rule.title}</div>
                <div className="max-w-[68ch] text-sm leading-[1.65] text-[var(--dim)]">{rule.body}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="wrap grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 pt-8 pb-20">
        <Reveal>
          <div className="panel p-7">
            <h4 className="mb-2.5 text-[17px]">Zero tolerance</h4>
            <p className="m-0 max-w-[52ch] text-sm leading-[1.65] text-[var(--dim)]">{zeroTolerance}</p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="panel p-7">
            <h4 className="mb-2.5 text-[17px]">Questions before you come?</h4>
            <p className="mb-[18px] max-w-[52ch] text-sm leading-[1.65] text-[var(--dim)]">
              If something here is unclear, ask before the day rather than at the door.
            </p>
            <Link href="/faq" className="btn btn-secondary !px-4 !py-[9px]">
              Read the FAQ
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
