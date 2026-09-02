"use client";

import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger offset in seconds. Keep 0.03–0.08 between siblings. */
  delay?: number;
  as?: "div" | "li" | "article" | "section";
};

/**
 * Scroll reveal for marketing surfaces. Motion lives in CSS (`.reveal` in
 * globals.css) so it runs off the main thread; JS only stamps `data-visible`
 * on the element once it enters the viewport. Fires once, no re-render.
 */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  // Callback ref keeps the union of intrinsic tags happy with one ref type.
  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.setAttribute("data-visible", "");
    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -48px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={setRef}
      className={className ? `reveal ${className}` : "reveal"}
      style={delay > 0 ? { transitionDelay: `${Math.round(delay * 1000)}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
