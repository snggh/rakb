import { ImageResponse } from "next/og";
import { event } from "@/content/event";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${event.volumeLabel}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000000",
          color: "#ededed",
          padding: 64,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: -180,
            left: 250,
            width: 700,
            height: 420,
            background: "rgba(91, 157, 255, 0.18)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 16,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#6f6f6f",
            fontWeight: 500,
          }}
        >
          {event.volume} · {event.status}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              fontWeight: 600,
              lineHeight: 0.95,
              letterSpacing: -3,
            }}
          >
            <div>Ruang Aksara</div>
            <div>Keyboard</div>
            <div style={{ color: "#6f6f6f" }}>Meetup Vol. 2</div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            color: "#a1a1a1",
            borderTop: "1px solid #1f1f1f",
            paddingTop: 24,
          }}
        >
          <div>{event.dateLabel}</div>
          <div>{event.venue.shortName}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
