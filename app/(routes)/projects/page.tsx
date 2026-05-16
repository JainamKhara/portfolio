// app/(routes)/projects/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { projects } from "@/data/projects";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { scrambleText } from "@/lib/animations";

const ALL_TECHS = Array.from(
  new Set(projects.flatMap((p) => p.technologies)),
).sort();

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-6%" });

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
      className="group relative border border-border hover:border-primary/50 transition-all duration-500 overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-700"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="font-display font-black text-4xl text-muted-foreground/20">
              {project.title[0]}
            </span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Hover links */}
        <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="bg-background/80 backdrop-blur-sm border border-border p-2 hover:bg-primary hover:border-primary hover:text-background transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="bg-background/80 backdrop-blur-sm border border-border p-2 hover:bg-primary hover:border-primary hover:text-background transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-4 left-4">
            <span className="font-mono text-[9px] uppercase tracking-widest bg-primary text-background px-2 py-1">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-display font-bold text-xl leading-tight group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          <Link
            href={`/projects/${project.id}`}
            data-cursor="hover"
            className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors"
          >
            <ArrowUpRight className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2 mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((t) => (
            <span
              key={t}
              className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-border text-foreground/70"
            >
              {t}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="font-mono text-[9px] text-muted-foreground/50 px-1">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Bottom gold sweep */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-700" />
    </motion.div>
  );
}

export default function ProjectsPage() {
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (titleRef.current) scrambleText(titleRef.current, "PROJECTS", 1100);
    }, 200);
    return () => clearTimeout(t);
  }, []);

  const filtered = filter
    ? projects.filter((p) => p.technologies.includes(filter))
    : projects;

  return (
    <div className="min-h-screen">
      {/* ── Page Hero ── */}
      <div className="relative pt-28 pb-16 px-6 md:px-12 lg:px-20 border-b border-border overflow-hidden">
        <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-display font-black text-[20vw] text-foreground/[0.015] leading-none select-none">
            WORK
          </span>
        </div>

        <motion.p className="section-label mb-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          Selected Work
        </motion.p>
        <h1 ref={titleRef} className="font-display font-black text-[clamp(4rem,12vw,10rem)] leading-none tracking-tight mb-8">
          PROJECTS
        </h1>
        <div className="glow-line" />
      </div>

      {/* ── Filter bar ── */}
      <div className="px-6 md:px-12 lg:px-20 py-8 border-b border-border overflow-x-auto">
        <div className="flex gap-3 w-max">
          <button
            onClick={() => setFilter(null)}
            data-cursor="hover"
            className={`font-mono text-[10px] uppercase tracking-widest px-4 py-2 border transition-all duration-300 whitespace-nowrap ${
              filter === null
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            All ({projects.length})
          </button>
          {ALL_TECHS.slice(0, 12).map((tech) => (
            <button
              key={tech}
              onClick={() => setFilter(tech === filter ? null : tech)}
              data-cursor="hover"
              className={`font-mono text-[10px] uppercase tracking-widest px-4 py-2 border transition-all duration-300 whitespace-nowrap ${
                filter === tech
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="px-6 md:px-12 lg:px-20 py-16">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              No projects match this filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}