import { MASCOT_PIVOTS, mascotParts } from "@/components/mascot-gmk-a-paths";
import { MascotPaths, Pivot } from "@/components/mascot-gmk-a-parts";

/**
 * The mascot artwork cropped to the character: no speech bubble, no spark, no
 * ground shadow. Same aspect as the runner's box in the engine (300 × 240).
 */
export const RUNNER_VIEWBOX = "-8 122 300 240";

type MascotRunnerProps = {
  className?: string;
};

/**
 * The running mascot. Motion is entirely CSS (see `.run-mascot-*` in
 * globals.css); the game toggles `is-running`, `is-jumping`, `is-ducking` and
 * `is-dead` on the wrapper and sets `--run-stride` for the cycle length.
 */
export function MascotRunner({ className }: MascotRunnerProps) {
  return (
    <svg
      viewBox={RUNNER_VIEWBOX}
      className={`run-mascot${className ? ` ${className}` : ""}`}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="run-mascot-bob">
        <Pivot at={MASCOT_PIVOTS.shoulderOpen} className="run-mascot-hand">
          <MascotPaths list={mascotParts.handOpen} />
        </Pivot>
        <MascotPaths list={mascotParts.body} />
        <Pivot at={MASCOT_PIVOTS.hipBack} className="run-mascot-leg run-mascot-leg-back">
          <MascotPaths list={mascotParts.legBack} />
        </Pivot>
        <Pivot at={MASCOT_PIVOTS.hipFront} className="run-mascot-leg run-mascot-leg-front">
          <MascotPaths list={mascotParts.legFront} />
        </Pivot>
        <MascotPaths list={mascotParts.eyeLeft} />
        <Pivot at={MASCOT_PIVOTS.pupilLeft} className="run-mascot-pupil">
          <MascotPaths list={mascotParts.pupilLeft} />
        </Pivot>
        <MascotPaths list={mascotParts.eyeRight} />
        <Pivot at={MASCOT_PIVOTS.pupilRight} className="run-mascot-pupil">
          <MascotPaths list={mascotParts.pupilRight} />
        </Pivot>
        <MascotPaths list={mascotParts.face} />
        <Pivot at={MASCOT_PIVOTS.shoulderFist} className="run-mascot-arm">
          <MascotPaths list={mascotParts.armFist} />
        </Pivot>
      </g>
    </svg>
  );
}
