import { defaultLegendMode, themeStorageKey } from "@/content/theme";

/**
 * Runs before first paint, so the page never flashes the wrong board colour.
 * A stored choice wins; otherwise the OS preference decides. Kept as a string
 * because it has to be inline in the document head, ahead of hydration.
 */
export const themeScript = `(function(){try{var k=${JSON.stringify(themeStorageKey)};var s=null;try{s=localStorage.getItem(k)}catch(e){}var m=(s==="wob"||s==="bow")?s:(window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"bow":"wob");document.documentElement.setAttribute("data-theme",m)}catch(e){document.documentElement.setAttribute("data-theme",${JSON.stringify(defaultLegendMode)})}})();`;
