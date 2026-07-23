"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  el: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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

  /* Step 2: RAF tracking loop with synchronized outer ring + morphing + smoke particles */
  useEffect(() => {
    if (!visible) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const container = containerRef.current!;

    // Mouse coordinates (client viewport coordinates)
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;
    
    // Ring physical coordinates
    let ringX = mouseX;
    let ringY = mouseY;
    let ringSize = 36;

    let lastSpawnX = ringX;
    let lastSpawnY = ringY;

    let isHovering = false;
    let isClicking = false;
    let alphaCur = 0;
    let alphaTarget = 0;
    let rafId: number;
    let lastAngle = 0;
    let currentStretch = 0;

    const particles: Particle[] = [];

    // Stylize the pointer dot (precision center indicator)
    Object.assign(dot.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "10px",
      height: "10px",
      marginLeft: "-5px",
      marginTop: "-5px",
      background: "#FFFFFF",
      border: "1.5px solid #D9281C",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "99999",
      opacity: "0",
      willChange: "transform, opacity",
    });

    // Stylize the outer morphing shape (smoke generator)
    Object.assign(ring.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "36px",
      height: "36px",
      marginLeft: "-18px",
      marginTop: "-18px",
      border: "2px solid rgba(217, 40, 28, 0.8)",
      backgroundColor: "rgba(217, 40, 28, 0.18)",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "99998",
      opacity: "0",
      boxSizing: "border-box",
      willChange: "transform, width, height, border-radius, opacity",
      transition: "background-color 0.2s ease, border-color 0.2s ease",
    });

    const tick = () => {
      // Lock positions together (no lag behind the dot)
      ringX = mouseX;
      ringY = mouseY;

      // Calculate travel velocity between frames
      const dxMove = mouseX - lastMouseX;
      const dyMove = mouseY - lastMouseY;
      const moveDist = Math.sqrt(dxMove * dxMove + dyMove * dyMove);

      let angle = lastAngle;
      if (moveDist > 0.1) {
        angle = Math.atan2(dyMove, dxMove);
        lastAngle = angle;
      }

      // Smoothly update last coordinates
      lastMouseX = mouseX;
      lastMouseY = mouseY;

      // 1. Squash and stretch target (based on cursor speed)
      const maxStretch = 0.5;
      const targetStretch = Math.min(moveDist * 0.015, maxStretch);
      
      // Interpolate the stretch factor to prevent jumpiness/jitter
      currentStretch += (targetStretch - currentStretch) * 0.15;
      
      const squash = currentStretch * 0.35;
      const scaleX = 1 + currentStretch;
      const scaleY = 1 - squash;

      // Interactive scale target
      let targetSize = 36;
      if (isHovering) {
        targetSize = 48;
      }
      ringSize += (targetSize - ringSize) * 0.2;

      // 2. Morph border radius (Circle at rest [50%], Teardrop in motion [0%])
      const borderRadiusFactor = Math.max(0, 50 - currentStretch * 100);
      ring.style.borderRadius = `${borderRadiusFactor}% 50% 50% 50%`;

      // 3. Fade in/out
      alphaCur += (alphaTarget - alphaCur) * 0.12;
      const a = alphaCur.toFixed(3);

      // 4. Apply transform chain: Translate -> Rotate -> Squash/Stretch -> Align teardrop -> Click scale
      const clickScale = isClicking ? 0.75 : 1.0;
      let transformStr = `translate3d(${ringX}px, ${ringY}px, 0)`;
      transformStr += ` rotate(${angle}rad) scale(${scaleX * clickScale}, ${scaleY * clickScale}) rotate(-45deg)`;

      ring.style.transform = transformStr;
      ring.style.width = `${ringSize}px`;
      ring.style.height = `${ringSize}px`;
      ring.style.marginLeft = `${-ringSize / 2}px`;
      ring.style.marginTop = `${-ringSize / 2}px`;
      ring.style.opacity = a;

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      dot.style.opacity = a;

      // 5. Update active smoke particles in trail
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 1;
        if (p.life >= p.maxLife) {
          p.el.remove();
          particles.splice(i, 1);
        } else {
          const t = p.life / p.maxLife;
          
          // Apply velocity and upwards drift
          p.x += p.vx;
          p.y += p.vy;
          
          // Add friction/drag to slow them down
          p.vx *= 0.95;
          p.vy *= 0.95;
          
          // Expand scale and fade opacity
          const scale = 1.0 + t * 2.0;
          p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) scale(${scale})`;
          p.el.style.opacity = `${p.opacity * (1 - t)}`;
        }
      }

      // 6. Spawn new smoke trail particles on movement
      const dxSpawn = ringX - lastSpawnX;
      const dySpawn = ringY - lastSpawnY;
      const distSinceSpawn = Math.sqrt(dxSpawn * dxSpawn + dySpawn * dySpawn);

      if (distSinceSpawn > 8 && particles.length < 40) {
        const el = document.createElement("div");
        const baseSize = 14 + Math.random() * 12; // 14px to 26px

        Object.assign(el.style, {
          position: "fixed",
          top: "0",
          left: "0",
          width: `${baseSize}px`,
          height: `${baseSize}px`,
          marginLeft: `${-baseSize / 2}px`,
          marginTop: `${-baseSize / 2}px`,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(217, 40, 28, 0.5) 0%, rgba(217, 40, 28, 0.18) 50%, rgba(217, 40, 28, 0) 70%)",
          pointerEvents: "none",
          zIndex: "99997",
          filter: "blur(4.5px)",
          willChange: "transform, opacity",
        });

        container.appendChild(el);

        // Slow random dispersion velocities with upwards drift bias
        const driftAngle = Math.random() * Math.PI * 2;
        const driftSpeed = Math.random() * 0.4;
        const vx = Math.cos(driftAngle) * driftSpeed;
        const vy = Math.sin(driftAngle) * driftSpeed - 0.15;

        particles.push({
          el,
          x: ringX,
          y: ringY,
          vx,
          vy,
          size: baseSize,
          opacity: 0.65,
          life: 0,
          maxLife: 25 + Math.random() * 15, // 25-40 frames (~0.4s to 0.7s)
        });

        lastSpawnX = ringX;
        lastSpawnY = ringY;
      }

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
      const hoverTarget = (t && typeof t.nodeType === "number" && t.nodeType === 1)
        ? Element.prototype.closest.call(t, "a, button, [role='button'], [data-cursor='hover']")
        : null;

      if (hoverTarget) {
        isHovering = true;
        Object.assign(ring.style, {
          borderColor: "#D9281C",
          backgroundColor: "rgba(217, 40, 28, 0.28)",
        });
      } else {
        isHovering = false;
        Object.assign(ring.style, {
          borderColor: "rgba(217, 40, 28, 0.8)",
          backgroundColor: "rgba(217, 40, 28, 0.18)",
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
      
      // Clean up all active smoke particles on unmount
      particles.forEach(p => p.el.remove());
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {/* Particle Container for active smoke puffs */}
      <div ref={containerRef} style={{ pointerEvents: "none" }} aria-hidden="true" />

      {/* Morphing Floating Teardrop Ring */}
      <div ref={ringRef} style={{ pointerEvents: "none" }} aria-hidden="true" />
      
      {/* Snappy Precision Center Dot */}
      <div ref={dotRef} style={{ pointerEvents: "none" }} aria-hidden="true" />

      <style>{`
        @media (min-width: 1024px) and (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>
    </>
  );
}
