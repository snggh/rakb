"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { LegendSwitch } from "@/components/legend-switch";
import { LogoBadge } from "@/components/logo";
import { RegisterCta } from "@/components/register-cta";
import { event } from "@/content/event";
import { navItems } from "@/lib/site";

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);

  // Scroll-edge effect: stamp data-scrolled once content is under the header.
  // Passive listener, attribute set directly — no React re-render per scroll.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let scrolled = false;
    const update = () => {
      const next = window.scrollY > 4;
      if (next !== scrolled) {
        scrolled = next;
        if (next) el.setAttribute("data-scrolled", "");
        else el.removeAttribute("data-scrolled");
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header ref={ref} className="site-header">
      <div className="wrap flex h-16 items-center gap-5">
        <Link
          href="/"
          aria-label="Ruang Aksara Keyboard"
          className="mr-auto flex items-center gap-2.5 no-underline"
        >
          {/* The badge carries the name, so no wordmark beside it. */}
          <LogoBadge className="logo-lockup" decorative />
          <span className="mono vol-badge">{event.volume}</span>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <LegendSwitch className="legend-switch-desktop" />
        <RegisterCta className="btn btn-primary px-3.5! py-1.75!">Register</RegisterCta>
      </div>
      <div className="mobile-bar">
        <nav className="mobile-nav" aria-label="Mobile">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 whitespace-nowrap"
              aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <LegendSwitch className="legend-switch-mobile" />
      </div>
    </header>
  );
}
