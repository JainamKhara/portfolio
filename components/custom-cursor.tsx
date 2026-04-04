"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Ring follows dot with delay using animation frame
  useEffect(() => {
    let animationFrameId: number;
    const speed = 0.15; // Lower = more delay, higher = less delay

    const animate = () => {
      setRingPos((prev) => ({
        x: prev.x + (mousePos.x - prev.x) * speed,
        y: prev.y + (mousePos.y - prev.y) * speed,
      }));
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos]);

  // Update positions
  useEffect(() => {
    if (dotRef.current) {
      dotRef.current.style.left = `${mousePos.x}px`;
      dotRef.current.style.top = `${mousePos.y}px`;
    }
    if (ringRef.current) {
      ringRef.current.style.left = `${ringPos.x}px`;
      ringRef.current.style.top = `${ringPos.y}px`;
    }
  }, [mousePos, ringPos]);

  return (
    <>
      {/* Dot cursor */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[9999] w-3 h-3 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-full h-full rounded-full dark:bg-white bg-black dark:shadow-[0_0_10px_rgba(255,255,255,0.6)] shadow-[0_0_10px_rgba(0,0,0,0.4)]" />
      </div>

      {/* Ring cursor */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[9998] w-8 h-8 border-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          borderColor: "var(--ring-color)",
        }}
      >
        <style>{`
          :root {
            --ring-color: #000000;
          }
          .dark {
            --ring-color: #ffffff;
          }
        `}</style>
      </div>

      {/* Hide default cursor */}
      <style>{`
        * {
          cursor: none !important;
        }
        input,
        textarea,
        [contenteditable="true"],
        button,
        a,
        [role="button"] {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}


