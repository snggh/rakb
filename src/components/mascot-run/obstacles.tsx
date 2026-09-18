import { OBSTACLES, type ObstacleKind } from "./engine";

/** The mascot's own GMK A palette, so the obstacles live in its world. */
const INK = "#1d648a";
const TOP = "#d8dee2";
const SIDE = "#7c93a0";
const RED = "#a44747";
const DARK_RED = "#7c2f2f";

const MONO = "var(--font-mono), ui-monospace, SFMono-Regular, monospace";

type KeycapProps = {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  legend?: string;
};

/** A keycap seen from the front: dark side wall, lighter top face, legend. */
function Keycap({ x = 0, y = 0, w = 34, h = 34, legend }: KeycapProps) {
  const faceH = h - 11;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="5" fill={SIDE} stroke={INK} strokeWidth="2" />
      <rect x="4" y="3" width={w - 8} height={faceH} rx="3.5" fill={TOP} stroke={INK} strokeWidth="1.5" />
      {legend ? (
        <text
          x={w / 2}
          y={3 + faceH / 2}
          dominantBaseline="central"
          textAnchor="middle"
          fontFamily={MONO}
          fontSize={Math.min(14, faceH * 0.62)}
          fontWeight="700"
          fill={INK}
        >
          {legend}
        </text>
      ) : null}
    </g>
  );
}

/** A Cherry-style switch, stem up: the pins are what you trip over. */
function Switch() {
  return (
    <g>
      <path d="M5 14h24l2 16H3z" fill={TOP} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <rect x="2" y="28" width="30" height="11" rx="2" fill={SIDE} stroke={INK} strokeWidth="2" />
      <path d="M14 1h6v4h4v6h-4v4h-6v-4h-4V5h4z" fill={RED} stroke={DARK_RED} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 19h16" stroke={INK} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </g>
  );
}

/** A wire keycap puller, flapping its loops like the original's pterodactyl. */
function Puller() {
  const wing = "M21 13C12 2 2 4 3 12c1 6 11 6 18 1";
  return (
    <g>
      <g transform="translate(24 12)">
        <g className="run-wing">
          <path d={wing} transform="translate(-24 -12)" fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        </g>
      </g>
      <g transform="translate(24 12) scale(-1 1)">
        <g className="run-wing">
          <path d={wing} transform="translate(-24 -12)" fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        </g>
      </g>
      <rect x="20" y="9" width="8" height="18" rx="3" fill={RED} stroke={DARK_RED} strokeWidth="1.5" />
    </g>
  );
}

type ObstacleArtProps = {
  kind: ObstacleKind;
  legend: string;
};

/** The drawing for one obstacle, sized exactly to its engine spec. */
export function ObstacleArt({ kind, legend }: ObstacleArtProps) {
  const { w, h } = OBSTACLES[kind];
  let art: React.ReactNode;
  switch (kind) {
    case "cap1":
      art = <Keycap legend={legend[0]} />;
      break;
    case "cap2":
      art = (
        <>
          <Keycap legend={legend[0]} />
          <Keycap x={36} legend={legend[1]} />
        </>
      );
      break;
    case "cap3":
      art = (
        <>
          <Keycap legend={legend[0]} />
          <Keycap x={36} legend={legend[1]} />
          <Keycap x={72} legend={legend[2]} />
        </>
      );
      break;
    case "stack":
      art = (
        <>
          <Keycap y={32} legend={legend[0]} />
          <Keycap legend={legend[1]} />
        </>
      );
      break;
    case "bar":
      art = <Keycap w={w} h={h} />;
      break;
    case "switch":
      art = <Switch />;
      break;
    case "puller":
      art = <Puller />;
      break;
  }
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false">
      {art}
    </svg>
  );
}
