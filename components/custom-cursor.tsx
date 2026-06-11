"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  /* Step 1: mount only on pointer-fine (mouse) desktop devices */
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

  /* Step 2: RAF tracking loop with fluid outer ring physics */
  useEffect(() => {
    if (!visible) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    // Mouse coordinates (client viewport coordinates)
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;
    
    // Ring physical coordinates
    let ringX = mouseX;
    let ringY = mouseY;
    let ringSize = 26;

    let isHovering = false;
    let isClicking = false;
    let alphaCur = 0;
    let alphaTarget = 0;
    let rafId: number;

    // Stylize the pointer dot
    Object.assign(dot.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "6px",
      height: "6px",
      marginLeft: "-3px",
      marginTop: "-3px",
      background: "#D9281C",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "99999",
      opacity: "0",
      willChange: "transform, opacity",
      boxShadow: "0 0 6px rgba(217, 40, 28, 0.4)",
    });

    // Stylize the outer ring
    Object.assign(ring.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "26px",
      height: "26px",
      marginLeft: "-13px",
      marginTop: "-13px",
      border: "1.5px solid rgba(217, 40, 28, 0.45)",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "99998",
      opacity: "0",
      boxSizing: "border-box",
      backgroundColor: "transparent",
      willChange: "transform, width, height, border-radius, background-color, opacity",
      transition: "background-color 0.3s ease, border-color 0.3s ease",
    });

    const tick = () => {
      // Calculate velocity for subtle reactive breathing
      const dxVel = mouseX - lastMouseX;
      const dyVel = mouseY - lastMouseY;
      const speed = Math.sqrt(dxVel * dxVel + dyVel * dyVel);
      lastMouseX = mouseX;
      lastMouseY = mouseY;

      // 1. Target coordinates are always exactly the mouse position
      const targetX = mouseX;
      const targetY = mouseY;

      // 2. Calculate target ring size (stays a perfect circle, scales slightly on hover)
      let targetSize = 26;
      if (isHovering) {
        targetSize = 38; // Clean, slightly larger circle on hover
      } else {
        // Subtle expansion based on speed
        targetSize = 26 + Math.min(speed * 0.12, 8);
      }

      // 3. Smooth Lerp interpolation for fluid tracking
      const posLerp = 0.2;
      ringX += (targetX - ringX) * posLerp;
      ringY += (targetY - ringY) * posLerp;
      ringSize += (targetSize - ringSize) * 0.2;

      // 4. Opacity tracking
      alphaCur += (alphaTarget - alphaCur) * 0.12;
      const a = alphaCur.toFixed(3);

      // 5. Apply transforms
      let transformStr = `translate3d(${ringX}px, ${ringY}px, 0)`;
      if (isClicking) {
        transformStr += ` scale(0.8)`;
      }

      ring.style.transform = transformStr;
      ring.style.width = `${ringSize}px`;
      ring.style.height = `${ringSize}px`;
      ring.style.marginLeft = `${-ringSize / 2}px`;
      ring.style.marginTop = `${-ringSize / 2}px`;
      ring.style.opacity = a;

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      dot.style.opacity = a; // Keep inner dot visible for precise pointing

      rafId = requestAnimationFrame(tick);
    };

    tick();

    // Event listeners
    const onMouseMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      alphaTarget = 1;

      // Scan for interactive tags
      const t = e.target as HTMLElement;
      const hoverTarget = t?.closest("a, button, [role='button'], [data-cursor='hover']");

      if (hoverTarget) {
        isHovering = true;
        Object.assign(ring.style, {
          borderColor: "#D9281C",
          backgroundColor: "rgba(217, 40, 28, 0.08)",
        });
      } else {
        isHovering = false;
        Object.assign(ring.style, {
          borderColor: "rgba(217, 40, 28, 0.45)",
          backgroundColor: "transparent",
        });
      }
    };

    const onPointerDown = () => {
      isClicking = true;
    };

    const onPointerUp = () => {
      isClicking = false;
    };

    window.addEventListener("pointermove", onMouseMove, { capture: true, passive: true });
    window.addEventListener("pointerdown", onPointerDown, { capture: true, passive: true });
    window.addEventListener("pointerup", onPointerUp, { capture: true, passive: true });
    window.addEventListener("mouseleave", () => { alphaTarget = 0; });
    window.addEventListener("mouseenter", () => { alphaTarget = 1; });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMouseMove, { capture: true });
      window.removeEventListener("pointerdown", onPointerDown, { capture: true });
      window.removeEventListener("pointerup", onPointerUp, { capture: true });
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {/* Interactive Floating Ring */}
      <div ref={ringRef} style={{ pointerEvents: "none" }} aria-hidden="true" />
      
      {/* Snappy Center Dot */}
      <div ref={dotRef} style={{ pointerEvents: "none" }} aria-hidden="true" />

      <style>{`
        @media (min-width: 1024px) and (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>
    </>
  );
}
