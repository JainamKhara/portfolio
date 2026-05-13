// components/shared/scroll-progress.tsx
"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[9997] origin-left"
      style={{
        scaleX: smoothProgress,
        background: "linear-gradient(90deg, #c9a84c, #f0d080, #c9a84c)",
      }}
    />
  );
}