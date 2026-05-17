"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { getTextPoints } from "@/lib/canvas-utils";

type Stage = "BOOT" | "COALESCE" | "IDENTITY" | "REVEAL";

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

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.originX = this.x;
    this.originY = this.y;
    this.targetX = this.x;
    this.targetY = this.y;
    this.vx = (Math.random() - 0.5) * 3;
    this.vy = (Math.random() - 0.5) * 3;
    this.size = Math.random() * 2.0 + 0.8; // Slightly smaller for crisper text
    this.color = "#D9281C"; // Vermilion
  }

  update(stage: Stage, laserY: number, mouseX: number, mouseY: number) {
    if (stage === "BOOT") {
      // Activate anything above the laser (plus a small buffer)
      // This prevents particles at the top from being skipped if the animation drops frames initially
      if (this.y < laserY + 100) { 
        this.active = true;
        this.alpha = 1; // Instant visibility
      }
      // Only move if active
      if (this.active) {
        this.x += this.vx * 0.5;
        this.y += this.vy * 0.5;
      }
    } else if (stage === "COALESCE") {
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const force = Math.max(0, (250 - dist) / 250);
      this.vx += (dx / dist) * force * 0.6;
      this.vy += (dy / dist) * force * 0.6;
      this.vx *= 0.94;
      this.vy *= 0.94;
      this.x += this.vx;
      this.y += this.vy;
    } else if (stage === "IDENTITY") {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      
      // Snap to target more precisely
      this.x += dx * 0.15;
      this.y += dy * 0.15;
      
      // Organic vibration
      this.x += (Math.random() - 0.5) * 0.6;
      this.y += (Math.random() - 0.5) * 0.6;
      
      this.alpha = 1;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.active) return;
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [stage, setStage] = useState<Stage>("BOOT");
  
  // Refs for simulation state to avoid re-renders
  const particlesRef = useRef<Particle[]>([]);
  const laserYRef = useRef(0);
  const irisSizeRef = useRef(0);
  const currentStageRef = useRef<Stage>("BOOT");

  // Sync state stage with ref for render loop
  useEffect(() => {
    currentStageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      // Use visualViewport if available for mobile address bar stability
      canvas.height = window.visualViewport ? window.visualViewport.height : document.documentElement.clientHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // Initialize particles across the full height
    const particles: Particle[] = [];
    const isDesktop = window.innerWidth > 768;
    const dynamicParticleCount = isDesktop ? 7000 : 3500; // Much denser on desktop
    for (let i = 0; i < dynamicParticleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }
    particlesRef.current = particles;

    // Wait for fonts to be ready before calculating text points
    const init = async () => {
      await new Promise(r => setTimeout(r, 200));
      await document.fonts.ready;
      
      const textPoints = getTextPoints(
        "JAINAM",
        Math.min(canvas.width * 0.22, 260), // Increased font size for better readability
        canvas.width,
        canvas.height,
        2
      );

      if (textPoints.length > 0) {
        particles.forEach((p, i) => {
          const pt = textPoints[i % textPoints.length];
          // Position relative to screen center
          p.targetX = (canvas.width / 2) + pt.x;
          p.targetY = (canvas.height / 2) + pt.y;
        });
      }
    };

    init();

    const masterTl = gsap.timeline({
      onUpdate: () => setProgress(Math.round(masterTl.progress() * 100)),
      onComplete: () => {
        setTimeout(() => setDone(true), 100);
        setTimeout(onComplete, 800);
      },
    });

    // --- GSAP TIMELINE DEFINITION ---
    masterTl
      .to(laserYRef, {
        current: canvas.height,
        duration: 1.0,
        ease: "power2.inOut",
        onStart: () => setStage("BOOT"),
      })
      .to({}, { 
        duration: 1.2,
        onStart: () => setStage("COALESCE"),
      })
      .to({}, {
        duration: 1.2, // Slightly longer to allow settle
        onStart: () => setStage("IDENTITY"),
      })
      .to(irisSizeRef, {
        current: Math.max(canvas.width, canvas.height) * 1.5,
        duration: 0.8,
        ease: "expo.in",
        onStart: () => setStage("REVEAL"),
      });

    let frame: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (currentStageRef.current === "REVEAL") {
        ctx.save();
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, irisSizeRef.current, 0, Math.PI * 2);
        ctx.clip();
      }

      // Draw background grid (faint)
      ctx.strokeStyle = "rgba(217, 40, 28, 0.04)";
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

      // Update and draw particles
      particlesRef.current.forEach((p) => {
        p.update(currentStageRef.current, laserYRef.current, canvas.width / 2, canvas.height / 2);
        p.draw(ctx);
      });

      // Draw Laser
      if (currentStageRef.current === "BOOT" || currentStageRef.current === "COALESCE") {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(217, 40, 28, 0.6)";
        ctx.lineWidth = 2;
        ctx.moveTo(0, laserYRef.current);
        ctx.lineTo(canvas.width, laserYRef.current);
        ctx.stroke();
        
        // Laser glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#D9281C";
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      if (currentStageRef.current === "REVEAL") {
        ctx.restore();
        
        // Draw the bloom burst
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, irisSizeRef.current * 0.8,
          canvas.width / 2, canvas.height / 2, irisSizeRef.current
        );
        gradient.addColorStop(0, "rgba(217, 40, 28, 0)");
        gradient.addColorStop(0.5, "rgba(217, 40, 28, 0.4)");
        gradient.addColorStop(1, "white");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, irisSizeRef.current, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, irisSizeRef.current, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      frame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
      masterTl.kill();
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 z-[9999] flex flex-col bg-background overflow-hidden"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
          />

          {/* Diagnostic UI Overlays */}
          <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between p-8">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary font-bold">System Boot Sequence</span>
                <span className="font-mono text-[10px] text-muted-foreground/60">Build: 2026.05.14.v1</span>
              </div>
              <div className="font-display font-black text-7xl text-primary/20 select-none">
                {progress}%
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div className="max-w-xs">
                <div className="h-1.5 w-64 bg-white/10 overflow-hidden rounded-full mb-3">
                  <motion.div 
                    className="h-full bg-primary shadow-[0_0_10px_rgba(217,40,28,0.8)]"
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-primary/60 font-bold">
                  {stage === "BOOT" && "Initializing Core Systems..."}
                  {stage === "COALESCE" && "Processing Neural Data..."}
                  {stage === "IDENTITY" && "Resolving Identity Matrix..."}
                  {stage === "REVEAL" && "Access Granted."}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/40">
                  Secure Connection Established<br />
                  Encryption: AES-256-GCM
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
