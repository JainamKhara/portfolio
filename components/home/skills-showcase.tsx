"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { skills, SkillCategory } from "@/data/skills";
import { TechIcon } from "@/components/tech-icon";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { gsap, useGSAP } from "@/lib/gsap";
import { DecoderText } from "@/components/decoder-text";
import { RevealLine } from "@/components/reveal-line";

const CATEGORIES = Object.keys(skills) as SkillCategory[];

// 3D Morphic WebGL Particle Orb Component
function MorphicOrb({ activeCategory }: { activeCategory: SkillCategory }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 2400;

  // Dynamically generate a smooth, circular anti-aliased dot texture
  const [dotTexture] = useState(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.2, "rgba(255, 255, 255, 0.95)");
    grad.addColorStop(0.55, "rgba(255, 255, 255, 0.2)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  });

  // We store the current positions, target positions, and velocities
  const [geometry] = useState(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Initial random star-cloud position
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;

      // Color: shades of primary Vermilion (#D9281C) mixed with white/grey
      const mix = Math.random();
      if (mix > 0.45) {
        colors[i * 3] = 217 / 255;     // Red (D9)
        colors[i * 3 + 1] = 40 / 255;   // Green (28)
        colors[i * 3 + 2] = 28 / 255;   // Blue (1C)
      } else {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;
      }
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  });

  // Calculate target positions based on activeCategory
  const getTargetPositions = (category: SkillCategory) => {
    const temp = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const u = Math.random();
      const v = Math.random();

      if (category === "Languages") {
        // Shape 1: Foundational Coding Atom (Massive core with 3 planetary rings)
        const R_core = 0.28 + (Math.random() - 0.5) * 0.03;
        if (i % 4 === 0) {
          // Central glowing atomic nucleus
          const theta = Math.acos(2 * u - 1);
          const phi = v * 2 * Math.PI;
          temp[idx] = R_core * Math.sin(theta) * Math.cos(phi);
          temp[idx + 1] = R_core * Math.sin(theta) * Math.sin(phi);
          temp[idx + 2] = R_core * Math.cos(theta);
        } else if (i % 4 === 1) {
          // Planetary Ring A (tilted on x/z plane)
          const theta = u * 2 * Math.PI;
          const R = 0.72 + (Math.random() - 0.5) * 0.015;
          temp[idx] = R * Math.cos(theta);
          temp[idx + 1] = R * Math.sin(theta) * 0.35;
          temp[idx + 2] = R * Math.sin(theta) * 0.92;
        } else if (i % 4 === 2) {
          // Planetary Ring B (opposing tilt on y/z plane)
          const theta = u * 2 * Math.PI;
          const R = 0.72 + (Math.random() - 0.5) * 0.015;
          temp[idx] = R * Math.cos(theta) * 0.35;
          temp[idx + 1] = R * Math.sin(theta);
          temp[idx + 2] = R * Math.cos(theta) * 0.92;
        } else {
          // Planetary Ring C (tilted on x/y plane)
          const theta = u * 2 * Math.PI;
          const R = 0.72 + (Math.random() - 0.5) * 0.015;
          temp[idx] = R * Math.cos(theta) * 0.92;
          temp[idx + 1] = R * Math.sin(theta) * 0.92;
          temp[idx + 2] = R * Math.cos(theta) * 0.35;
        }
      } else if (category === "Frameworks/Libraries") {
        // Shape 2: Advanced 3D Scaffolding Tesseract (Nested Wireframe Cube Outline)
        const size_out = 0.65;
        const size_in = 0.30;
        const choice = i % 10;
        
        if (choice < 4) {
          // Outer Cube Edges (12 edges)
          const edge = i % 12;
          const t = Math.random() * 2 - 1; // Interpolate edge coordinate
          const edgeCoords = [
            [t, 1, 1], [t, -1, 1], [t, 1, -1], [t, -1, -1], // parallel to x
            [1, t, 1], [-1, t, 1], [1, t, -1], [-1, t, -1], // parallel to y
            [1, 1, t], [-1, 1, t], [1, -1, t], [-1, -1, t]  // parallel to z
          ];
          const coord = edgeCoords[edge];
          const jitter = 0.012;
          temp[idx] = coord[0] * size_out + (Math.random() - 0.5) * jitter;
          temp[idx + 1] = coord[1] * size_out + (Math.random() - 0.5) * jitter;
          temp[idx + 2] = coord[2] * size_out + (Math.random() - 0.5) * jitter;
        } else if (choice < 7) {
          // Inner Cube Edges (12 edges)
          const edge = i % 12;
          const t = Math.random() * 2 - 1;
          const edgeCoords = [
            [t, 1, 1], [t, -1, 1], [t, 1, -1], [t, -1, -1],
            [1, t, 1], [-1, t, 1], [1, t, -1], [-1, t, -1],
            [1, 1, t], [-1, 1, t], [1, -1, t], [-1, -1, t]
          ];
          const coord = edgeCoords[edge];
          const jitter = 0.01;
          temp[idx] = coord[0] * size_in + (Math.random() - 0.5) * jitter;
          temp[idx + 1] = coord[1] * size_in + (Math.random() - 0.5) * jitter;
          temp[idx + 2] = coord[2] * size_in + (Math.random() - 0.5) * jitter;
        } else {
          // 8 Support Rails linking corresponding inner & outer corners
          const corner = i % 8;
          const t = Math.random(); // interpolate between inner & outer corners
          const cx = (corner & 1) ? 1 : -1;
          const cy = (corner & 2) ? 1 : -1;
          const cz = (corner & 4) ? 1 : -1;
          const jitter = 0.01;
          temp[idx] = (cx * size_in + (cx * size_out - cx * size_in) * t) + (Math.random() - 0.5) * jitter;
          temp[idx + 1] = (cy * size_in + (cy * size_out - cy * size_in) * t) + (Math.random() - 0.5) * jitter;
          temp[idx + 2] = (cz * size_in + (cz * size_out - cz * size_in) * t) + (Math.random() - 0.5) * jitter;
        }
      } else if (category === "Concepts") {
        // Shape 3: Connected Synaptic Hub Network (Interconnected Large Hub System)
        const hubs = [
          { x: -0.54, y: -0.32, z: -0.16 },
          { x: 0.54, y: -0.32, z: -0.16 },
          { x: 0.0, y: 0.48, z: 0.28 }
        ];
        
        const choice = i % 5;
        if (choice < 3) {
          // Massive clustered hub spheres
          const hub = hubs[choice];
          const r = 0.12 + Math.random() * 0.10;
          const theta = Math.acos(2 * Math.random() - 1);
          const phi = Math.random() * 2 * Math.PI;
          temp[idx] = hub.x + r * Math.sin(theta) * Math.cos(phi);
          temp[idx + 1] = hub.y + r * Math.sin(theta) * Math.sin(phi);
          temp[idx + 2] = hub.z + r * Math.cos(theta);
        } else {
          // Beautiful thick double connecting bridges
          const hubA = hubs[i % 3];
          const hubB = hubs[(i + 1) % 3];
          const lerp = Math.random();
          const isOffset = i % 2 === 0;
          const offset = isOffset ? 0.045 : -0.045;
          const jitter = 0.018;
          temp[idx] = hubA.x + (hubB.x - hubA.x) * lerp + (Math.random() - 0.5) * jitter;
          temp[idx + 1] = hubA.y + (hubB.y - hubA.y) * lerp + offset + (Math.random() - 0.5) * jitter;
          temp[idx + 2] = hubA.z + (hubB.z - hubA.z) * lerp + offset + (Math.random() - 0.5) * jitter;
        }
      } else if (category === "Cloud/DevOps") {
        // Shape 4: CI/CD Pipeline Gateway (Futuristic Cascading Ring Funnel)
        const ringIdx = i % 5; // 5 parallel concentric layers
        const t = (ringIdx - 2.0) * 0.28; // stack height
        const theta = u * 2 * Math.PI;
        // Radii cascade outwards forming a massive technical cooling pipe/funnel stack
        const R = (0.28 + ringIdx * 0.096) + (Math.random() - 0.5) * 0.018;
        temp[idx] = R * Math.cos(theta);
        temp[idx + 1] = t;
        temp[idx + 2] = R * Math.sin(theta);
      } else {
        // Shape 5: AI / ML: Dense Multi-Layer Perceptron Deep Neural Network (Synapse Web)
        const layerX = [-0.64, -0.21, 0.21, 0.64];
        const layerNodes = [
          [-0.39, 0, 0.39],             // Layer 0 (Input nodes)
          [-0.48, -0.16, 0.16, 0.48],   // Layer 1 (Hidden nodes A)
          [-0.48, -0.16, 0.16, 0.48],   // Layer 2 (Hidden nodes B)
          [-0.26, 0.26]                 // Layer 3 (Output nodes)
        ];

        const choice = i % 10;
        if (choice < 4) {
          // Core node cluster spheres
          const layerIdx = i % 4;
          const nodeIdx = i % layerNodes[layerIdx].length;
          const nx = layerX[layerIdx];
          const ny = layerNodes[layerIdx][nodeIdx];
          const nz = (i % 2 === 0 ? 0.026 : -0.026);
          
          const r = 0.06 + Math.random() * 0.045;
          const theta = Math.acos(2 * Math.random() - 1);
          const phi = Math.random() * 2 * Math.PI;
          
          temp[idx] = nx + r * Math.sin(theta) * Math.cos(phi);
          temp[idx + 1] = ny + r * Math.sin(theta) * Math.sin(phi);
          temp[idx + 2] = nz + r * Math.cos(theta);
        } else {
          // Connecting synaptical web wires
          const layerIdx = i % 3;
          const nextLayerIdx = layerIdx + 1;
          
          const nodeIdxA = i % layerNodes[layerIdx].length;
          const nodeIdxB = (i + 7) % layerNodes[nextLayerIdx].length;
          
          const ax = layerX[layerIdx];
          const ay = layerNodes[layerIdx][nodeIdxA];
          const az = (i % 2 === 0 ? 0.022 : -0.022);
 
          const bx = layerX[nextLayerIdx];
          const by = layerNodes[nextLayerIdx][nodeIdxB];
          const bz = (i % 3 === 0 ? 0.022 : -0.022);
 
          const t = Math.random();
          const jitter = 0.012; // Tight laser wire links
          
          temp[idx] = ax + (bx - ax) * t + (Math.random() - 0.5) * jitter;
          temp[idx + 1] = ay + (by - ay) * t + (Math.random() - 0.5) * jitter;
          temp[idx + 2] = az + (bz - az) * t + (Math.random() - 0.5) * jitter;
        }
      }
    }
    return temp;
  };

  const targetPositionsRef = useRef<Float32Array | null>(null);
  
  // Track system theme dynamically to update particle colors for light mode readability
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  // Update particle colors dynamically when theme switches (Instant visual contrast!)
  useEffect(() => {
    if (!geometry) return;
    const colorsAttr = geometry.getAttribute("color") as THREE.BufferAttribute;
    if (!colorsAttr) return;

    const colors = colorsAttr.array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      // Re-evaluate matching deterministic seed index mix
      const mix = ((i * 17) + 29) % 100 / 100;
      if (mix > 0.45) {
        // Primary Vermilion red (#D9281C)
        colors[i * 3] = 217 / 255;
        colors[i * 3 + 1] = 40 / 255;
        colors[i * 3 + 2] = 28 / 255;
      } else {
        if (isDark) {
          // Bright white in dark mode
          colors[i * 3] = 1.0;
          colors[i * 3 + 1] = 1.0;
          colors[i * 3 + 2] = 1.0;
        } else {
          // Deep Charcoal Black in light mode for supreme visual contrast
          colors[i * 3] = 22 / 255;
          colors[i * 3 + 1] = 22 / 255;
          colors[i * 3 + 2] = 22 / 255;
        }
      }
    }
    colorsAttr.needsUpdate = true;
  }, [isDark, geometry]);

  // Track mouse coordinates for subtle parallax tilt
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    targetPositionsRef.current = getTargetPositions(activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current || !targetPositionsRef.current) return;

    const points = pointsRef.current;
    const geoPositions = points.geometry.attributes.position.array as Float32Array;
    const targets = targetPositionsRef.current;
    const time = state.clock.getElapsedTime();

    // Fast particle interpolation (frame-rate independent & clamped to prevent stutters/glitches)
    const lerpFactor = Math.min(0.075 * (delta * 60), 0.15);
    for (let i = 0; i < geoPositions.length; i++) {
      const idx = Math.floor(i / 3);
      // Breathing ripple sinusoidal noise wave
      const wave = Math.sin(time * 1.6 + idx * 0.04) * 0.0022;
      geoPositions[i] += (targets[i] + wave - geoPositions[i]) * lerpFactor;
    }
    points.geometry.attributes.position.needsUpdate = true;

    // Continuous slow orbit rotation
    points.rotation.y += delta * 0.14;
    points.rotation.x += delta * 0.04;

    // Smooth restricted mouse parallax tilt (prevents clipping edges)
    const targetRotX = mouseRef.current.y * 0.22;
    const targetRotY = mouseRef.current.x * 0.22;
    points.rotation.x += (targetRotX - points.rotation.x) * 0.06;
    points.rotation.y += (targetRotY - points.rotation.y) * 0.06;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.052}
        vertexColors
        transparent
        opacity={isDark ? 0.94 : 0.82}
        sizeAttenuation
        depthWrite={false}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        map={dotTexture || undefined}
      />
    </points>
  );
}

