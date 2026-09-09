/**
 * Theme = legend mode × colorway.
 *
 * Legend mode borrows keycap vocabulary instead of "dark" / "light":
 *   WoB — White on Black: light legends on a dark board (the default).
 *   BoW — Black on White: dark legends on a light board.
 *
 * Colorway is the palette the whole site is dressed in — the plan is to run one
 * GMK-style colorway per meetup. Adding one is two steps:
 *   1. Add an entry here.
 *   2. Add the matching `[data-colorway="<id>"]` blocks in `src/app/globals.css`
 *      (copy the commented template at the bottom of the theme layer).
 * Nothing else in the codebase reads colors directly, so the site follows.
 */

export const themeStorageKey = "rakb-legend";

export type LegendMode = (typeof legendModes)[number]["id"];

export const legendModes = [
  {
    id: "wob",
    label: "WoB",
    name: "White on Black",
    hint: "Light legends, dark board",
  },
  {
    id: "bow",
    label: "BoW",
    name: "Black on White",
    hint: "Dark legends, light board",
  },
] as const;

export const defaultLegendMode: LegendMode = "wob";

export type Colorway = {
  id: string;
  name: string;
  /** Shown in the community/tools pages if we ever list past colorways. */
  note: string;
};

export const colorways = [
  {
    id: "default",
    name: "Aksara",
    note: "House colorway — plain black, plain white, one blue accent.",
  },
  {
    id: "foundation",
    name: "Foundation",
    note: "Warm greige and cream with a full set of colorful alphas.",
  },
  {
    id: "a",
    name: "GMK A",
    note: "Deep teal-blue against a cool grey plate, with a red accent.",
  },
] as const satisfies readonly Colorway[];

/**
 * The colorway the site is currently wearing. Point this at the upcoming
 * meetup's theme — it is the single switch for the whole site and the logo.
 */
export const activeColorway = "a";
