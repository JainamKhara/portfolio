"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12 mb-12">
          {/* Main Content - Takes 2 columns */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                {project.title}
              </h1>

              <p className="text-base text-muted-foreground mb-6">
                {project.description}
              </p>

              {/* Project Image - Contained with max-width */}
              {project.image && (
                <div className="mb-8">
                  <div className="max-w-2xl rounded-lg overflow-hidden border-2 border-primary/20">
                    <Image
                      src={project.image}
                      alt={project.title}
                      className="object-cover w-full h-auto"
                      width={1200}
                      height={600}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                      priority
                    />
                  </div>
                </div>
              )}

              {/* Description and Functionality */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Overview</h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {project.longDescription || project.description}
                  </p>
                </div>

                {project.functionality && project.functionality.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Functionality</h2>
                    <ul className="space-y-3">
                      {project.functionality.map((functionality, i) => (
                        <li
                          key={i}
                          className="flex items-start text-base text-muted-foreground"
                        >
                          <span className="mr-3 font-bold text-primary shrink-0">
                            •
                          </span>
                          <span>{functionality}</span>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-muted/50 rounded-lg border border-primary/10 p-6 h-fit sticky top-24">
              {/* Technologies Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Project Links */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Links</h4>
                <div className="flex flex-col gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-primary hover:underline transition-colors"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub Repository
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-primary hover:underline transition-colors"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </a>
                  )}
                </div>

                {(project.github || project.liveUrl) && (
                  <>
                    <Separator className="my-4" />

                    <div className="flex flex-col gap-2">
                      {project.github && (
                        <Button
                          asChild
                          variant="default"
                          size="sm"
                          className="w-full"
                        >
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="mr-2 h-4 w-4" />
                            View on GitHub
                          </a>
                        </Button>
                      )}
                      {project.liveUrl && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
