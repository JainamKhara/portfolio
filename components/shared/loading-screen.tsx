"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "@/lib/gsap";

type Stage = "BOOT" | "COALESCE" | "IDENTITY" | "REVEAL";

// Parses hex and rgb strings returned by computed styles
function parseColor(color: string): { r: number; g: number; b: number } {
  const clean = color.trim().toLowerCase();
  
  if (clean.startsWith("rgb")) {
    const match = clean.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10)
      };
    }
  }
  
  if (clean.startsWith("#")) {
    const hex = clean.substring(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16)
      };
    } else if (hex.length >= 6) {
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
      };
    }
  }

  if (clean === "black") return { r: 0, g: 0, b: 0 };
  if (clean === "white") return { r: 255, g: 255, b: 255 };
  
  return { r: 217, g: 40, b: 28 }; // Default Vermilion red fallback
}

// Stamped letter layout state
interface LetterState {
  char: string;
  y: number;
  scale: number;
  opacity: number;
  stamped: boolean;
  // Baseline rule accent: 0 = hidden, 1 = fully extended
  ruleProgress: number;
}

export function LoadingScreen({
  onRevealStart,
  onComplete,
}: {
  onRevealStart?: () => void;
  onComplete: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);
  const [stage, setStage] = useState<Stage>("BOOT");

  // GSAP animation references driven via timelines
  const bootProgressRef = useRef(0);
  const coalesceProgressRef = useRef(0);
  const identityProgressRef = useRef(0);
  const revealProgressRef = useRef(0);
  const gridOpacityRef = useRef(1.0);

  // Frame counter 0–100
  const frameCounterRef = useRef(0);
  // Ink pressure noise intensity per column: spikes on letter stamp, decays to resting grain
  const noiseIntensityRef = useRef<number[]>([0, 0, 0, 0, 0, 0]);

  const currentStageRef = useRef<Stage>("BOOT");
  const onRevealStartRef = useRef(onRevealStart);
  const onCompleteRef = useRef(onComplete);

  // Mechanical Letter Stamping references
  const lettersRef = useRef<LetterState[]>([]);

  useEffect(() => {
    onRevealStartRef.current = onRevealStart;
  }, [onRevealStart]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    currentStageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    gridOpacityRef.current = 1.0;

    // Fetch design color tokens dynamically from the theme
    const computedStyle = window.getComputedStyle(document.documentElement);
    const themePrimary = computedStyle.getPropertyValue('--primary').trim() || "#D9281C";
    const themeBackground = computedStyle.getPropertyValue('--background').trim() || "#030303";
    const primaryRgb = parseColor(themePrimary);
    const fontLoaderVal = computedStyle.getPropertyValue('--font-loader').trim() || '"Unbounded", "DM Sans", "Inter", sans-serif';


    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.visualViewport ? window.visualViewport.height : document.documentElement.clientHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // Initialize letter stamping parameters (with ruleProgress)
    lettersRef.current = ["J", "A", "I", "N", "A", "M"].map((char) => ({
      char,
      y: -300,
      scale: 3.8,
      opacity: 0,
      stamped: false,
      ruleProgress: 0,
    }));

    // Sequential Letterpress Stamping GSAP timeline
    const masterTl = gsap.timeline();

    masterTl
      // Stage 1: Boot — scan line sweeps top to bottom, frame counter climbs to 18
      .to(bootProgressRef, {
        current: 1.0,
        duration: 0.7,
        ease: "power2.inOut",
        onStart: () => setStage("BOOT"),
      })
      .to(frameCounterRef, {
        current: 18,
        duration: 0.7,
        ease: "power2.inOut",
        snap: { current: 1 },
      }, "<");

    // Sequence mechanical giant letter stamps with spring recoil
    lettersRef.current.forEach((letter, i) => {
      masterTl.to(letter, {
        y: canvas.height / 2,
        scale: 1.0,
        opacity: 1.0,
        duration: 0.44,
        ease: "elastic.out(1.15, 0.65)",
        onStart: () => {
          if (currentStageRef.current === "BOOT") {
            setStage("COALESCE");
          }
        },
        onComplete: () => {
          letter.stamped = true;
          // Spike ink pressure grain for this column
          noiseIntensityRef.current[i] = 1.0;
          // Animate the baseline rule sliding out after stamp
          gsap.to(letter, {
            ruleProgress: 1.0,
            duration: 0.28,
            ease: "power3.out",
          });
        }
      }, `+=0.04`);

      // Advance frame counter with each stamp
      masterTl.to(frameCounterRef, {
        current: 18 + Math.round(((i + 1) / 6) * 72),
        duration: 0.44,
        ease: "power2.out",
        snap: { current: 1 },
      }, "<");
    });

    // Fade out vertical column layout grid lines after the letter stamps complete
    const gridObj = { opacity: 1.0 };
    masterTl.to(gridObj, {
      opacity: 0.0,
      duration: 0.45,
      ease: "power2.inOut",
      onUpdate: () => {
        gridOpacityRef.current = gridObj.opacity;
      },
    })
    // Advance counter to 100 during the grid fade
    .to(frameCounterRef, {
      current: 100,
      duration: 0.45,
      ease: "power2.inOut",
      snap: { current: 1 },
    }, "<")
    // Stage 4: Layout Splitting Slide Reveal with heavy click mechanical tension build & snap release
    .to(revealProgressRef, {
      current: -0.012, // Pullback compression
      duration: 0.25,
      ease: "power2.out",
      onStart: () => {
        setStage("REVEAL");
      },
    }, "+=0.65")
      .to(revealProgressRef, {
        current: 1.0, // Heavy release slide
        duration: 1.35,
        ease: "power4.inOut",
          onComplete: () => {
          // Kill the render loop and clear the canvas immediately —
          // prevents ghost column lines from showing over the homepage
          cancelAnimationFrame(frame);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          onCompleteRef.current?.();
          setDone(true);
        },
      });

    let frame: number;
    let lastTime = performance.now();
    let revealStartedCalled = false;

    // Fast LCG pseudo-random number generator — seeded per column so grain
    // pattern is stable across frames (no flickering), only opacity changes.
    const lcg = (seed: number) => {
      let s = seed;
      return () => {
        s = (1664525 * s + 1013904223) & 0xffffffff;
        return (s >>> 0) / 0xffffffff;
      };
    };

    

    // Draws a beautiful 3D debossed drop shadow using unified alphabetic baseline alignment
    const drawDebossedShadow = (
      char: string,
      x: number,
      y: number,
      size: number,
      opacity: number
    ) => {
      ctx.save();
      ctx.globalAlpha = opacity * 0.12;
      ctx.fillStyle = "black";
      ctx.font = `900 ${size}px ${fontLoaderVal}, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      // Adjusting vertically by a scale-invariant ratio to perfectly center capital letters
      ctx.fillText(char, x + 1.6, y + 1.6 + size * 0.33);
      ctx.restore();
    };

    const render = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 16.6667, 2.5);
      lastTime = now;

      // Guard: once panels are fully gone, draw nothing
      if (revealProgressRef.current >= 1.0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const identityProgress = identityProgressRef.current;
      const revealProgress = revealProgressRef.current;
      const stageVal = currentStageRef.current;

      if (stageVal === "REVEAL" && revealProgress >= 0.22 && !revealStartedCalled) {
        revealStartedCalled = true;
        onRevealStartRef.current?.();
      }

      // 1. Draw solid, themed background paper surface as 6 separating vertical plates (Alternating reveal!)
      ctx.fillStyle = themeBackground;
      
      const colW = canvas.width / 6;

      for (let i = 0; i < 6; i++) {
        const colX = i * colW;
        let yOffset = 0;
        if (stageVal === "REVEAL") {
          yOffset = (i % 2 === 0) ? -canvas.height * revealProgress : canvas.height * revealProgress;
        }

        // Draw individual vertical shutter plate with 0.5px overlap to avoid subpixel lines
        ctx.fillRect(colX, 0 + yOffset, colW + 0.5, canvas.height);

        // ── Ink pressure grain texture ──────────────────────────────────
        // Decays each frame: impact spike (1.0) → resting grain (0.06)
        // LCG seeded by column index — stable pattern, only alpha changes
        const noiseArr = noiseIntensityRef.current;
        const decay = 0.055 * dt; // exponential decay rate
        noiseArr[i] = Math.max(0.06, noiseArr[i] - (noiseArr[i] - 0.06) * decay);
        const grainAlpha = noiseArr[i];

        if (grainAlpha > 0.07 && stageVal !== "REVEAL") {
          ctx.save();
          ctx.globalAlpha = grainAlpha * 0.22; // keep it subtle
          const rand = lcg(i * 7919 + Math.floor(canvas.height)); // stable seed
          const dotCount = Math.floor(colW * canvas.height * 0.0012); // density
          ctx.fillStyle = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
          for (let d = 0; d < dotCount; d++) {
            const gx = colX + rand() * colW;
            const gy = yOffset + rand() * canvas.height;
            const radius = rand() * 0.9 + 0.3;
            ctx.beginPath();
            ctx.arc(gx, gy, radius, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
        // ───────────────────────────────────────────────────────────────

        // Draw tactile cotton edge drop shadows as the vertical column shutter plates separate
        if (stageVal === "REVEAL" && revealProgress > 0.001) {
          ctx.save();
          if (i % 2 === 0) {
            // 1, 3, 5 sliding UP (cast shadow downwards onto revealed viewport)
            const bottomEdge = canvas.height + yOffset;
            const shadow = ctx.createLinearGradient(0, bottomEdge, 0, bottomEdge + 35);
            shadow.addColorStop(0, "rgba(0, 0, 0, 0.35)");
            shadow.addColorStop(1, "rgba(0, 0, 0, 0.0)");
            ctx.fillStyle = shadow;
            ctx.fillRect(colX, bottomEdge, colW + 0.5, 35);
          } else {
            // 2, 4, 6 sliding DOWN (cast shadow upwards onto revealed viewport)
            const topEdge = yOffset;
            const shadow = ctx.createLinearGradient(0, topEdge, 0, topEdge - 35);
            shadow.addColorStop(0, "rgba(0, 0, 0, 0.35)");
            shadow.addColorStop(1, "rgba(0, 0, 0, 0.0)");
            ctx.fillStyle = shadow;
            ctx.fillRect(colX, topEdge - 35, colW + 0.5, 35);
          }
          ctx.restore();
        }
      }
      const isMobile = canvas.width < 640 || (canvas.width < 1024 && canvas.height > canvas.width);
      const fontScale = isMobile ? 0.125 : 0.17;
      const fontSize = Math.min(canvas.width * fontScale, 210);

      // --- PROPORTIONAL SPLIT-SYMMETRICAL TYPOGRAPHY OFFSETS ---
      ctx.save();
      ctx.font = `900 ${fontSize}px ${fontLoaderVal}, sans-serif`;
      const letters = ["J", "A", "I", "N", "A", "M"];
      const letterWidths = letters.map(char => ctx.measureText(char).width);
      
      const tracking = -0.035;
      const trackingOffset = tracking * fontSize;
      const spacingVal = Math.max(2, -trackingOffset);
      const letterOffsets: number[] = [];

      letterOffsets[2] = -spacingVal / 2 - letterWidths[2] / 2;
      letterOffsets[1] = letterOffsets[2] - letterWidths[2] / 2 - letterWidths[1] / 2 + trackingOffset;
      letterOffsets[0] = letterOffsets[1] - letterWidths[1] / 2 - letterWidths[0] / 2 + trackingOffset;

      letterOffsets[3] = spacingVal / 2 + letterWidths[3] / 2;
      letterOffsets[4] = letterOffsets[3] + letterWidths[3] / 2 + letterWidths[4] / 2 + trackingOffset;
      letterOffsets[5] = letterOffsets[4] + letterWidths[4] / 2 + letterWidths[5] / 2 + trackingOffset;

      const absoluteLeft = letterOffsets[0] - letterWidths[0] / 2;
      const absoluteRight = letterOffsets[5] + letterWidths[5] / 2;
      ctx.restore();
      // ---------------------------------------------------------

      // 2. Draw clean, subtle vertical layout columns
      // Lines stay visible throughout letter display (BOOT/COALESCE) and fade
      // out in sync with the panel slide during REVEAL — independent of gridOpacityRef
      ctx.save();
      for (let i = 0; i < 6; i++) {
        const colX = i * colW;
        const colLineOpacity = stageVal === "REVEAL"
          ? 0.09 * Math.max(0, 1.0 - revealProgress)
          : 0.09;
        if (colLineOpacity <= 0) continue;
        ctx.strokeStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${colLineOpacity})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(colX, 0);
        ctx.lineTo(colX, canvas.height);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Draw faint, high-end corner blueprint drafting compass circles & page safe frame
      const draftingOpacity = stageVal === "REVEAL" ? (1.0 - revealProgress) * gridOpacityRef.current : gridOpacityRef.current;
      if (draftingOpacity > 0.01) {
        // Faint corner blueprint drafting compass circles
        ctx.save();
        ctx.strokeStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${draftingOpacity * 0.05})`;
        ctx.lineWidth = 0.5;

        const w = canvas.width;
        const h = canvas.height;
        const rad = 50;

        const drawCornerCircle = (cx: number, cy: number) => {
          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
          ctx.stroke();

          ctx.save();
          ctx.setLineDash([2, 4]);
          ctx.beginPath();
          ctx.arc(cx, cy, rad * 0.65, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          ctx.beginPath();
          ctx.moveTo(cx - 8, cy); ctx.lineTo(cx + 8, cy);
          ctx.moveTo(cx, cy - 8); ctx.lineTo(cx, cy + 8);
          ctx.stroke();
        };

        drawCornerCircle(40, 40);
        drawCornerCircle(w - 40, 40);
        drawCornerCircle(40, h - 40);
        drawCornerCircle(w - 40, h - 40);
        ctx.restore();

        // Faint page margins sheet outline (Minimal layout guides)
        ctx.save();
        ctx.strokeStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${draftingOpacity * 0.04})`;
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.moveTo(40, 40);
        ctx.lineTo(canvas.width / 2, 40);
        ctx.lineTo(canvas.width / 2, canvas.height - 40);
        ctx.lineTo(40, canvas.height - 40);
        ctx.lineTo(40, 40);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 40);
        ctx.lineTo(canvas.width - 40, 40);
        ctx.lineTo(canvas.width - 40, canvas.height - 40);
        ctx.lineTo(canvas.width / 2, canvas.height - 40);
        ctx.lineTo(canvas.width / 2, 40);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(40, 40);
        ctx.lineTo(canvas.width / 2, canvas.height / 2);
        ctx.lineTo(canvas.width / 2, canvas.height / 2);
        ctx.lineTo(canvas.width - 40, canvas.height - 40);
        ctx.stroke();
        ctx.restore();
      }



      // ── NEW B: Horizontal center registration crosshair line ───────────
      // A faint horizontal guide that frames the letters vertically —
      // appears alongside the letters and fades with the grid.
      if (stageVal === "COALESCE" || stageVal === "IDENTITY") {
        const anyStamped = lettersRef.current.some(l => l.stamped);
        if (anyStamped) {
          const crosshairOpacity = gridOpacityRef.current * 0.07;
          if (crosshairOpacity > 0.005) {
            const cy = canvas.height / 2;
            ctx.save();
            ctx.strokeStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${crosshairOpacity})`;
            ctx.lineWidth = 0.6;
            ctx.setLineDash([6, 8]);
            ctx.beginPath();
            ctx.moveTo(0, cy);
            ctx.lineTo(canvas.width, cy);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
          }
        }
      }
      // ─────────────────────────────────────────────────────────────────

      // 4. Giant Stamped Editorial Typography (COALESCE / IDENTITY / REVEAL stages)
      if (stageVal !== "BOOT") {
        ctx.save();

        lettersRef.current.forEach((letter, i) => {
          // Keep centered inside respective vertical column with alternating vertical split yOffset
          const colX = i * colW;
          const colCenterX = colX + colW / 2;
          const finalX = colCenterX;

          let yOffset = 0;
          if (stageVal === "REVEAL") {
            yOffset = (i % 2 === 0) ? -canvas.height * revealProgress : canvas.height * revealProgress;
          }
          const finalY = letter.y + yOffset;

          const letterOpacity = stageVal === "REVEAL" ? (1.0 - revealProgress) * letter.opacity : letter.opacity;
          const letterScalePullback = (stageVal === "REVEAL" && revealProgress < 0) ? (1.0 + revealProgress * 2.0) : 1.0;
          const currentFontSize = fontSize * letter.scale * letterScalePullback;
          
          if (letterOpacity > 0.01) {
            // A. Draw soft 3D bottom-right debossed drop shadow FIRST
            drawDebossedShadow(letter.char, finalX, finalY, currentFontSize, letterOpacity);

            // B. Draw letter with glow and core
            ctx.save();
            ctx.globalAlpha = letterOpacity;
            ctx.font = `900 ${currentFontSize}px ${fontLoaderVal}, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "alphabetic";

            // C. Tactile Letterpress Ink Bleed Emulsion Glow
            const glowOpacity = stageVal === "REVEAL" ? 0.12 * (1 - revealProgress) : 0.12 * letter.opacity;
            if (glowOpacity > 0.005) {
              ctx.save();
              ctx.shadowColor = themePrimary;
              ctx.shadowBlur = 12;
              ctx.fillStyle = themePrimary;
              ctx.globalAlpha = glowOpacity;
              ctx.fillText(letter.char, finalX, finalY + currentFontSize * 0.33);
              ctx.restore();
            }

            // D. Main letter core
            ctx.fillStyle = themePrimary;
            ctx.fillText(letter.char, finalX, finalY + currentFontSize * 0.33);
            ctx.restore();

            // ── NEW C: Animated baseline rule accent ──────────────────────
            // A thin red rule slides out from center to edges under each letter
            // once it lands — like a typographer's baseline registration mark.
            if (letter.stamped && letter.ruleProgress > 0.01 && stageVal !== "REVEAL") {
              const ruleY = finalY + currentFontSize * 0.38; // just below baseline
              const halfColW = colW * 0.38; // rule extends 38% of column width each side
              const ruleHalf = halfColW * letter.ruleProgress;
              const ruleOpacity = Math.min(letter.ruleProgress, 1.0) * letterOpacity * 0.55;

              ctx.save();
              ctx.strokeStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${ruleOpacity})`;
              ctx.lineWidth = 1.5;
              ctx.lineCap = "round";
              ctx.beginPath();
              ctx.moveTo(finalX - ruleHalf, ruleY);
              ctx.lineTo(finalX + ruleHalf, ruleY);
              ctx.stroke();
              ctx.restore();
            }
            // ─────────────────────────────────────────────────────────────
          }
        });
        ctx.restore();
      }

      // 5. Minimalist Editorial Crop Marks & Grayscale Print Target (IDENTITY / REVEAL)
      if (stageVal === "IDENTITY" || stageVal === "REVEAL") {
        const absoluteLeft = canvas.width / 2 + letterOffsets[0] - letterWidths[0] / 2;
        const absoluteRight = canvas.width / 2 + letterOffsets[5] + letterWidths[5] / 2;
        
        const leftBound = absoluteLeft - 18;
        const rightBound = absoluteRight + 18;
        const topBound = canvas.height / 2 - fontSize * 0.48;
        const bottomBound = canvas.height / 2 + fontSize * 0.48;

        const dimOpacity = stageVal === "REVEAL" ? 0.7 * (1 - revealProgress) : 0.7 * identityProgress;

        if (dimOpacity > 0.01) {
          ctx.save();
          ctx.strokeStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${dimOpacity * 0.28})`;
          ctx.lineWidth = 0.5;

          const drawCropMark = (cx: number, cy: number, dx: number, dy: number) => {
            ctx.beginPath();
            ctx.moveTo(cx + dx * 18, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + dy * 18);
            ctx.stroke();
          };
          drawCropMark(leftBound - 12, topBound - 12, 1, 1);
          drawCropMark(rightBound + 12, topBound - 12, -1, 1);
          drawCropMark(leftBound - 12, bottomBound + 12, 1, -1);
          drawCropMark(rightBound + 12, bottomBound + 12, -1, -1);
          ctx.restore();

        }
      }
      
      frame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
      masterTl.kill();
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col bg-transparent overflow-hidden"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
