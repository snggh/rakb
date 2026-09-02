import Image from "next/image";

type ImageSlotProps = {
  src?: string | null;
  alt: string;
  caption?: string;
  ratio?: string;
  fit?: "cover" | "contain";
  bare?: boolean;
  className?: string;
};

export function ImageSlot({
  src,
  alt,
  caption,
  ratio = "4 / 3",
  fit = "cover",
  bare = false,
  className,
}: ImageSlotProps) {
  const isSvg = src?.endsWith(".svg") ?? false;
  const objectClass = fit === "contain" ? "object-contain" : "object-cover";

  return (
    <figure className={className}>
      <div
        className={bare ? "relative" : "panel"}
        style={{ aspectRatio: ratio, padding: 0 }}
      >
        <div
          className={
            bare
              ? "absolute inset-0 overflow-hidden"
              : "image-slot absolute inset-0 overflow-hidden rounded-2.5"
          }
        >
          {src ? (
            isSvg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={alt} className={`absolute inset-0 h-full w-full ${objectClass}`} />
            ) : (
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 53.75rem) 100vw, 50vw"
                className={objectClass}
              />
            )
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
