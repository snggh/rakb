import Image from "next/image";

type ImageSlotProps = {
  src?: string | null;
  alt: string;
  caption?: string;
  ratio?: string;
  className?: string;
};

export function ImageSlot({ src, alt, caption, ratio = "4 / 3", className }: ImageSlotProps) {
  return (
    <figure className={className}>
      <div className="panel" style={{ aspectRatio: ratio, padding: 0 }}>
        <div className="image-slot absolute inset-0 overflow-hidden rounded-2.5">
          {src ? (
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 53.75rem) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="image-slot-ph">
              <span>{caption ?? alt}</span>
            </div>
          )}
        </div>
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
