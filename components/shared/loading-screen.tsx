"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { getTextPoints } from "@/lib/canvas-utils";

type Stage = "BOOT" | "COALESCE" | "IDENTITY" | "REVEAL";

// A utility helper to parse dynamic hex and rgb strings returned by computed styles
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
  
  // Default Vermilion red fallback
  return { r: 217, g: 40, b: 28 };
}

class Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  active: boolean = false;
  alpha: number = 0;

  // Cinematic 3D Warp Properties
  angle: number;
  speedFactor: number;
  prevX: number = 0;
  prevY: number = 0;

  constructor(canvasWidth: number, canvasHeight: number, themePrimary: string = "#D9281C") {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.originX = this.x;
    this.originY = this.y;
    this.targetX = this.x;
    this.targetY = this.y;
    this.vx = (Math.random() - 0.5) * 3;
    this.vy = (Math.random() - 0.5) * 3;
    this.size = Math.random() * 2.0 + 0.8; // Crisp lettering
    this.color = themePrimary; // Dynamic theme vermilion/accent

    this.angle = Math.random() * Math.PI * 2;
    this.speedFactor = 0.4 + Math.random() * 1.6;
  }

  update(
    stage: Stage,
    laserY: number,
    mouseX: number,
    mouseY: number,
    canvasWidth: number,
    progress: number,
    dt: number
  ) {
    if (stage === "BOOT") {
      // Activate anything above the laser (plus a small buffer)
      if (this.y < laserY + 100) { 
        this.active = true;
        this.alpha = 1;
      }
      if (this.active) {
        this.x += this.vx * 0.5 * dt;
        this.y += this.vy * 0.5 * dt;
      }
    } else if (stage === "COALESCE") {
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const force = Math.max(0, (250 - dist) / 250);
      
      // Accumulate velocity scaled by dt
      this.vx += (dx / dist) * force * 0.6 * dt;
      this.vy += (dy / dist) * force * 0.6 * dt;
      
      // Frame independent friction using exponentiation
      const friction = Math.pow(0.94, dt);
      this.vx *= friction;
      this.vy *= friction;
      
      this.x += this.vx * dt;
      this.y += this.vy * dt;
    } else if (stage === "IDENTITY") {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      
      // Frame rate independent snapping snap
      this.x += dx * (1 - Math.pow(1 - 0.15, dt));
      this.y += dy * (1 - Math.pow(1 - 0.15, dt));
      
      // Organic vibration scaled by dt
      this.x += (Math.random() - 0.5) * 0.6 * dt;
      this.y += (Math.random() - 0.5) * 0.6 * dt;
      
      this.alpha = 1;
    } else if (stage === "REVEAL") {
      const centerX = canvasWidth / 2;
      const centerY = mouseY; // Passed in as canvasHeight / 2
      
      // Store current coords for drawing velocity streaks
      this.prevX = this.x;
      this.prevY = this.y;

      if (progress < 0.22) {
        // --- 1. Implosion Phase ---
        const t = progress / 0.22;
        const ease = t * t * t; // Cubic ease-in for dramatic acceleration
        
        this.x = this.targetX + (centerX - this.targetX) * ease;
        this.y = this.targetY + (centerY - this.targetY) * ease;
        this.alpha = Math.max(0, 1 - ease * 0.3); // Slightly fade as they pack tight
      } else {
        // --- 2. Explosion / 3D Warp Phase ---
        const warpT = (progress - 0.22) / 0.78;
        
        // Unit direction vector originating from center
        const dx = this.targetX - centerX;
        const dy = this.targetY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const dirX = dx / dist;
        const dirY = dy / dist;

        // Depth z: flies toward the screen along the Z-axis (focalLength = 300)
        const z = warpT * 295 * this.speedFactor;
        const scale = 300 / (300 - Math.min(z, 299));
        
        // Base radial displacement distance
        const expDist = warpT * 420 * this.speedFactor;
        
        this.x = centerX + dirX * (dist * 0.05 + expDist) * scale;
        this.y = centerY + dirY * (dist * 0.05 + expDist) * scale;
        
        // Fade out as they fly past the camera boundaries (Z > 250)
        if (z > 250) {
          this.alpha = Math.max(0, 1 - (z - 250) / 45);
        } else {
          this.alpha = 1;
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, stage: Stage, progress: number) {
    if (!this.active) return;
    ctx.globalAlpha = this.alpha;
    
    if (stage === "REVEAL") {
      if (progress < 0.22) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
      } else {
        // Render 3D speed trail streaks
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size * 0.8;
        ctx.beginPath();
        ctx.moveTo(this.prevX, this.prevY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.size, this.size);
    }
  }
}

interface DissolveBlock {
  x: number;
  y: number;
  w: number;
  h: number;
  delay: number;
  scrollingHex: string;
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
  
  // Refs for simulation state to avoid React re-renders
  const particlesRef = useRef<Particle[]>([]);
  const laserYRef = useRef(0);
  const revealProgressRef = useRef(0);
  const currentStageRef = useRef<Stage>("BOOT");

  // Grid block dissolve references
  const blocksRef = useRef<DissolveBlock[]>([]);

  const onRevealStartRef = useRef(onRevealStart);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onRevealStartRef.current = onRevealStart;
  }, [onRevealStart]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Sync state stage with ref for render loop
  useEffect(() => {
    currentStageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fetch theme colors dynamically from the DOM layout context
    const computedStyle = window.getComputedStyle(document.documentElement);
    const themePrimary = computedStyle.getPropertyValue('--primary').trim() || "#D9281C";
    const themeBackground = computedStyle.getPropertyValue('--background').trim() || "#030303";

    const primaryRgb = parseColor(themePrimary);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.visualViewport ? window.visualViewport.height : document.documentElement.clientHeight;

      // Denser grid matrix dissolve (60px desktop, 50px mobile) for technical precision
      const isDesktop = window.innerWidth > 768;
      const blockSize = isDesktop ? 60 : 50;
      const cols = Math.ceil(canvas.width / blockSize);
      const rows = Math.ceil(canvas.height / blockSize);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxDist = Math.sqrt(centerX * centerX + centerY * centerY) || 1;

      const blocks: DissolveBlock[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = c * blockSize;
          const by = r * blockSize;
          const bw = Math.min(blockSize, canvas.width - bx);
          const bh = Math.min(blockSize, canvas.height - by);

          const bCenterX = bx + bw / 2;
          const bCenterY = by + bh / 2;
          const dx = bCenterX - centerX;
          const dy = bCenterY - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Staggered radial center-outward delay pattern
          const baseDelay = (dist / maxDist) * 0.65;
          const delay = Math.min(0.75, Math.max(0, baseDelay + (Math.random() - 0.5) * 0.08));

          blocks.push({
            x: bx,
            y: by,
            w: bw,
            h: bh,
            delay: delay,
            scrollingHex: Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0')
          });
        }
      }
      blocksRef.current = blocks;
    };
    window.addEventListener("resize", resize);
    resize();

    // Initialize particle grid density with dynamic theme primary color
    const particles: Particle[] = [];
    const isDesktop = window.innerWidth > 768;
    const dynamicParticleCount = isDesktop ? 7000 : 3500;
    for (let i = 0; i < dynamicParticleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height, themePrimary));
    }
    particlesRef.current = particles;

    // Load fonts and process centered text coordinates
    const init = async () => {
      await new Promise(r => setTimeout(r, 200));
      await document.fonts.ready;
      
      const textPoints = getTextPoints(
        "JAINAM",
        Math.min(canvas.width * 0.22, 260),
        canvas.width,
        canvas.height,
        2
      );

      if (textPoints.length > 0) {
        particles.forEach((p, i) => {
          const pt = textPoints[i % textPoints.length];
          p.targetX = (canvas.width / 2) + pt.x;
          p.targetY = (canvas.height / 2) + pt.y;
        });
      }
    };

    init();

    // Cinematic GSAP Sequencing
    const masterTl = gsap.timeline({
      onComplete: () => {
        onCompleteRef.current?.();
        setDone(true);
      },
    });

    masterTl
      .to(laserYRef, {
        current: canvas.height,
        duration: 0.6,
        ease: "power2.inOut",
        onStart: () => setStage("BOOT"),
      })
      .to({}, { 
        duration: 0.7,
        onStart: () => setStage("COALESCE"),
      })
      .to({}, {
        duration: 0.6,
        onStart: () => setStage("IDENTITY"),
      })
      .to(revealProgressRef, {
        current: 1.0,
        duration: 2.0, // Extended transition reveal (2.0s instead of 1.0s) for epic effect
        ease: "power3.inOut",
        onStart: () => {
          setStage("REVEAL");
        },
      });

    let frame: number;
    let lastTime = performance.now();
    let revealStartedCalled = false;

    const render = () => {
      const now = performance.now();
      // Calculate delta relative to standard 60FPS target
      const dt = Math.min((now - lastTime) / 16.6667, 2.5);
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const progress = revealProgressRef.current;
      const stageVal = currentStageRef.current;

      if (stageVal === "REVEAL" && progress >= 0.22 && !revealStartedCalled) {
        revealStartedCalled = true;
        onRevealStartRef.current?.();
      }

      // 1. Draw solid, themed cover overlay (Warm Ivory in light mode, Black in dark mode)
      ctx.fillStyle = themeBackground;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Wipe dissolved blocks dynamically using destination-out
      if (stageVal === "REVEAL") {
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        blocksRef.current.forEach((block) => {
          if (progress >= block.delay) {
            ctx.fillRect(block.x, block.y, block.w, block.h);
          }
        });
        ctx.restore();
      }

      // 3. Draw faint technical background drafting grids (fades out dynamically in REVEAL)
      const gridOpacity = stageVal === "REVEAL" ? 0.04 * (1 - progress) : 0.04;
      if (gridOpacity > 0) {
        ctx.save();
        // Blends active theme primary color beautifully
        ctx.strokeStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${gridOpacity})`;
        ctx.lineWidth = 1;
        const step = 40;

        for (let x = 0; x < canvas.width; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }

        for (let y = 0; y < canvas.height; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 4. Update and render particles on top (physics updated frame-independently with dt)
      particlesRef.current.forEach((p) => {
        p.update(
          stageVal, 
          laserYRef.current, 
          canvas.width / 2, 
          canvas.height / 2, 
          canvas.width, 
          progress,
          dt
        );
        p.draw(ctx, stageVal, progress);
      });

      // 5. Draw glowing laser line for Boot/Coalesce stages
      if (stageVal === "BOOT" || stageVal === "COALESCE") {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.6)`;
        ctx.lineWidth = 2;
        ctx.moveTo(0, laserYRef.current);
        ctx.lineTo(canvas.width, laserYRef.current);
        ctx.stroke();
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = themePrimary;
        ctx.stroke();
        ctx.restore();
      }

      // 6. Draw active block borders and scrolling hex matrix codes
      if (stageVal === "REVEAL") {
        blocksRef.current.forEach((block) => {
          if (progress >= block.delay - 0.1 && progress < block.delay) {
            const localT = (progress - (block.delay - 0.1)) / 0.1;
            const borderCollapse = 1 - localT;

            // Shrinking border coordinate outline
            ctx.save();
            ctx.strokeStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${0.45 * borderCollapse})`;
            ctx.lineWidth = 1;
            const bW = block.w * borderCollapse;
            const bH = block.h * borderCollapse;
            const bX = block.x + (block.w - bW) / 2;
            const bY = block.y + (block.h - bH) / 2;
            ctx.strokeRect(bX, bY, bW, bH);
            ctx.restore();

            // Scrolling coordinate hexadecimal logs (stochastic scale by dt)
            if (Math.random() < 0.15 * dt) {
              block.scrollingHex = Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0');
            }
            ctx.save();
            ctx.fillStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${0.7 * borderCollapse})`;
            ctx.font = "8px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`0x${block.scrollingHex}`, block.x + block.w / 2, block.y + block.h / 2);
            ctx.restore();
          }
        });

        // 7. Draw Concentric mechanical CAD HUD aperture scale & rotation
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        const hudScale = 1.0 + progress * 4.0;
        const baseRadius = 120 * hudScale;
        const hudAlpha = Math.max(0, 1 - progress * 1.15);

        if (hudAlpha > 0) {
          ctx.save();
          ctx.globalAlpha = hudAlpha;

          // Crosshairs
          ctx.strokeStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.4)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(centerX - baseRadius * 1.2, centerY);
          ctx.lineTo(centerX + baseRadius * 1.2, centerY);
          ctx.moveTo(centerX, centerY - baseRadius * 1.2);
          ctx.lineTo(centerX, centerY + baseRadius * 1.2);
          ctx.stroke();

          // Gauge outline
          ctx.beginPath();
          ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Rotating ticks & degree labels
          const tickCount = 72;
          const angleOffset = progress * Math.PI * 0.4;
          ctx.beginPath();
          for (let i = 0; i < tickCount; i++) {
            const angle = (i / tickCount) * Math.PI * 2 + angleOffset;
            const isMajor = i % 9 === 0;
            const tLen = isMajor ? 12 : 5;

            const startX = centerX + Math.cos(angle) * baseRadius;
            const startY = centerY + Math.sin(angle) * baseRadius;
            const endX = centerX + Math.cos(angle) * (baseRadius + tLen);
            const endY = centerY + Math.sin(angle) * (baseRadius + tLen);

            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);

            if (isMajor && progress < 0.65) {
              ctx.save();
              ctx.fillStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.6)`;
              ctx.font = "8px monospace";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              const labelX = centerX + Math.cos(angle) * (baseRadius + 22);
              const labelY = centerY + Math.sin(angle) * (baseRadius + 22);
              ctx.fillText(`${i * 5}°`, labelX, labelY);
              ctx.restore();
            }
          }
          ctx.stroke();

          // Inner dashed counter-rotating circle
          ctx.save();
          ctx.setLineDash([8, 12]);
          const innerRadius = baseRadius * 0.75;
          ctx.strokeStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.35)`;
          ctx.beginPath();
          ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // Outer rotating hexagon
          ctx.save();
          const hexRadius = baseRadius * 1.5;
          const hexAngleOffset = -progress * Math.PI * 0.2;
          ctx.strokeStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.15)`;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 + hexAngleOffset;
            const hX = centerX + Math.cos(angle) * hexRadius;
            const hY = centerY + Math.sin(angle) * hexRadius;
            if (i === 0) ctx.moveTo(hX, hY);
            else ctx.lineTo(hX, hY);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.restore();

          // Orbiting monospace physics formulas
          const formulas = [
            "ψ(x,t) = Ae^(i(kx-ωt))",
            "lim(x→0) sin(x)/x = 1",
            "E = mc² (QUANTUM_G)",
            "∇ × B = μ₀J + μ₀ε₀(∂E/∂t)",
            "f(x) = ∫ g(t)e^(-iωt)dt",
            "G_μν + Λg_μν = 8πG/c⁴ T_μν"
          ];
          ctx.save();
          ctx.fillStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.4)`;
          ctx.font = "8px monospace";
          formulas.forEach((formula, idx) => {
            const formulaAngle = (idx / formulas.length) * Math.PI * 2 + progress * Math.PI * 0.15;
            const fRadius = hexRadius * 1.1;
            const fX = centerX + Math.cos(formulaAngle) * fRadius;
            const fY = centerY + Math.sin(formulaAngle) * fRadius;

            ctx.save();
            ctx.translate(fX, fY);
            ctx.rotate(formulaAngle + Math.PI / 2);
            ctx.textAlign = "center";
            ctx.fillText(formula, 0, 0);
            ctx.restore();
          });
          ctx.restore();

          ctx.restore();
        }


        // 9. Stochastic screen slices (chromatic glitching) - scaled by dt
        if (Math.random() < 0.12 * dt && progress < 0.9) {
          ctx.save();
          const glitchY = Math.random() * canvas.height;
          const glitchHeight = Math.random() * 6 + 1;
          const glitchOffset = (Math.random() - 0.5) * 35;

          ctx.drawImage(
            canvas, 
            0, glitchY, canvas.width, glitchHeight, 
            glitchOffset, glitchY, canvas.width, glitchHeight
          );

          ctx.fillStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.15)`;
          ctx.fillRect(0, glitchY, canvas.width, glitchHeight);
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
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
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
