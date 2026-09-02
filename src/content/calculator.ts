export type BuildLine = {
  label: string;
  amountIdr: number | null;
};

/** Stub for the future build-cost calculator. */
export const sampleBuild: BuildLine[] = [
  { label: "65% gasket mount kit", amountIdr: null },
  { label: "Switches ×70 (linear)", amountIdr: null },
  { label: "PBT doubleshot keycaps", amountIdr: null },
];
