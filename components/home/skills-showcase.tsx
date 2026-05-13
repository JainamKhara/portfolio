"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { skills, SkillCategory } from "@/data/skills";
import { TechIcon } from "@/components/tech-icon";

const CATEGORIES = Object.keys(skills) as SkillCategory[];

export function SkillsShowcase() {
  const [active, setActive] = useState<SkillCategory>(CATEGORIES[0]);
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-card border-y border-border">
      <div ref={ref} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <motion.p
              className="section-label mb-3"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              Capabilities
            </motion.p>
            <div className="overflow-hidden">
              <motion.h2
                className="font-display font-black text-5xl md:text-7xl leading-none"
                initial={{ y: "110%" }}
                animate={inView ? { y: "0%" } : {}}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              >
                Tech Stack
              </motion.h2>
            </div>
          </div>

          {/* Category tabs */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                data-cursor="hover"
                className={`font-mono text-[10px] uppercase tracking-widest px-4 py-2 border transition-all duration-300 ${
                  active === cat
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Glow divider */}
        <div className="glow-line mb-16" />

        {/* Skill grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
          >
            {skills[active].map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col items-center gap-3 p-5 border border-border hover:border-primary/50 bg-background hover:bg-primary/5 transition-all duration-300 cursor-default"
                data-cursor="hover"
              >
                <TechIcon
                  logoKey={skill.logoKey}
                  name={skill.name}
                  className="h-8 w-8 grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}