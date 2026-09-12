"use client";

import { useCallback, useMemo, useState } from "react";
import { GalleryLightbox } from "@/components/gallery-lightbox";
import { ImageSlot } from "@/components/image-slot";
import { Reveal } from "@/components/reveal";
import type { GalleryItem, GalleryVolume } from "@/content/gallery";

type GalleryVolumesBrowserProps = {
  volumes: GalleryVolume[];
};

export function GalleryVolumesBrowser({ volumes }: GalleryVolumesBrowserProps) {
  const [active, setActive] = useState<{ volumeId: string; index: number } | null>(
    null,
  );

  const activeVolume = useMemo(
    () => volumes.find((v) => v.id === active?.volumeId) ?? null,
    [volumes, active],
  );

  const openAt = useCallback((volumeId: string, index: number) => {
    setActive({ volumeId, index });
  }, []);

  const close = useCallback(() => setActive(null), []);

  return (
    <>
      {volumes.map((volume) => (
        <section key={volume.id} className="wrap pb-20">
          <div className="mb-6.5">
            <div className="mono mb-2">{volume.volume}</div>
            <h2 className="m-0 mb-2">{volume.title}</h2>
            <p className="m-0 max-w-54ch text-(--dim)">{volume.description}</p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-3.5">
            {volume.items.map((item, i) => (
              <Reveal key={item.id} delay={(i % 6) * 0.04}>
                <ImageSlot
                  src={item.src}
                  alt={item.cap}
                  onOpen={() => openAt(volume.id, i)}
                />
              </Reveal>
            ))}
          </div>
        </section>
      ))}

      <GalleryLightbox
        items={activeVolume?.items ?? []}
        index={active?.index ?? null}
        volumeLabel={activeVolume?.volume}
        onClose={close}
        onIndexChange={(index) =>
          setActive((prev) => (prev ? { ...prev, index } : prev))
        }
      />
    </>
  );
}

type GalleryPreviewBrowserProps = {
  thumbs: GalleryItem[];
  items: GalleryItem[];
  volumeLabel?: string;
};

/** Home strip: shows a few thumbs, opens lightbox into the full set. */
export function GalleryPreviewBrowser({
  thumbs,
  items,
  volumeLabel,
}: GalleryPreviewBrowserProps) {
  const [index, setIndex] = useState<number | null>(null);

  const openThumb = useCallback(
    (thumb: GalleryItem) => {
      const i = items.findIndex((item) => item.src === thumb.src);
      setIndex(i >= 0 ? i : 0);
    },
    [items],
  );

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))] gap-2.5">
        {thumbs.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.05}>
            <ImageSlot
              src={item.src}
              alt={item.cap}
              ratio="1 / 1"
              onOpen={() => openThumb(item)}
            />
          </Reveal>
        ))}
      </div>
      <GalleryLightbox
        items={items}
        index={index}
        volumeLabel={volumeLabel}
        onClose={() => setIndex(null)}
        onIndexChange={setIndex}
      />
    </>
  );
}