export function SkillsShowcase() {
  const [active, setActive] = useState<SkillCategory>(CATEGORIES[0]);
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [mounted, setMounted] = useState(false);

  const renderSplitHeading = (text: string) => {
    return text.split(" ").map((word, wIdx) => (
      <span key={wIdx} className="inline-block overflow-hidden relative pb-2 mr-3 last:mr-0 group/word">
        {word.split("").map((char, cIdx) => (
          <span key={cIdx} className="char-letter inline-block translate-y-[110%] select-none">
            {char}
          </span>
        ))}
        <div className="sweep-line absolute bottom-0 left-0 h-[2.5px] bg-primary w-0" />
      </span>
    ));
  };

  /* GSAP: section header kinetic reveal & sweep */
  useGSAP(() => {
    const section = ref.current;
    if (!section) return;

    const chars = section.querySelectorAll(".char-letter");
    const sweeps = section.querySelectorAll(".sweep-line");
    const label = section.querySelector(".section-label");

    if (chars.length > 0) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        }
      });

      tl.to(chars, {
        y: "0%",
        duration: 0.55,
        stagger: 0.02,
        ease: "power3.out",
      });

      tl.to(sweeps, {
        width: "100%",
        duration: 0.45,
        ease: "power2.inOut",
      }, "-=0.25");
    }

    if (label) {
      gsap.fromTo(label,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
          }
        }
      );

      // Scroll Parallax on label
      gsap.to(label, {
        yPercent: 16,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });
    }
  }, { scope: ref });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-12 md:py-16 px-6 md:px-12 lg:px-20 bg-card overflow-hidden relative">
      <div ref={ref} className="max-w-7xl mx-auto">
        {/* Animated Blueprint divider reveal lines */}
        <RevealLine className="mb-16" />

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-16 lg:items-start">
          
          {/* Left panel: Info & Logo-First Bento Grid */}
          <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div>
                <p className="section-label mb-3 opacity-0 font-mono text-[11px] uppercase tracking-widest text-primary/70 font-semibold">
                  <DecoderText text="CAPABILITIES" delay={0.2} />
                </p>
                <h2
                  className="font-display font-black text-5xl md:text-7xl leading-none flex flex-wrap"
                  style={{ fontSize: "clamp(2.8rem,7vw,5.5rem)" }}
                >
                  {renderSplitHeading("Tech Stack")}
                </h2>
              </div>

              {/* Responsive Box Tab Switcher */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-full sm:w-auto"
              >
                <div role="tablist" className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 md:gap-3 w-full border-b border-border/20 pb-4 sm:pb-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      ref={(el) => {
                        if (el) {
                          el.setAttribute("aria-selected", active === cat ? "true" : "false");
                        }
                      }}
                      role="tab"
                      onClick={() => setActive(cat)}
                      data-cursor="hover"
                      className={`font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 border transition-all duration-300 text-center ${
                        cat === "Concepts" ? "col-span-2 sm:col-span-1" : ""
                      } ${
                        active === cat
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-[2px_2px_0_0_#D9281C]"
                          : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:bg-secondary/5"
                      }`}
                    >
                      {cat === "Frameworks/Libraries" ? "Frameworks" : cat === "ML/Data" ? "AI / ML" : cat === "Cloud/DevOps" ? "DevOps" : cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Premium, Spacious Logo-First Bento Grid */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 border-t border-border/40 pt-6"
                >
                  {skills[active].map((skill) => (
                    <div
                      key={skill.name}
                      data-cursor="hover"
                      className="group flex flex-col items-center justify-center p-6 border border-border/30 dark:border-border/10 bg-secondary/5 dark:bg-zinc-900/5 hover:bg-secondary/15 dark:hover:bg-zinc-900/15 hover:border-primary/50 hover:shadow-[4px_4px_0_0_#D9281C] transition-all duration-300 cursor-default relative overflow-hidden rounded-sm min-h-[116px]"
                    >
                      {/* Tech Logo - Generous Size, Highlighted Priority */}
                      <TechIcon
                        logoKey={skill.logoKey}
                        name={skill.name}
                        className="h-11 w-11 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-350 ease-out mb-3.5"
                      />

                      {/* Bold, Highly Legible Typographic Title */}
                      <span className="font-display text-[10px] uppercase tracking-widest text-foreground/80 group-hover:text-primary transition-colors duration-300 text-center leading-tight font-bold">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right panel: Gallery Framed 3D WebGL Orb */}
          <div className="hidden lg:flex h-[450px] w-full relative items-center justify-center bg-secondary/5 dark:bg-zinc-900/5 rounded-sm border border-border/30 dark:border-border/10 overflow-hidden shadow-[inset_0_4px_16px_rgba(0,0,0,0.02)] dark:shadow-[inset_0_4px_16px_rgba(0,0,0,0.18)] group/orb mt-24">
            
            {/* Gallery Labels */}
            <div className="absolute top-4 left-4 font-mono text-[9px] text-muted-foreground/30 font-semibold select-none tracking-widest">
              [CAPABILITY SPECTRUM]
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-[9px] text-muted-foreground/30 font-semibold select-none tracking-widest">
              [INTERACTIVE_3D_SPACE]
            </div>
            
            {mounted && (
              <div className="h-full w-full cursor-grab active:cursor-grabbing">
                <Canvas camera={{ position: [0, 0, 2.18], fov: 55 }}>
                  <ambientLight intensity={0.4} />
                  <MorphicOrb activeCategory={active} />
                </Canvas>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}