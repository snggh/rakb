import type { Metadata } from "next";
import { GalleryVolumesBrowser } from "@/components/gallery-browser";
import { galleryVolumes } from "@/content/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from Ruang Aksara Keyboard Meetup.",
};

export default function GalleryPage() {
  return (
    <main>
      <section className="wrap pt-16 pb-9">
        <p className="page-kicker">Gallery</p>
        <h1 className="page-title">Photos from the room</h1>
        <p className="max-w-54ch text-(--dim)">
          Moments from past meetups — boards, people, and the energy in between.
          Click a photo to zoom and browse.
        </p>
      </section>

      <GalleryVolumesBrowser volumes={galleryVolumes} />
    </main>
  );
}
