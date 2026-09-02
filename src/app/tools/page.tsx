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
        <h1 className="page-title mb-[1.125rem]">Tools for the hobby</h1>
        <p className="max-w-[58ch] leading-[1.65] text-[var(--dim)]">
          Two questions come up constantly in the group chat: where to buy parts safely, and what a
          build actually costs. Both are being built as permanent parts of this site.
        </p>
      </section>
      <div className="wrap grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 pb-10">
        <div className="panel p-[1.875rem]">
          <span className="tag tag-accent">In progress</span>
          <h3 className="mt-[1.125rem] mb-2.5 text-[1.3125rem]">Vendor &amp; artisan directory</h3>
          <p className="text-sm leading-[1.65] text-[var(--dim)]">
            A list of local shops, group buy proxies, and artisan makers — with product categories,
            shipping coverage, and notes from members who have ordered. Filterable by switches,
            keycaps, cases, or lube services.
          </p>
          <div className="mt-[1.125rem] grid">
            {["Shops & distributors", "Artisan makers", "Build & lube services"].map((label) => (
              <div
                key={label}
                className="flex justify-between border-t border-[var(--color-divider)] py-3 text-[0.84375rem]"
              >
                <span>{label}</span>
                <span className="mono">Category</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-[1.875rem]">
          <span className="tag tag-accent">In progress</span>
          <h3 className="mt-[1.125rem] mb-2.5 text-[1.3125rem]">Build guide + parts calculator</h3>
          <p className="text-sm leading-[1.65] text-[var(--dim)]">
            A path for beginners: pick a layout, mount, and plate, then see the estimated total cost
            and difficulty. Each step links technical terms to a short explanation.
          </p>
          <div className="mt-[1.125rem] grid">
            {sampleBuild.map((line) => (
              <div
                key={line.label}
                className="flex justify-between border-t border-[var(--color-divider)] py-3 text-[0.84375rem]"
              >
                <span>{line.label}</span>
                <span className="mono">{formatIdr(line.amountIdr)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-[var(--line-hi)] pt-3.5 text-[0.9375rem] font-medium">
              <span>Estimated total</span>
              <span className="font-mono">{totalLabel}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="wrap pb-20">
        <p className="max-w-[52ch] text-[0.8125rem] text-[var(--dimmer)]">
          Have another feature in mind? Tell us in the registration form or by DM on Instagram.
        </p>
      </div>
    </main>
  );
}
