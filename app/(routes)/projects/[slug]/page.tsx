"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { projects, Project } from "@/data/projects";
import React from "react";

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    // Safely access slug from params
    const slug = params?.slug?.toString() || "";

    const foundProject = projects.find((p) => p.id === slug);
    if (foundProject) {
      setProject(foundProject);
    } else {
      router.push("/projects");
    }
  }, [params, router]);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-pulse text-center">
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 md:py-32">
      <div className="container px-6 md:px-12 lg:px-20">
        <Button 
          variant="ghost" 
          className="mb-12 font-mono text-[10px] uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-3 w-3" />
          Back to Projects
        </Button>

        <div className="grid gap-12 lg:grid-cols-3 lg:gap-20 mb-20">
          {/* Main Content - Takes 2 columns */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="section-label mb-4 text-primary">Case Study</p>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-7xl leading-[0.9] tracking-tighter mb-8 uppercase">
                {project.title}
              </h1>

              <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-10 max-w-2xl">
                {project.description}
              </p>

              {/* Project Image - Contained with max-width */}
              {project.image && (
                <motion.div 
                  className="mb-12"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  <div className="rounded-none overflow-hidden border border-border group relative">
                    <Image
                      src={project.image}
                      alt={project.title}
                      className="object-cover w-full h-auto grayscale hover:grayscale-0 transition-all duration-1000"
                      width={1200}
                      height={600}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                      priority
                    />
                    <div className="absolute inset-0 border-[10px] border-background/0 group-hover:border-background/10 transition-all duration-700 pointer-events-none" />
                  </div>
                </motion.div>
              )}

              {/* Description and Functionality */}
              <div className="space-y-12">
                <div>
                  <h2 className="font-display font-black text-2xl uppercase tracking-tight mb-6 flex items-center gap-4">
                    <span className="w-8 h-px bg-primary" />
                    Overview
                  </h2>
                  <p className="text-lg text-foreground/80 leading-relaxed font-serif italic">
                    {project.longDescription || project.description}
                  </p>
                </div>

                {project.functionality && project.functionality.length > 0 && (
                  <div>
                    <h2 className="font-display font-black text-2xl uppercase tracking-tight mb-6 flex items-center gap-4">
                      <span className="w-8 h-px bg-primary" />
                      Core Features
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.functionality.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start p-4 border border-border bg-card/30 hover:border-primary/30 transition-colors"
                        >
                          <span className="mr-3 font-mono text-[10px] text-primary mt-1">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Takes 1 column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-1"
          >
            <div className="bg-background border border-border p-8 h-fit sticky top-28 shadow-2xl shadow-primary/5">
              {/* Technologies Section */}
              <div className="mb-10">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-6">Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span 
                      key={tech} 
                      className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-border bg-foreground/[0.02] text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border mb-10" />

              {/* Project Links */}
              <div className="space-y-8">
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Deployment</h4>
                
                <div className="flex flex-col gap-3">
                  {project.github && (
                    <Button asChild variant="outline" className="w-full h-12 font-mono text-[10px] uppercase tracking-widest border-border hover:border-primary hover:bg-primary/5">
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        Codebase
                      </a>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button asChild variant="default" className="w-full h-12 font-mono text-[10px] uppercase tracking-widest bg-foreground text-background hover:bg-primary">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-border">
                <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-2">Role</p>
                <p className="font-display font-bold text-lg">Lead Developer</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
