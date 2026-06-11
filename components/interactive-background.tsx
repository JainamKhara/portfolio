"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface GridPoint {
  x: number;
  y: number;
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Grid coordinates cache (prevents recalculations in tick loop)
    let gridPoints: GridPoint[] = [];

    // Mouse coordinates (target and lerped current)
    let mouseX = -9999;
    let mouseY = -9999;
    let targetX = -9999;
    let targetY = -9999;

    // Active state tracking
    let isActive = false;
    let isRunning = true;
    let idleFrames = 0;

    // Velocity tracking for dynamic ring resizing
    let lastX = -9999;
    let lastY = -9999;
    let speed = 0;
    let ringRadius = 60;
    let secondaryRingRadius = 110;

    // High-density grid spacing for a very rich, premium dot grid look (36px instead of 72px)
    const gridSpacing = 36;
    const maxDistance = 160;
    const maxDistanceSq = maxDistance * maxDistance;
    const pullStrength = 15;

    const handleResize = () => {
      if (!canvas) return;
      
      // OPTIMIZATION: Cap DPR at 1.5 to prevent massive rendering resolutions on high-DPI (Retina/4K) screens.
      // Capping at 1.5 cuts pixel rendering load by up to 75% on 3x screens while keeping lines sharp.
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      
      width = window.innerWidth;
      height = window.innerHeight;
 
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Cache all grid intersection points (avoids nested bounds-evaluation math in tick loop)
      gridPoints = [];
      const startX = Math.floor(0 / gridSpacing) * gridSpacing;
      const endX = Math.ceil(width / gridSpacing) * gridSpacing;
      const startY = Math.floor(0 / gridSpacing) * gridSpacing;
      const endY = Math.ceil(height / gridSpacing) * gridSpacing;

      for (let x = startX; x <= endX; x += gridSpacing) {
        for (let y = startY; y <= endY; y += gridSpacing) {
          gridPoints.push({ x, y });
        }
      }
      
      wakeUp();
    };

    const wakeUp = () => {
      if (!isRunning) {
        isRunning = true;
        idleFrames = 0;
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    const handleMouseMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;

      targetX = e.clientX;
      targetY = e.clientY;
      isActive = true;

      if (mouseX === -9999) {
        mouseX = targetX;
        mouseY = targetY;
        lastX = targetX;
        lastY = targetY;
      }

      wakeUp();
    };

    const handleMouseLeave = () => {
      isActive = false;
      targetX = -9999;
      targetY = -9999;
      wakeUp();
    };

    const handleMouseEnter = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      isActive = true;
      targetX = e.clientX;
      targetY = e.clientY;
      wakeUp();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handleMouseMove, { passive: true });
    window.addEventListener("pointerleave", handleMouseLeave);
    window.addEventListener("pointerenter", handleMouseEnter, { passive: true });

    // Initial setup
    handleResize();

    // Reusable draw function for drawing background spotlight, high-density grid dots, and CAD details
    const drawGrid = (isDark: boolean) => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Spotlight Background Glow
      if (isActive && mouseX !== -9999) {
        const glowRad = 240 + Math.min(speed * 2, 100);
        const glowGrad = ctx.createRadialGradient(
          mouseX,
          mouseY,
          10,
          mouseX,
          mouseY,
          glowRad
        );
        
        if (isDark) {
          glowGrad.addColorStop(0, "rgba(217, 40, 28, 0.045)");
          glowGrad.addColorStop(0.5, "rgba(217, 40, 28, 0.01)");
          glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        } else {
          glowGrad.addColorStop(0, "rgba(217, 40, 28, 0.02)");
          glowGrad.addColorStop(0.6, "rgba(217, 40, 28, 0.004)");
          glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        }

        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Batch-Draw Grid Dots
      const defaultDotColor = isDark
        ? "rgba(248, 250, 252, 0.095)"
        : "rgba(10, 10, 10, 0.065)";

      const activeDotColor = "rgba(217, 40, 28, 0.8)";

      // Set default fillStyle and draw default dots first in a single batch
      ctx.fillStyle = defaultDotColor;
      
      const activePoints: { x: number; y: number; size: number }[] = [];
      const len = gridPoints.length;

      for (let i = 0; i < len; i++) {
        const pt = gridPoints[i];
        const x = pt.x;
        const y = pt.y;

        if (mouseX === -9999) {
          ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
          continue;
        }

        const dx = mouseX - x;
        const dy = mouseY - y;
        const distSq = dx * dx + dy * dy;

        // Skip calculations if dot is out of interaction range
        if (distSq < maxDistanceSq) {
          const dist = Math.sqrt(distSq);
          if (dist > 0.1) {
            const ratio = (maxDistance - dist) / maxDistance;
            const pull = Math.sin(ratio * (Math.PI / 2)) * pullStrength;
            const factor = pull / dist;
            
            const drawX = x + dx * factor;
            const drawY = y + dy * factor;

            if (dist < maxDistance * 0.8) {
              const colorRatio = (maxDistance * 0.8 - dist) / (maxDistance * 0.8);
              const size = 1.5 + colorRatio * 1.5;
              activePoints.push({ x: drawX, y: drawY, size });
            } else {
              ctx.fillRect(drawX - 0.75, drawY - 0.75, 1.5, 1.5);
            }
          } else {
            ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
          }
        } else {
          ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
        }
      }

      // Draw active/highlighted points in a single color batch
      const activeLen = activePoints.length;
      if (activeLen > 0) {
        ctx.fillStyle = activeDotColor;
        for (let i = 0; i < activeLen; i++) {
          const apt = activePoints[i];
          ctx.fillRect(apt.x - apt.size / 2, apt.y - apt.size / 2, apt.size, apt.size);
        }
      }

      // 3. Draw CAD Cursor Details
      if (isActive && mouseX !== -9999) {
        const accentColor = isDark ? "rgba(217, 40, 28, 0.12)" : "rgba(217, 40, 28, 0.08)";
        const ringColor = isDark ? "rgba(217, 40, 28, 0.05)" : "rgba(217, 40, 28, 0.03)";
        
        ctx.lineWidth = 1;

        ctx.strokeStyle = ringColor;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = isDark ? "rgba(217, 40, 28, 0.02)" : "rgba(217, 40, 28, 0.01)";
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, secondaryRingRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = accentColor;
        ctx.beginPath();
        ctx.moveTo(mouseX - 12, mouseY);
        ctx.lineTo(mouseX - 4, mouseY);
        ctx.moveTo(mouseX + 4, mouseY);
        ctx.lineTo(mouseX + 12, mouseY);
        ctx.moveTo(mouseX, mouseY - 12);
        ctx.lineTo(mouseX, mouseY - 4);
        ctx.moveTo(mouseX, mouseY + 4);
        ctx.lineTo(mouseX, mouseY + 12);
        ctx.stroke();
      }
    };

    // The render tick loop
    const tick = () => {
      const isDark = resolvedTheme === "dark";

      // 1. Lerp mouse positions
      if (targetX !== -9999) {
        if (mouseX === -9999) {
          mouseX = targetX;
          mouseY = targetY;
        } else {
          mouseX += (targetX - mouseX) * 0.12;
          mouseY += (targetY - mouseY) * 0.12;
        }
      } else {
        mouseX += (-9999 - mouseX) * 0.08;
        mouseY += (-9999 - mouseY) * 0.08;
      }

      // Calculate speed
      if (lastX !== -9999 && mouseX !== -9999) {
        const dx = mouseX - lastX;
        const dy = mouseY - lastY;
        const instantSpeed = Math.sqrt(dx * dx + dy * dy);
        speed += (instantSpeed - speed) * 0.1;
      }
      lastX = mouseX;
      lastY = mouseY;

      const targetRing = 50 + Math.min(speed * 1.5, 120);
      const targetSecRing = 100 + Math.min(speed * 2.5, 200);
      ringRadius += (targetRing - ringRadius) * 0.1;
      secondaryRingRadius += (targetSecRing - secondaryRingRadius) * 0.1;

      // Draw active grid
      drawGrid(isDark);

      // 2. IDLE POWER CONSERVATION ENGINE
      const isMouseAtRest = targetX === -9999 
        ? Math.abs(mouseX - -9999) < 1 
        : Math.abs(mouseX - targetX) < 0.25 && Math.abs(mouseY - targetY) < 0.25;
      
      const isIdle = isMouseAtRest && speed < 0.08;

      if (isIdle) {
        idleFrames++;
      } else {
        idleFrames = 0;
      }

      // Pause loop after 45 frames of complete inactivity (~0.75 seconds)
      if (isIdle && idleFrames > 45) {
        isRunning = false;
        drawGrid(isDark);
        return;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    // Begin loop
    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handleMouseMove);
      window.removeEventListener("pointerleave", handleMouseLeave);
      window.removeEventListener("pointerenter", handleMouseEnter);
    };
  }, [mounted, resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-80"
      style={{
        transform: "translate3d(0, 0, 0)",
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
      aria-hidden="true"
    />
  );
}
