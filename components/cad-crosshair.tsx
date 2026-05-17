"use client";

import { useEffect, useRef, useState } from "react";

export function CADCrosshair() {
  const hLineRef = useRef<HTMLDivElement>(null);
  const vLineRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  /* Mount only on desktop / precision pointer devices */
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

  useEffect(() => {
    if (!visible) return;

    const hLine = hLineRef.current;
    const vLine = vLineRef.current;

    if (!hLine || !vLine) return;

    /* Initialize base styling with high-performance properties */
    Object.assign(hLine.style, {
      position: "fixed",
      left: "0",
      top: "0",
      width: "100vw",
      height: "1px",
      pointerEvents: "none",
      zIndex: "9998",
      willChange: "transform, opacity",
      opacity: "0",
      transition: "opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
    });

    Object.assign(vLine.style, {
      position: "fixed",
      left: "0",
      top: "0",
      width: "1px",
      height: "100vh",
      pointerEvents: "none",
      zIndex: "9998",
      willChange: "transform, opacity",
      opacity: "0",
      transition: "opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
    });

    const onPointerMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      /* Update positions instantly utilizing hardware-accelerated transforms */
      hLine.style.transform = `translate3d(0, ${y}px, 0)`;
      vLine.style.transform = `translate3d(${x}px, 0, 0)`;

      /* Reveal elements on first movement */
      hLine.style.opacity = "0.038";
      vLine.style.opacity = "0.038";
    };

    const onMouseLeave = () => {
      hLine.style.opacity = "0";
      vLine.style.opacity = "0";
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <div ref={hLineRef} className="bg-primary dark:bg-primary/80" aria-hidden="true" />
      <div ref={vLineRef} className="bg-primary dark:bg-primary/80" aria-hidden="true" />
    </>
  );
}

