"use client";

import { motion } from "framer-motion";

interface RevealLineProps {
  className?: string;
  tagLeft?: string;
  tagRight?: string;
}

export function RevealLine({ className = "", tagLeft, tagRight }: RevealLineProps) {
  return (
    <div className={`relative w-full flex items-center justify-between ${className}`} aria-hidden="true">
      {tagLeft && (
        <span className="absolute left-0 -top-4 font-mono text-[7px] text-muted-foreground/35 uppercase tracking-widest select-none">
          {tagLeft}
        </span>
      )}
      
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-px bg-border/40 dark:bg-border/20 origin-left"
      />

      {tagRight && (
        <span className="absolute right-0 -top-4 font-mono text-[7px] text-muted-foreground/35 uppercase tracking-widest select-none">
          {tagRight}
        </span>
      )}
    </div>
  );
}
