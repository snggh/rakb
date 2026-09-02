/**
 * Route-change entrance. Pure CSS (`.page-enter` in globals.css) so the
 * animation keeps its frames while the browser is busy loading the new page.
 * `app/template.tsx` remounts this on every navigation, which restarts it.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
