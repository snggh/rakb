import type { MascotPath } from "@/components/mascot-gmk-a-paths";

/** Renders one body part's paths exactly as the artwork paints them. */
export function MascotPaths({ list }: { list: readonly MascotPath[] }) {
  return (
    <>
      {list.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill={p.fill}
          opacity={p.opacity}
          style={p.blend ? { mixBlendMode: p.blend } : undefined}
        />
      ))}
    </>
  );
}

type PivotProps = {
  at: { readonly x: number; readonly y: number };
  className: string;
  children: React.ReactNode;
};

/**
 * Lets CSS rotate `children` about a point in viewBox units without relying on
 * `transform-origin`, whose reference box differs between browsers for SVG.
 * The outer and inner groups carry attribute transforms; only the middle one
 * is styled, so a CSS transform never overrides an attribute.
 */
export function Pivot({ at, className, children }: PivotProps) {
  return (
    <g transform={`translate(${at.x} ${at.y})`}>
      <g className={className}>
        <g transform={`translate(${-at.x} ${-at.y})`}>{children}</g>
      </g>
    </g>
  );
}
