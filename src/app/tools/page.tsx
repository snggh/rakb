import type { Metadata } from "next";
import { sampleBuyingGuide } from "@/content/buying-guide";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Upcoming tools for the mechanical keyboard hobby — vendor directory and keyboard buying guide.",
};

export default function ToolsPage() {
  return (
    <main>
      <section className="wrap pt-16 pb-12">
        <p className="page-kicker">Coming soon</p>
        <h1 className="page-title mb-4.5">Tools for the hobby</h1>
        <p className="max-w-58ch leading-prose text-(--dim)">
          Two questions come up constantly in the group chat: where to buy parts safely, and which
          keyboard to get. Both are being built as permanent parts of this site.
        </p>
      </section>
      <div className="wrap grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-4 pb-10">
        <div className="panel p-7.5">
          <span className="tag tag-accent">In progress</span>
          <h3 className="mt-4.5 mb-2.5 text-stat">Keyboard buying guide</h3>
          <p className="text-sm leading-prose text-(--dim)">
            A plain-language path through size, switch feel, and budget — so you can pick a
            mechanical keyboard with confidence, without drowning in jargon.
          </p>
          <div className="mt-4.5 grid">
            {sampleBuyingGuide.map((line) => (
              <div
                key={line.label}
                className="flex justify-between border-t border-(--color-divider) py-3 text-ui-md"
              >
                <span>{line.label}</span>
                <span className="mono">{line.note}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-7.5">
          <span className="tag tag-accent">In progress</span>
          <h3 className="mt-4.5 mb-2.5 text-stat">Vendor &amp; artisan directory</h3>
          <p className="text-sm leading-prose text-(--dim)">
            A list of local shops, group buy proxies, and artisan makers — with product categories,
            shipping coverage, and notes from members who have ordered. Filterable by switches,
            keycaps, cases, or lube services.
          </p>
          <div className="mt-4.5 grid">
            {["Shops & distributors", "Artisan makers", "Build & lube services"].map((label) => (
              <div
                key={label}
                className="flex justify-between border-t border-(--color-divider) py-3 text-ui-md"
              >
                <span>{label}</span>
                <span className="mono">Category</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="wrap pb-20">
        <p className="max-w-52ch text-ui text-(--dimmer)">
          Have another feature in mind? Tell us in the registration form or by DM on Instagram.
        </p>
      </div>
    </main>
  );
}
