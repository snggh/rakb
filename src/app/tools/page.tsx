import type { Metadata } from "next";
import { sampleBuild } from "@/content/calculator";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Upcoming tools for the mechanical keyboard hobby — vendor directory and build calculator.",
};

function formatIdr(amount: number | null) {
  return amount == null ? "Rp —" : `Rp ${amount.toLocaleString("id-ID")}`;
}

export default function ToolsPage() {
  const total = sampleBuild.reduce((sum, line) => sum + (line.amountIdr ?? 0), 0);
  const totalLabel = sampleBuild.every((line) => line.amountIdr == null)
    ? "Rp —"
    : formatIdr(total);

  return (
    <main>
      <section className="wrap pt-16 pb-12">
        <p className="page-kicker">Coming soon</p>
        <h1 className="page-title mb-4.5">Tools for the hobby</h1>
        <p className="max-w-58ch leading-prose text-(--dim)">
          Two questions come up constantly in the group chat: where to buy parts safely, and what a
          build actually costs. Both are being built as permanent parts of this site.
        </p>
      </section>
      <div className="wrap grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-4 pb-10">
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
        <div className="panel p-7.5">
          <span className="tag tag-accent">In progress</span>
          <h3 className="mt-4.5 mb-2.5 text-stat">Build guide + parts calculator</h3>
          <p className="text-sm leading-prose text-(--dim)">
            A path for beginners: pick a layout, mount, and plate, then see the estimated total cost
            and difficulty. Each step links technical terms to a short explanation.
          </p>
          <div className="mt-4.5 grid">
            {sampleBuild.map((line) => (
              <div
                key={line.label}
                className="flex justify-between border-t border-(--color-divider) py-3 text-ui-md"
              >
                <span>{line.label}</span>
                <span className="mono">{formatIdr(line.amountIdr)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-(--line-hi) pt-3.5 text-body-sm font-medium">
              <span>Estimated total</span>
              <span className="font-mono">{totalLabel}</span>
            </div>
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
