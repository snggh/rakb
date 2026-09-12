"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
  type WheelEvent as ReactWheelEvent,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import type { GalleryItem } from "@/content/gallery";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
/** Modal open — occasional; purpose: prevent jarring change / spatial settle. */
const ENTER = { duration: 0.25, ease: EASE_OUT };
/** Exit snappier than enter — user already decided. */
const EXIT = { duration: 0.18, ease: EASE_OUT };

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;
const DRAG_THRESHOLD_PX = 4;

type GalleryLightboxProps = {
  items: GalleryItem[];
  index: number | null;
  volumeLabel?: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export function GalleryLightbox({
  items,
  index,
  volumeLabel,
  onClose,
  onIndexChange,
}: GalleryLightboxProps) {
  const titleId = useId();
  const reduce = useReducedMotion();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const open = index !== null && items.length > 0;
  const current = open ? items[index]! : null;
  const multi = open && items.length > 1;

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [zoomOutCursor, setZoomOutCursor] = useState(false);
  const draggingRef = useRef(false);
  const didDragRef = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });
  const pointerOrigin = useRef({ x: 0, y: 0 });

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    draggingRef.current = false;
    didDragRef.current = false;
    setIsDragging(false);
  }, []);

  useEffect(() => {
    resetView();
  }, [index, resetView]);

  const go = useCallback(
    (delta: number) => {
      if (index === null || items.length === 0) return;
      // Instant swap — keyboard / rapid browse; must not animate.
      onIndexChange((index + delta + items.length) % items.length);
    },
    [index, items.length, onIndexChange],
  );

  const clampZoom = (value: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

  const zoomBy = useCallback((delta: number) => {
    setZoom((z) => {
      const next = clampZoom(z + delta);
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
        return;
      }
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        zoomBy(ZOOM_STEP);
        return;
      }
      if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        zoomBy(-ZOOM_STEP);
      }
    };

    window.addEventListener("keydown", onKey);
    const onMod = (e: KeyboardEvent) => {
      setZoomOutCursor(e.ctrlKey || e.metaKey);
    };
    const clearMod = () => setZoomOutCursor(false);
    window.addEventListener("keydown", onMod);
    window.addEventListener("keyup", onMod);
    window.addEventListener("blur", clearMod);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Blur the page shell — backdrop-filter fails when Motion animates opacity/transform
    // on the same (or ancestor) node, so we filter the site instead.
    document.documentElement.classList.add("lightbox-open");

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keydown", onMod);
      window.removeEventListener("keyup", onMod);
      window.removeEventListener("blur", clearMod);
      document.body.style.overflow = prevOverflow;
      document.documentElement.classList.remove("lightbox-open");
    };
  }, [open, onClose, go, zoomBy]);

  const onWheel = (e: ReactWheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setZoom((z) => {
      const next = clampZoom(z + delta);
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    if (zoom <= 1) return;
    draggingRef.current = true;
    didDragRef.current = false;
    setIsDragging(true);
    lastPoint.current = { x: e.clientX, y: e.clientY };
    pointerOrigin.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastPoint.current.x;
    const dy = e.clientY - lastPoint.current.y;
    lastPoint.current = { x: e.clientX, y: e.clientY };
    const totalX = e.clientX - pointerOrigin.current.x;
    const totalY = e.clientY - pointerOrigin.current.y;
    if (Math.hypot(totalX, totalY) > DRAG_THRESHOLD_PX) {
      didDragRef.current = true;
    }
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    draggingRef.current = false;
    setIsDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const onStageClick = (e: ReactMouseEvent) => {
    // Nav edges sit above the stage; this only fires on the photo itself.
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    if (e.ctrlKey || e.metaKey) {
      zoomBy(-ZOOM_STEP);
    } else {
      zoomBy(ZOOM_STEP);
    }
  };

  // Use content dimensions immediately — don't wait on load (avoids portrait
  // max-width sticking when flipping to a landscape shot).
  const isLandscape = current ? current.w >= current.h : true;

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && current ? (
        <motion.div
          key="lightbox"
          className="lightbox-root"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: ENTER }}
          exit={{ opacity: 0, transition: EXIT }}
          onClick={onClose}
        >
          <header
            className="lightbox-chrome lightbox-chrome-top"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0">
              <div id={titleId} className="lightbox-title">
                {current.cap}
              </div>
              <div className="lightbox-meta mono">
                {volumeLabel ? `${volumeLabel} · ` : ""}
                {index! + 1} / {items.length}
              </div>
            </div>
            <div className="lightbox-actions">
              <button
                type="button"
                className="lightbox-chip"
                aria-label="Zoom out"
                disabled={zoom <= MIN_ZOOM}
                onClick={() => zoomBy(-ZOOM_STEP)}
              >
                −
              </button>
              <button
                type="button"
                className="lightbox-chip"
                aria-label="Zoom in"
                disabled={zoom >= MAX_ZOOM}
                onClick={() => zoomBy(ZOOM_STEP)}
              >
                +
              </button>
              <button
                type="button"
                className="lightbox-chip"
                aria-label="Close"
                onClick={onClose}
              >
                ×
              </button>
            </div>
          </header>

          <motion.div
            className="lightbox-shell"
            data-orientation={isLandscape ? "landscape" : "portrait"}
            style={
              isLandscape
                ? ({ ["--photo-ar"]: `${current.w} / ${current.h}` } as CSSProperties)
                : undefined
            }
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "scale(0.92)" }}
            animate={{ opacity: 1, transform: "scale(1)", transition: ENTER }}
            exit={
              reduce
                ? { opacity: 0, transition: EXIT }
                : { opacity: 0, transform: "scale(0.97)", transition: EXIT }
            }
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="lightbox-stage"
              data-zoomed={zoom > 1 ? "true" : "false"}
              data-zoom-out={zoomOutCursor ? "true" : "false"}
              onWheel={onWheel}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onClick={onStageClick}
            >
              <div
                className="lightbox-frame"
                style={{
                  transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                  transition: isDragging
                    ? "none"
                    : "transform var(--dur-ui) var(--ease-out)",
                }}
              >
                {isLandscape ? (
                  <Image
                    key={current.src}
                    src={current.src}
                    alt={current.cap}
                    fill
                    sizes="96vw"
                    priority
                    className="lightbox-photo object-contain"
                    draggable={false}
                  />
                ) : (
                  <Image
                    key={current.src}
                    src={current.src}
                    alt={current.cap}
                    width={current.w}
                    height={current.h}
                    sizes="70vw"
                    priority
                    className="lightbox-photo"
                    draggable={false}
                  />
                )}
              </div>
            </div>

            {multi ? (
              <>
                <div className="lightbox-edge lightbox-edge-prev">
                  <button
                    type="button"
                    className="lightbox-nav"
                    aria-label="Previous photo"
                    onClick={() => go(-1)}
                  >
                    <span className="lightbox-nav-glyph" aria-hidden="true">
                      ‹
                    </span>
                  </button>
                </div>
                <div className="lightbox-edge lightbox-edge-next">
                  <button
                    type="button"
                    className="lightbox-nav"
                    aria-label="Next photo"
                    onClick={() => go(1)}
                  >
                    <span className="lightbox-nav-glyph" aria-hidden="true">
                      ›
                    </span>
                  </button>
                </div>
              </>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
