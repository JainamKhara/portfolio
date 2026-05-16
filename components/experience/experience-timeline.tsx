"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { experiences } from "@/data/experience";
import { gsap } from "@/lib/gsap";
import { scrambleText } from "@/lib/animations";
import { MapPin, ArrowRight, Briefcase, Cpu, Users } from "lucide-react";

const ICONS: Record<string, React.ReactNode> = {
  work:       <Briefcase className="h-4 w-4" />,
  research:   <Cpu className="h-4 w-4" />,
  leadership: <Users className="h-4 w-4" />,
};

function TimelineItem({
  exp,
  index,
}: {
  exp: (typeof experiences)[0];
  index: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const lineRef= useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!inView || !lineRef.current) return;
    gsap.fromTo(lineRef.current,
      { scaleY: 0, transformOrigin: "top" },
      { scaleY: 1, duration: 0.8, ease: "power3.out", delay: 0.3 }
    );
  }, [inView]);

  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative grid grid-cols-[1fr_auto_1fr] gap-0 mb-16">
      {/* Left content */}
      <div className={`pr-12 ${isLeft ? "block" : "invisible"}`}>
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="group border border-border p-6 hover:border-primary/50 transition-all duration-500 ml-auto max-w-sm"
          >
            <ExperienceCard exp={exp} />
          </motion.div>
        )}
      </div>

      {/* Centre spine */}
      <div className="flex flex-col items-center w-10">
        {/* Dot */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, type: "spring", delay: 0.05 }}
          className="relative flex-shrink-0 w-10 h-10 border-2 border-primary flex items-center justify-center bg-background z-10"
        >
          <span className="text-primary">
            {ICONS[exp.type || "work"]}
          </span>
          {/* Ping */}
          <span className="absolute inset-0 border-2 border-primary animate-ping opacity-20 rounded-none" />
        </motion.div>

        {/* Connecting line */}
        <div
          ref={lineRef}
          className="flex-1 w-[1px] bg-gradient-to-b from-primary/50 to-transparent mt-2"
          style={{ transformOrigin: "top" }}
        />
      </div>

      {/* Right content */}
      <div className={`pl-12 ${!isLeft ? "block" : "invisible"}`}>
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="group border border-border p-6 hover:border-primary/50 transition-all duration-500 max-w-sm"
          >
            <ExperienceCard exp={exp} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ExperienceCard({ exp }: { exp: (typeof experiences)[0] }) {
  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-display font-bold text-lg leading-tight group-hover:text-primary transition-colors">
            {exp.title}
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary mt-1">
            {exp.company}
          </p>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-wider text-foreground/60 bg-muted px-2 py-1 shrink-0">
          {exp.startDate.split(" ").pop()} – {exp.endDate.split(" ").pop()}
        </span>
      </div>

      <div className="flex items-center gap-1 text-foreground/70 mb-4">
        <MapPin className="h-3 w-3 shrink-0" />
        <span className="font-mono text-[10px]">{exp.location}</span>
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed mb-4">{exp.description}</p>

      <div className="space-y-2 border-t border-border pt-4">
        {exp.achievements.slice(0, 2).map((a, i) => (
          <div key={i} className="flex items-start gap-2">
            <ArrowRight className="h-3 w-3 text-primary shrink-0 mt-1" />
            <span className="text-xs text-foreground/80 leading-relaxed">{a}</span>
          </div>
        ))}
      </div>

      {/* Bottom gold sweep */}
      <div className="mt-5 h-[1px] w-0 bg-primary group-hover:w-full transition-all duration-700" />
    </>
  );
}

export function ExperienceTimeline() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (titleRef.current) scrambleText(titleRef.current, "EXPERIENCE", 1100);
    }, 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Page Hero */}
      <div className="relative min-h-[40vh] flex flex-col justify-end pt-28 pb-16 px-6 md:px-12 lg:px-20 border-b border-border overflow-hidden">
        <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-display font-black text-[16vw] text-foreground/[0.02] uppercase leading-none">
            WORK
          </span>
        </div>
        <motion.p className="section-label mb-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          Professional Journey
        </motion.p>
        <h1 ref={titleRef} className="font-display font-black text-[clamp(3rem,9vw,7rem)] leading-none tracking-tight mb-8">
          ██████████
        </h1>
        <div className="glow-line" />
      </div>

      {/* Timeline */}
      <div className="px-6 md:px-12 lg:px-20 py-24">
        <div className="relative max-w-4xl mx-auto">
          {experiences.map((exp, i) => (
            <TimelineItem key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}