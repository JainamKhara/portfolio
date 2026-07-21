"use client";

import { useRef, useState, useEffect } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion, AnimatePresence } from "framer-motion";
import { skills, SkillCategory } from "@/data/skills";
import { TechIcon } from "@/components/tech-icon";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { DecoderText } from "@/components/decoder-text";
import { ChevronDown } from "lucide-react";

const CATEGORIES = Object.keys(skills) as SkillCategory[];

// ─────────────────────────────────────────────────────────────
// 3D Morphic WebGL Particle Orb Component
// ─────────────────────────────────────────────────────────────
function MorphicOrb({ activeCategory }: { activeCategory: SkillCategory }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 2400;

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
    return new THREE.CanvasTexture(canvas);
  });

  const [geometry] = useState(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      const mix = Math.random();
      if (mix > 0.45) {
        colors[i * 3] = 217 / 255; colors[i * 3 + 1] = 40 / 255; colors[i * 3 + 2] = 28 / 255;
      } else {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0;
      }
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  });

  const getTargetPositions = (category: SkillCategory) => {
    const temp = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const u = Math.random();
      const v = Math.random();
      if (category === "Languages") {
        const R_core = 0.28 + (Math.random() - 0.5) * 0.03;
        if (i % 4 === 0) {
          const theta = Math.acos(2 * u - 1);
          const phi = v * 2 * Math.PI;
          temp[idx] = R_core * Math.sin(theta) * Math.cos(phi);
          temp[idx + 1] = R_core * Math.sin(theta) * Math.sin(phi);
          temp[idx + 2] = R_core * Math.cos(theta);
        } else if (i % 4 === 1) {
          const theta = u * 2 * Math.PI;
          const R = 0.72 + (Math.random() - 0.5) * 0.015;
          temp[idx] = R * Math.cos(theta); temp[idx + 1] = R * Math.sin(theta) * 0.35; temp[idx + 2] = R * Math.sin(theta) * 0.92;
        } else if (i % 4 === 2) {
          const theta = u * 2 * Math.PI;
          const R = 0.72 + (Math.random() - 0.5) * 0.015;
          temp[idx] = R * Math.cos(theta) * 0.35; temp[idx + 1] = R * Math.sin(theta); temp[idx + 2] = R * Math.cos(theta) * 0.92;
        } else {
          const theta = u * 2 * Math.PI;
          const R = 0.72 + (Math.random() - 0.5) * 0.015;
          temp[idx] = R * Math.cos(theta) * 0.92; temp[idx + 1] = R * Math.sin(theta) * 0.92; temp[idx + 2] = R * Math.cos(theta) * 0.35;
        }
      } else if (category === "Frameworks/Libraries") {
        const size_out = 0.65; const size_in = 0.30; const choice = i % 10;
        if (choice < 4) {
          const edge = i % 12; const t = Math.random() * 2 - 1;
          const edgeCoords = [[t,1,1],[t,-1,1],[t,1,-1],[t,-1,-1],[1,t,1],[-1,t,1],[1,t,-1],[-1,t,-1],[1,1,t],[-1,1,t],[1,-1,t],[-1,-1,t]];
          const coord = edgeCoords[edge]; const jitter = 0.012;
          temp[idx] = coord[0]*size_out+(Math.random()-0.5)*jitter; temp[idx+1]=coord[1]*size_out+(Math.random()-0.5)*jitter; temp[idx+2]=coord[2]*size_out+(Math.random()-0.5)*jitter;
        } else if (choice < 7) {
          const edge = i % 12; const t = Math.random() * 2 - 1;
          const edgeCoords = [[t,1,1],[t,-1,1],[t,1,-1],[t,-1,-1],[1,t,1],[-1,t,1],[1,t,-1],[-1,t,-1],[1,1,t],[-1,1,t],[1,-1,t],[-1,-1,t]];
          const coord = edgeCoords[edge]; const jitter = 0.01;
          temp[idx] = coord[0]*size_in+(Math.random()-0.5)*jitter; temp[idx+1]=coord[1]*size_in+(Math.random()-0.5)*jitter; temp[idx+2]=coord[2]*size_in+(Math.random()-0.5)*jitter;
        } else {
          const corner = i % 8; const t = Math.random();
          const cx=(corner&1)?1:-1; const cy=(corner&2)?1:-1; const cz=(corner&4)?1:-1; const jitter=0.01;
          temp[idx]=(cx*size_in+(cx*size_out-cx*size_in)*t)+(Math.random()-0.5)*jitter;
          temp[idx+1]=(cy*size_in+(cy*size_out-cy*size_in)*t)+(Math.random()-0.5)*jitter;
          temp[idx+2]=(cz*size_in+(cz*size_out-cz*size_in)*t)+(Math.random()-0.5)*jitter;
        }
      } else if (category === "Concepts") {
        const hubs = [{x:-0.54,y:-0.32,z:-0.16},{x:0.54,y:-0.32,z:-0.16},{x:0.0,y:0.48,z:0.28}];
        const choice = i % 5;
        if (choice < 3) {
          const hub = hubs[choice]; const r = 0.12 + Math.random() * 0.10;
          const theta = Math.acos(2 * Math.random() - 1); const phi = Math.random() * 2 * Math.PI;
          temp[idx]=hub.x+r*Math.sin(theta)*Math.cos(phi); temp[idx+1]=hub.y+r*Math.sin(theta)*Math.sin(phi); temp[idx+2]=hub.z+r*Math.cos(theta);
        } else {
          const hubA=hubs[i%3]; const hubB=hubs[(i+1)%3]; const lerp=Math.random();
          const offset=(i%2===0)?0.045:-0.045; const jitter=0.018;
          temp[idx]=hubA.x+(hubB.x-hubA.x)*lerp+(Math.random()-0.5)*jitter;
          temp[idx+1]=hubA.y+(hubB.y-hubA.y)*lerp+offset+(Math.random()-0.5)*jitter;
          temp[idx+2]=hubA.z+(hubB.z-hubA.z)*lerp+offset+(Math.random()-0.5)*jitter;
        }
      } else if (category === "Cloud/DevOps") {
        const ringIdx=i%5; const t=(ringIdx-2.0)*0.28; const theta=u*2*Math.PI;
        const R=(0.28+ringIdx*0.096)+(Math.random()-0.5)*0.018;
        temp[idx]=R*Math.cos(theta); temp[idx+1]=t; temp[idx+2]=R*Math.sin(theta);
      } else {
        const layerX=[-0.64,-0.21,0.21,0.64];
        const layerNodes=[[-0.39,0,0.39],[-0.48,-0.16,0.16,0.48],[-0.48,-0.16,0.16,0.48],[-0.26,0.26]];
        const choice=i%10;
        if (choice<4) {
          const layerIdx=i%4; const nodeIdx=i%layerNodes[layerIdx].length;
          const nx=layerX[layerIdx]; const ny=layerNodes[layerIdx][nodeIdx]; const nz=(i%2===0?0.026:-0.026);
          const r=0.06+Math.random()*0.045; const theta=Math.acos(2*Math.random()-1); const phi=Math.random()*2*Math.PI;
          temp[idx]=nx+r*Math.sin(theta)*Math.cos(phi); temp[idx+1]=ny+r*Math.sin(theta)*Math.sin(phi); temp[idx+2]=nz+r*Math.cos(theta);
        } else {
          const layerIdx=i%3; const nextLayerIdx=layerIdx+1;
          const nodeIdxA=i%layerNodes[layerIdx].length; const nodeIdxB=(i+7)%layerNodes[nextLayerIdx].length;
          const ax=layerX[layerIdx]; const ay=layerNodes[layerIdx][nodeIdxA]; const az=(i%2===0?0.022:-0.022);
          const bx=layerX[nextLayerIdx]; const by=layerNodes[nextLayerIdx][nodeIdxB]; const bz=(i%3===0?0.022:-0.022);
          const t=Math.random(); const jitter=0.012;
          temp[idx]=ax+(bx-ax)*t+(Math.random()-0.5)*jitter; temp[idx+1]=ay+(by-ay)*t+(Math.random()-0.5)*jitter; temp[idx+2]=az+(bz-az)*t+(Math.random()-0.5)*jitter;
        }
      }
    }
    return temp;
  };

  const targetPositionsRef = useRef<Float32Array | null>(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!geometry) return;
    const colorsAttr = geometry.getAttribute("color") as THREE.BufferAttribute;
    if (!colorsAttr) return;
    const colors = colorsAttr.array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      const mix = ((i * 17) + 29) % 100 / 100;
      if (mix > 0.45) {
        colors[i*3]=217/255; colors[i*3+1]=40/255; colors[i*3+2]=28/255;
      } else {
        if (isDark) {
          colors[i*3]=1.0; colors[i*3+1]=1.0; colors[i*3+2]=1.0;
        } else {
          colors[i*3]=22/255; colors[i*3+1]=22/255; colors[i*3+2]=22/255;
        }
      }
    }
    colorsAttr.needsUpdate = true;
  }, [isDark, geometry]);

  const mouseRef = useRef({ x: 0, y: 0 });
  useEffect(() => { targetPositionsRef.current = getTargetPositions(activeCategory); }, [activeCategory]);
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
    const lerpFactor = Math.min(0.075 * (delta * 60), 0.15);
    for (let i = 0; i < geoPositions.length; i++) {
      const idx = Math.floor(i / 3);
      const wave = Math.sin(time * 1.6 + idx * 0.04) * 0.0022;
      geoPositions[i] += (targets[i] + wave - geoPositions[i]) * lerpFactor;
    }
    points.geometry.attributes.position.needsUpdate = true;
    points.rotation.y += delta * 0.14;
    points.rotation.x += delta * 0.04;
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

