import type { Metadata } from "next";
import { ImageSlot } from "@/components/image-slot";
import { Reveal } from "@/components/reveal";
import { gallery } from "@/content/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from Ruang Aksara Keyboard Meetup Vol. 1.",
};

export default function GalleryPage() {
  return (
    <main>
      <section className="wrap pt-16 pb-9">
        <p className="page-kicker">Gallery</p>
        <h1 className="page-title">Meetup Vol. 1</h1>
        <p className="max-w-[54ch] text-[var(--dim)]">
          Documentation from the first meetup. Send photos to the organisers to be included here.
        </p>
      </section>
      <section className="wrap pb-20">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5">
          {gallery.map((item, i) => (
            <Reveal key={item.id} delay={(i % 6) * 0.04}>
              <ImageSlot src={item.src} alt={item.cap} caption={item.cap} />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
