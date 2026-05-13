"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  /* Step 1: mount only on pointer-fine (mouse) devices */
  useEffect(() => {
    const checkIsTouch = () => {
      if (typeof window === "undefined") return false;
      return (
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 1024
      );
    };

    if (!checkIsTouch()) {
      setVisible(true);
    }
  }, []);

  /* Step 2: RAF loop after confirmed mouse device */
  useEffect(() => {
    if (!visible) return;
    const dot  = dotRef.current!; // safe: rendered only when visible=true
    const ring = ringRef.current!;

    /* All position state is in plain variables — zero React re-renders */
    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;
    let alphaCur = 0;
    let alphaTarget = 0;
    let isHover = false;
    let rafId: number;

    /* ── Initialise dot ── */
    Object.assign(dot.style, {
      position:      "fixed",
      top:           "0",
      left:          "0",
      width:         "7px",
      height:        "7px",
      marginLeft:    "-3.5px",
      marginTop:     "-3.5px",
      background:    "#6C47FF",
      borderRadius:  "50%",
      pointerEvents: "none",
      zIndex:        "99999",
      opacity:       "0",
      willChange:    "transform, opacity",
      boxShadow:     "0 0 8px rgba(108,71,255,0.5)",
    } as CSSStyleDeclaration);

    /* ── Initialise ring ── */
    Object.assign(ring.style, {
      position:      "fixed",
      top:           "0",
      left:          "0",
      width:         "30px",
      height:        "30px",
      marginLeft:    "-15px",
      marginTop:     "-15px",
      border:        "1.5px solid rgba(108,71,255,0.7)",
      borderRadius:  "50%",
      background:    "transparent",
      pointerEvents: "none",
      zIndex:        "99998",
      opacity:       "0",
      willChange:    "transform, opacity",
      transition:    "width .25s ease, height .25s ease, margin .25s ease, background .25s ease",
    } as CSSStyleDeclaration);

    /* ── Apply hover state ── */
    function setHoverState(next: boolean) {
      if (next === isHover) return;
      isHover = next;
      if (isHover) {
        Object.assign(ring.style, {
          width: "48px", height: "48px",
          marginLeft: "-24px", marginTop: "-24px",
          background: "rgba(108,71,255,0.08)",
        });
      } else {
        Object.assign(ring.style, {
          width: "30px", height: "30px",
          marginLeft: "-15px", marginTop: "-15px",
          background: "transparent",
        });
      }
    }

    /* ── RAF animation ── */
    function tick() {
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      /* Snap ring exactly when close — eliminates the standing-still artifact */
      if (dist < 1.2) {
        ringX = mouseX;
        ringY = mouseY;
      } else {
        ringX += dx * 0.15;  /* faster lerp = tighter lag, less gap */
        ringY += dy * 0.15;
      }

      alphaCur += (alphaTarget - alphaCur) * 0.08;

      const a = alphaCur.toFixed(3);

      ring.style.transform = `translate(${ringX}px,${ringY}px)`;
      ring.style.opacity   = a;

      dot.style.transform = `translate(${mouseX}px,${mouseY}px)`;
      dot.style.opacity   = isHover ? "0" : a;

      rafId = requestAnimationFrame(tick);
    }
    tick();

    /* ── Event listeners ── */
    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      alphaTarget = 1;
      const t = e.target as HTMLElement;
      setHoverState(!!t.closest("a, button, [data-cursor='hover']"));
    }

    document.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", () => { alphaTarget = 0; });
    document.documentElement.addEventListener("mouseenter", () => { alphaTarget = 1; });

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <div ref={dotRef}  aria-hidden="true" />
      <div ref={ringRef} aria-hidden="true" />
      <style>{`
        @media (min-width: 1024px) and (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>
    </>
  );
}
