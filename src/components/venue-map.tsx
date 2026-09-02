import { mapEmbedSrc } from "@/content/event";

type VenueMapProps = {
  query: string;
  title?: string;
  caption?: string;
};

export function VenueMap({ query, title = "Venue map", caption }: VenueMapProps) {
  return (
    <div>
      <div className="panel" style={{ aspectRatio: "16 / 10" }}>
        <iframe
          title={title}
          src={mapEmbedSrc(query)}
          className="map-embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      {caption ? <p className="mt-2 text-[0.71875rem] text-[var(--dimmer)]">{caption}</p> : null}
    </div>
  );
}
