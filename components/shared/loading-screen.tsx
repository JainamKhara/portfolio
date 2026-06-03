"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { loaderStore } from "@/components/PageLoader/loaderStore";

interface LoadingScreenProps {
  onRevealStart?: () => void;
  onComplete?: () => void;
}

// ─── Scramble Letter ───────────────────────────────────────────────────────────
// Cycles through random uppercase chars before snapping to the real letter.
// Jitters during scrambling for tactile feel, then snaps with a spring.
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const rnd = () => CHARS[Math.floor(Math.random() * CHARS.length)];

function ScrambleLetter({
  char,
  startDelay,
  className,
  style,
}: {
  char: string;
  startDelay: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [display, setDisplay] = useState("\u00A0");
  const [phase, setPhase] = useState<"hidden" | "scrambling" | "settled">("hidden");
  const [jitter, setJitter] = useState({ x: 0, y: 0 });
  const timerRef = useRef<number | undefined>(undefined);
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const CYCLES = 10;
    const TICK = 48;
    let count = 0;

    timerRef.current = window.setTimeout(() => {
      setPhase("scrambling");
      setDisplay(rnd());

      intervalRef.current = window.setInterval(() => {
        count++;
        if (count >= CYCLES) {
          clearInterval(intervalRef.current);
          setDisplay(char);
          setPhase("settled");
          setJitter({ x: 0, y: 0 });
        } else {
          setDisplay(rnd());
          // Subtle high-frequency mechanical vibration jitter
          setJitter({
            x: (Math.random() - 0.5) * 3,
            y: (Math.random() - 0.5) * 3,
          });
        }
      }, TICK);
    }, startDelay);

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(intervalRef.current);
    };
  }, [char, startDelay]);

  return (
    <motion.span
      className={className}
      style={style}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{
        opacity: phase === "hidden" ? 0 : phase === "scrambling" ? 0.7 : 1,
        scale: phase === "settled" ? 1 : 0.85,
        x: jitter.x,
        y: jitter.y,
      }}
      transition={{
        opacity: { duration: 0.08 },
        scale: {
          type: "spring",
          stiffness: 350,
          damping: 14,
          mass: 0.85,
        },
        x: { type: "just" },
        y: { type: "just" },
      }}
    >
      {display}
    </motion.span>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function LoadingScreen({ onRevealStart, onComplete }: LoadingScreenProps) {
  const [mounted, setMounted] = useState(false);
  const [isShattered, setIsShattered] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onRevealStartRef = useRef(onRevealStart);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onRevealStartRef.current = onRevealStart;
    onCompleteRef.current = onComplete;
  }, [onRevealStart, onComplete]);

  useEffect(() => {
    if (!mounted) return;

    if (typeof window !== "undefined") {
      const isReload =
        (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming)?.type === "reload" ||
        (performance.navigation && performance.navigation.type === 1);
      if (isReload) sessionStorage.removeItem("jk_loaded");
    }

    const hasLoaded = sessionStorage.getItem("jk_loaded");
    if (hasLoaded) {
      loaderStore.setState({ done: true });
      onRevealStartRef.current?.();
      onCompleteRef.current?.();
      setDone(true);
      return;
    }

    const timeoutIds: number[] = [];
    const run = (fn: () => void, delay: number) => {
      const id = window.setTimeout(fn, delay);
      timeoutIds.push(id);
    };

    run(() => {
      setIsShattered(true);
      onRevealStartRef.current?.();
      loaderStore.setState({ done: true });
    }, 2400);

    run(() => {
      sessionStorage.setItem("jk_loaded", "true");
      onCompleteRef.current?.();
      setDone(true);
    }, 3900);

    return () => timeoutIds.forEach(clearTimeout);
  }, [mounted]);

  if (!mounted || done) return null;

  // Center-out stagger: I and N land first, then A, then J and M
  const lettersJainam = ["J", "A", "I", "N", "A", "M"];
  const delaysJainam  = [840, 720, 600, 600, 720, 840];

  // Center-out stagger: A lands first, then H and R, then K and A
  const lettersKhara  = ["K", "H", "A", "R", "A"];
  const delaysKhara   = [1640, 1520, 1400, 1520, 1640];

  return (
    <div
      className="fixed inset-0 z-[9999] select-none touch-none overflow-hidden"
      style={{ pointerEvents: isShattered ? "none" : "auto" }}
    >
      {/* ── Outer Wrapper: Fills from center on mount, collapses on exit ── */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ perspective: "1200px" }}
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={
          isShattered
            ? { clipPath: "circle(0% at 50% 50%)" }
            : { clipPath: "circle(100% at 50% 50%)" }
        }
        transition={{ duration: isShattered ? 1.3 : 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ── LAYER 1: Solid Plain Red Background ── */}
        <div className="absolute inset-0 bg-[var(--loader-bg)]" />

        {/* ── LAYER 1.2: Diagonal Architectural Hatch Pattern (Noticeable & premium) ── */}
        <div 
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(-45deg, rgba(255,255,255,0.18), rgba(255,255,255,0.18) 1.5px, transparent 1.5px, transparent 18px)",
          }}
        />

        {/* ── LAYER 1.3: Framing Editorial Border & Corner Brackets ── */}
        <motion.div 
          className="absolute inset-6 md:inset-10 border border-white/10 pointer-events-none"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
        >
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/30" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/30" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/30" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/30" />
        </motion.div>
      </motion.div>

      {/* ── LAYER 2: Typography (Brutalist Stamped Letter Tiles) ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {/* Single wrapper exits as one unit: blurs up and fades */}
        <motion.div
          className="flex flex-col items-center select-none"
          initial={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          animate={
            isShattered
              ? { opacity: 0, y: -24, scale: 1.05, filter: "blur(10px)" }
              : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
          }
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* JAINAM row (Black tiles with white letters) */}
          <div className="relative flex gap-[6px] md:gap-[12px] items-center">
            {lettersJainam.map((char, i) => (
              <motion.div
                key={i}
                className="flex items-center justify-center bg-[#0A0A0A] shadow-[4px_4px_0px_rgba(0,0,0,0.18)]"
                style={{
                  width: "clamp(48px, 9vw, 110px)",
                  height: "clamp(48px, 9vw, 110px)",
                  border: "2px solid #0A0A0A",
                }}
                initial={{ scale: 0.6, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                  delay: (delaysJainam[i] - 120) / 1000,
                  type: "spring",
                  stiffness: 280,
                  damping: 16,
                  mass: 0.9,
                }}
              >
                <ScrambleLetter
                  char={char}
                  startDelay={delaysJainam[i]}
                  className="font-display font-black text-white leading-none block"
                  style={{
                    fontSize: "clamp(28px, 5.5vw, 64px)",
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Spacer */}
          <div className="h-[24px] md:h-[32px]" />

          {/* KHARA row (White tiles with black letters) */}
          <div className="relative flex gap-[6px] md:gap-[12px] items-center">
            {lettersKhara.map((char, i) => (
              <motion.div
                key={i}
                className="flex items-center justify-center bg-white shadow-[4px_4px_0px_rgba(0,0,0,0.18)]"
                style={{
                  width: "clamp(48px, 9vw, 110px)",
                  height: "clamp(48px, 9vw, 110px)",
                  border: "2px solid #0A0A0A",
                }}
                initial={{ scale: 0.6, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                  delay: (delaysKhara[i] - 120) / 1000,
                  type: "spring",
                  stiffness: 280,
                  damping: 16,
                  mass: 0.9,
                }}
              >
                <ScrambleLetter
                  char={char}
                  startDelay={delaysKhara[i]}
                  className="font-display font-black text-black leading-none block"
                  style={{
                    fontSize: "clamp(28px, 5.5vw, 64px)",
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export { LoadingScreen as PageLoader };


  