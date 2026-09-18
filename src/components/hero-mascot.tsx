"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { MascotGmkA } from "@/components/mascot-gmk-a";

// The game only ships once someone finds it.
const MascotRunOverlay = dynamic(
  () => import("@/components/mascot-run/mascot-run-overlay").then((m) => m.MascotRunOverlay),
  { ssr: false },
);

type HeroMascotProps = {
  className?: string;
};

/** The homepage mascot, with the mini game hiding behind a burst of taps. */
export function HeroMascot({ className }: HeroMascotProps) {
  const [open, setOpen] = useState(false);
  const openGame = useCallback(() => setOpen(true), []);
  const closeGame = useCallback(() => setOpen(false), []);

  return (
    <>
      <MascotGmkA className={className} onSecret={openGame} />
      {open ? <MascotRunOverlay onClose={closeGame} /> : null}
    </>
  );
}