// ─────────────────────────────────────────────────────────────
// Interactive Accordion Category Row Component
// ─────────────────────────────────────────────────────────────
export function SkillsShowcase() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>(CATEGORIES[0]);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const renderSplitHeading = (text: string) =>
    text.split(" ").map((word, wIdx) => (
      <span key={wIdx} className="inline-block overflow-hidden relative pb-2 mr-3 last:mr-0">
        {word.split("").map((char, cIdx) => (
          <span key={cIdx} className="char-letter inline-block translate-y-[110%] select-none">{char}</span>
        ))}
        <div className="sweep-line absolute bottom-0 left-0 h-[2.5px] bg-primary w-0" />
      </span>
    ));

  /* ── GSAP: Heading Kinetic Text Reveal ── */
  useGSAP(() => {
    const section = containerRef.current;
    if (!section) return;

    const chars = section.querySelectorAll(".char-letter");
    const sweeps = section.querySelectorAll(".sweep-line");
    const label = section.querySelector(".section-label");

    if (chars.length > 0) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 85%", toggleActions: "play none none none" }
      });
      tl.to(chars, { y: "0%", duration: 0.6, stagger: 0.02, ease: "power3.out" });
      tl.to(sweeps, { width: "100%", duration: 0.5, ease: "power2.inOut" }, "-=0.25");
    }

    if (label) {
      gsap.fromTo(label,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 88%" } }
      );
    }
  }, { scope: containerRef });

  useEffect(() => { setMounted(true); }, []);

  return (
    <section ref={sectionRef} className="py-20 px-6 md:px-12 lg:px-20 bg-transparent overflow-hidden relative">
      <div ref={containerRef} className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="mb-14">
          <p className="section-label mb-3 opacity-0 font-mono text-[11px] uppercase tracking-widest text-primary/70 font-semibold">
            <DecoderText text="CAPABILITIES & TECH STACK" delay={0.2} />
          </p>
          <h2
            className="font-display font-black text-5xl md:text-7xl leading-none flex flex-wrap"
            style={{ fontSize: "clamp(2.8rem,7vw,5.5rem)" }}
          >
            {renderSplitHeading("Technical Mastery")}
          </h2>
        </div>

        {/* Dynamic Interactive Accordion Stack with 3D Orb Integration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Vertical Stacked Interactive Accordion Rows */}
          <div className="lg:col-span-8 space-y-4">
            {CATEGORIES.map((cat, idx) => {
              const isOpen = activeCategory === cat;
              const catSkills = skills[cat];

              return (
                <div
                  key={cat}
                  className={`border transition-all duration-500 overflow-hidden ${
                    isOpen
                      ? "border-primary bg-primary/5 shadow-[6px_6px_0_0_#D9281C]"
                      : "border-border/40 hover:border-foreground/40 bg-background/50"
                  }`}
                >
                  {/* Category Accordion Header */}
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className="w-full p-6 md:p-8 flex items-center justify-between text-left transition-colors duration-300 group"
                  >
                    <div className="flex items-center gap-6">
                      <span className="font-mono text-sm font-bold text-primary select-none">
                        0{idx + 1}.
                      </span>
                      <h3 className="font-display font-black text-2xl md:text-4xl tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                        {cat}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-muted-foreground hidden sm:inline-block">
                        [{catSkills.length} SKILLS]
                      </span>
                      <div className={`p-2 border border-border/40 transition-transform duration-500 ${isOpen ? "rotate-180 bg-primary text-white border-primary" : ""}`}>
                        <ChevronDown className="h-5 w-5" />
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content Drawer: Dynamic Skill Badges */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="px-6 pb-8 md:px-8 md:pb-8 pt-2 border-t border-border/20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {catSkills.map((skill) => (
                            <div
                              key={skill.name}
                              className="group/item p-4 border border-border/30 bg-background hover:border-primary hover:bg-primary/10 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-default"
                            >
                              <TechIcon
                                logoKey={skill.logoKey}
                                name={skill.name}
                                className="h-8 w-8 grayscale group-hover/item:grayscale-0 group-hover/item:scale-110 transition-all duration-300 mb-2"
                              />
                              <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-foreground group-hover/item:text-primary transition-colors">
                                {skill.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right Column: WebGL Interactive Particle Orb Display */}
          <div className="lg:col-span-4 sticky top-28 hidden lg:flex h-[480px] w-full items-center justify-center bg-secondary/5 dark:bg-zinc-900/10 border border-border/40 overflow-hidden group/orb">
            <div className="absolute top-4 left-4 font-mono text-[9px] text-muted-foreground/40 font-semibold select-none tracking-widest">
              [CATEGORY_MORPHIC_SPECTRUM]
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-[10px] text-primary font-bold select-none tracking-widest uppercase">
              {"// "}{activeCategory}
            </div>
            {mounted && (
              <div className="h-full w-full cursor-grab active:cursor-grabbing">
                <Canvas camera={{ position: [0, 0, 2.18], fov: 55 }}>
                  <ambientLight intensity={0.4} />
                  <MorphicOrb activeCategory={activeCategory} />
                </Canvas>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}