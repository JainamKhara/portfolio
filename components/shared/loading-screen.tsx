"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scrambleText } from "@/lib/animations";

const STEPS = ["INIT_ENV", "LOAD_ASSETS", "BUILD_UI", "DEPLOY"];

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx]   = useState(0);
  const [done, setDone]         = useState(false);
  const nameRef                 = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (nameRef.current) scrambleText(nameRef.current, "JAINAM KHARA", 1300);
    }, 350);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let cur = 0;
    const iv = setInterval(() => {
      cur = Math.min(100, cur + Math.random() * 3.5 + 0.6);
      setProgress(Math.round(cur));
      const idx = [25, 55, 82, 100].findIndex((t) => cur < t);
      setStepIdx(idx === -1 ? 3 : idx);
      if (cur >= 100) {
        clearInterval(iv);
        setTimeout(() => setDone(true), 450);
        setTimeout(onComplete, 1050);
      }
    }, 38);
    return () => clearInterval(iv);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          exit={{ clipPath: "inset(100% 0 0 0)", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col bg-background overflow-hidden"
        >
          {/* Corner brackets */}
          {[
            "top-0 left-0 border-l-2 border-t-2",
            "top-0 right-0 border-r-2 border-t-2",
            "bottom-0 left-0 border-l-2 border-b-2",
            "bottom-0 right-0 border-r-2 border-b-2",
          ].map((cls, i) => (
            <div key={i} className={`absolute w-14 h-14 border-primary/60 ${cls}`} />
          ))}

          {/* Dot grid */}
          <div aria-hidden className="absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: "radial-gradient(circle, #6C47FF 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

          {/* Top */}
          <div className="flex justify-between px-8 pt-7">
            <span className="section-label text-muted-foreground/50">Loading</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/40">{new Date().getFullYear()}</span>
          </div>

          {/* Centre */}
          <div className="flex-1 flex flex-col items-center justify-center gap-5">
            {/* Scramble name */}
            <h1 ref={nameRef} className="font-mono font-bold tracking-[0.2em] text-foreground/80"
              style={{ fontSize: "clamp(1.2rem,3.5vw,2.8rem)" }}>
              ████████████
            </h1>

            {/* Giant counter */}
            <div className="flex items-baseline gap-1">
              <span className="font-display font-black tabular-nums leading-none"
                style={{ fontSize: "clamp(7rem,21vw,17rem)", color: "#6C47FF",
                  textShadow: "0 0 60px rgba(108,71,255,0.2)" }}>
                {progress}
              </span>
              <span className="font-display font-black text-foreground/15"
                style={{ fontSize: "clamp(2rem,5vw,5rem)" }}>
                %
              </span>
            </div>

            {/* Step cycling */}
            <div className="h-5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={stepIdx}
                  initial={{ y: 22, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -22, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/50 text-center"
                >
                  {STEPS[stepIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom progress */}
          <div className="px-8 pb-8">
            <div className="flex justify-between mb-2">
              <span className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-widest">Progress</span>
              <span className="font-mono text-[9px] text-muted-foreground/40">{progress} / 100</span>
            </div>
            <div className="w-full h-px overflow-hidden" style={{ background: "rgba(108,71,255,0.12)" }}>
              <motion.div className="h-full bg-primary"
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.06 }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
