"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { event } from "@/content/event";
import { navItems } from "@/lib/site";

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="wrap flex h-16 items-center gap-7">
        <Link
          href="/"
          aria-label="Ruang Aksara Keyboard"
          className="mr-auto flex items-center gap-2.5 no-underline"
        >
          <span className="logo-mark">
            <Image
              src="/logo.jpg"
              alt=""
              width={28}
              height={28}
              className="h-full w-full object-cover"
              priority
            />
          </span>
          <span className="text-[14.5px] font-semibold tracking-[-0.02em]">Ruang Aksara Keyboard</span>
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
        <Link href="/register" className="btn btn-primary !px-3.5 !py-[7px]">
          Register
        </Link>
      </div>
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
    </header>
  );
}
