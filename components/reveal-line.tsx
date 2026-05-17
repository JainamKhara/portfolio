"use client";

import { motion } from "framer-motion";

interface RevealLineProps {
  className?: string;
  tagLeft?: string;
  tagRight?: string;
}

export function RevealLine({ className = "" }: RevealLineProps) {
  return (
    <div className={`relative w-full flex items-center justify-between ${className}`} aria-hidden="true">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-px bg-border/40 dark:bg-border/20 origin-left"
      />
    </div>
  );
}
