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

    let width = 0;
    let height = 0;
    let dpr = 1;

    // Grid coordinates cache
    let gridPoints: GridPoint[] = [];
    const gridSpacing = 36;

    const drawGrid = (isDark: boolean) => {
      ctx.clearRect(0, 0, width, height);

      // Batch-Draw Grid Dots
      const defaultDotColor = isDark
        ? "rgba(248, 250, 252, 0.095)"
        : "rgba(10, 10, 10, 0.065)";

      ctx.fillStyle = defaultDotColor;
      
      const len = gridPoints.length;
      for (let i = 0; i < len; i++) {
        const pt = gridPoints[i];
        ctx.fillRect(pt.x - 0.75, pt.y - 0.75, 1.5, 1.5);
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      
      // OPTIMIZATION: Cap DPR at 1.5 to prevent massive rendering resolutions on high-DPI screens.
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      
      width = window.innerWidth;
      height = window.innerHeight;
 
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Cache all grid intersection points
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
      
      const isDark = resolvedTheme === "dark";
      drawGrid(isDark);
    };

    window.addEventListener("resize", handleResize);

    // Initial setup
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mounted, resolvedTheme]);

  return null;
}
