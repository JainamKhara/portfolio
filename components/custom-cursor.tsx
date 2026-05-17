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

    /* Position state stored in plain variables for maximum 120fps performance */
    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;
    let currentStretch = 1;
    let currentRotation = 0;
    
    let alphaCur = 0;
    let alphaTarget = 0;
    let isHover = false;
    let rafId: number;

    /* ── Initialise dot wrapper styles ── */
    Object.assign(dot.style, {
      position:      "fixed",
      top:           "0",
      left:          "0",
      width:         "7px",
      height:        "7px",
      marginLeft:    "-3.5px",
      marginTop:     "-3.5px",
      background:    "#D9281C",
      borderRadius:  "50%",
      pointerEvents: "none",
      zIndex:        "99999",
      opacity:       "0",
      willChange:    "transform, opacity",
      boxShadow:     "0 0 8px rgba(217, 40, 28, 0.6)",
    } as CSSStyleDeclaration);

    /* ── Initialise ring container styles ── */
    Object.assign(ring.style, {
      position:      "fixed",
      top:           "0",
      left:          "0",
      width:         "26px",
      height:        "26px",
      marginLeft:    "-13px",
      marginTop:     "-13px",
      border:        "1.5px solid rgba(217, 40, 28, 0.8)",
      borderRadius:  "50%",
      background:    "transparent",
      pointerEvents: "none",
      zIndex:        "99998",
      opacity:       "0",
      willChange:    "transform, opacity",
      boxShadow:     "0 0 4px rgba(217, 40, 28, 0.15)",
      transition:    "width .2s cubic-bezier(0.22, 1, 0.36, 1), height .2s cubic-bezier(0.22, 1, 0.36, 1), margin .2s cubic-bezier(0.22, 1, 0.36, 1), background .2s cubic-bezier(0.22, 1, 0.36, 1)",
    } as CSSStyleDeclaration);

    /* ── Apply hover state ── */
    function setHoverState(next: boolean) {
      if (next === isHover) return;
      isHover = next;
      if (isHover) {
        Object.assign(ring.style, {
          width: "42px",
          height: "42px",
          marginLeft: "-21px",
          marginTop: "-21px",
          background: "rgba(217, 40, 28, 0.06)",
          borderColor: "rgba(217, 40, 28, 0.95)",
          boxShadow: "0 0 10px rgba(217, 40, 28, 0.3)",
        });
      } else {
        Object.assign(ring.style, {
          width: "26px",
          height: "26px",
          marginLeft: "-13px",
          marginTop: "-13px",
          background: "transparent",
          borderColor: "rgba(217, 40, 28, 0.8)",
          boxShadow: "0 0 4px rgba(217, 40, 28, 0.15)",
        });
      }
    }

    /* ── RAF animation loop ── */
    function tick() {
      // 1. Lerp position coordinates
      const dxPos = mouseX - ringX;
      const dyPos = mouseY - ringY;
      
      if (Math.abs(dxPos) < 0.1 && Math.abs(dyPos) < 0.1) {
        ringX = mouseX;
        ringY = mouseY;
      } else {
        ringX += dxPos * 0.14;
        ringY += dyPos * 0.14;
      }

      // 2. Velocity calculations for dynamic blueprint stretch
      const dxVel = mouseX - lastMouseX;
      const dyVel = mouseY - lastMouseY;
      const speed = Math.sqrt(dxVel * dxVel + dyVel * dyVel);
      
      lastMouseX = mouseX;
      lastMouseY = mouseY;

      // Target stretch limit (clamped to prevent distortion)
      const targetStretch = 1 + Math.min(speed * 0.015, 0.55);
      const targetRotation = speed > 0.6 ? Math.atan2(dyVel, dxVel) : currentRotation;

      // Elastic LERP damping
      currentStretch += (targetStretch - currentStretch) * 0.12;
      currentRotation += (targetRotation - currentRotation) * 0.12;

      const squash = 1 / currentStretch;

      // 3. Smooth fade opacity
      alphaCur += (alphaTarget - alphaCur) * 0.1;
      const a = alphaCur.toFixed(3);

      // 4. Apply transformations to components
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) rotate(${currentRotation}rad) scale(${currentStretch}, ${squash})`;
      ring.style.opacity   = a;

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      dot.style.opacity   = isHover ? "0" : a;

      rafId = requestAnimationFrame(tick);
    }
    tick();

    /* ── Event listeners ── */
    function onMove(e: PointerEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      alphaTarget = 1;
      const t = e.target as HTMLElement;
      setHoverState(!!(t && t.closest && t.closest("a, button, [data-cursor='hover']")));
    }

    /* ── Dynamic concentric click ripple trigger ── */
    function onClick(e: MouseEvent) {
      const ripple = document.createElement("div");
      Object.assign(ripple.style, {
        position: "fixed",
        left: "0",
        top: "0",
        width: "52px",
        height: "52px",
        marginLeft: "-26px",
        marginTop: "-26px",
        border: "1.5px solid #D9281C",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: "99997",
        transform: `translate3d(${e.clientX}px, ${e.clientY}px, 0) scale(0.1)`,
        opacity: "0.85",
        willChange: "transform, opacity",
        transition: "transform 0.4s cubic-bezier(0.215, 0.61, 0.355, 1), opacity 0.4s cubic-bezier(0.215, 0.61, 0.355, 1)",
      });
      document.body.appendChild(ripple);

      // Trigger animation
      requestAnimationFrame(() => {
        ripple.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) scale(2.2)`;
        ripple.style.opacity = "0";
      });

      // Cleanup
      setTimeout(() => {
        ripple.remove();
      }, 450);
    }

    window.addEventListener("pointermove", onMove, { capture: true });
    window.addEventListener("click", onClick, { capture: true });
    window.addEventListener("mouseleave", () => { alphaTarget = 0; });
    window.addEventListener("mouseenter", () => { alphaTarget = 1; });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove, { capture: true });
      window.removeEventListener("click", onClick, { capture: true });
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <div ref={dotRef} style={{ pointerEvents: "none" }} aria-hidden="true" />
      <div ref={ringRef} style={{ pointerEvents: "none" }} aria-hidden="true" />
      <style>{`
        @media (min-width: 1024px) and (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>
    </>
  );
}


