// components/home/hero.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
  Phone,
  Code2,
  Smartphone,
  Package,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { socialLinks } from "@/data/social";

export function Hero() {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const displayedSkills = [
    {
      title: "Website Development",
      icon: Code2,
    },
    {
      title: "Application Development",
      icon: Smartphone,
    },
    {
      title: "Full Stack Development",
      icon: Package,
    },
    {
      title: "Machine Learning Practitioner",
      icon: Brain,
    },
  ];

  // Parallax effect setup - disabled on mobile
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], isMobile ? [0, 0] : [0, 80]);
  const y2 = useTransform(scrollY, [0, 500], isMobile ? [0, 0] : [0, 120]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSkillIndex(
        (prevIndex) => (prevIndex + 1) % displayedSkills.length,
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [displayedSkills.length]);

  // Mouse movement parallax for background with throttling - disabled on mobile
  useEffect(() => {
    if (isMobile) {
      setMousePosition({ x: 0, y: 0 });
      return;
    }

    let animationFrameId: number;
    let lastX = 0;
    let lastY = 0;
    let lastUpdate = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const now = Date.now();

      // Throttle to 30fps instead of 60fps
      if (now - lastUpdate < 33) return;
      lastUpdate = now;

      const rect = containerRef.current.getBoundingClientRect();
      lastX = (e.clientX - rect.left) / rect.width;
      lastY = (e.clientY - rect.top) / rect.height;

      if (animationFrameId) return;
      animationFrameId = requestAnimationFrame(() => {
        setMousePosition({
          x: lastX,
          y: lastY,
        });
        animationFrameId = 0;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  // Get icon component for social links
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "github":
        return <Github className="h-5 w-5" />;
      case "linkedin":
        return <Linkedin className="h-5 w-5" />;
      case "mail":
        return <Mail className="h-5 w-5" />;
      case "phone":
        return <Phone className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const currentSkill = displayedSkills[currentSkillIndex];
  const CurrentIcon = currentSkill.icon;

  return (
    <section
      ref={containerRef}
      className="relative py-12 md:py-24 overflow-hidden"
    >
      {/* Enhanced Background with gradient animation and mouse tracking */}
      <motion.div className="absolute inset-0 -z-10">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-50" />

        {/* Interactive gradient orbs - disabled on mobile */}
        {!isMobile && (
          <>
            <motion.div
              className="absolute right-0 top-20 w-72 h-72 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl"
              animate={{
                x: mousePosition.x * 30,
                y: mousePosition.y * 30,
              }}
              transition={{ type: "tween", duration: 0.5 }}
            />
            <motion.div
              className="absolute left-20 bottom-20 w-96 h-96 bg-gradient-to-tr from-secondary/15 to-secondary/5 rounded-full blur-3xl"
              animate={{
                x: -mousePosition.x * 20,
                y: -mousePosition.y * 20,
              }}
              transition={{ type: "tween", duration: 0.5 }}
            />
          </>
        )}

        {/* Floating accent orbs - simplified on mobile */}
        {!isMobile && (
          <motion.div
            className="absolute top-1/3 left-1/4 w-40 h-40 bg-primary/10 rounded-full blur-2xl"
            animate={{
              y: [0, 15, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>

      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div
            className="flex flex-col justify-center space-y-6"
            style={{ y: y1 }}
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
                  Hi, I&apos;m Jainam Khara
                </h1>
              </motion.div>

              {/* Enhanced Skill Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="h-20"
              >
                <div className="relative h-full">
                  {displayedSkills.map((skill, index) => (
                    <motion.div
                      key={skill.title}
                      className={`absolute transition-all duration-700 ${
                        index === currentSkillIndex
                          ? "opacity-100 visible"
                          : "opacity-0 invisible"
                      }`}
                      initial={{ y: 20, opacity: 0 }}
                      animate={
                        index === currentSkillIndex
                          ? { y: 0, opacity: 1 }
                          : { y: -20, opacity: 0 }
                      }
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                          <CurrentIcon className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold sm:text-4xl bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                          {skill.title}
                        </h2>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-[600px] text-lg text-muted-foreground md:text-xl leading-relaxed"
              >
                A passionate developer with expertise in Fullstack Web and App
                Development. Currently pursuing a Bachelor&apos;s in Computer
                Science at SAL Institute of Technology and Engineering Research.
              </motion.p>
            </div>

            {/* Action Buttons with enhanced styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button asChild size="lg" className="group shadow-lg">
                  <a href="#projects">
                    View My Work
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="shadow-lg border-primary/20"
                >
                  <a
                    href="/Jainam_Khara_CV.pdf"
                    download="Jainam Khara CV.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    CV
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Enhanced Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex gap-3 pt-4"
            >
              {socialLinks.map((social, idx) => (
                <motion.div
                  key={social.id}
                  whileHover={{ y: -5, scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 hover:bg-gradient-to-br hover:from-primary/20 hover:to-primary/10 transition-all shadow-md"
                  >
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                    >
                      {getIconComponent(social.icon)}
                    </a>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Enhanced Profile Image Section */}
          <motion.div
            className="flex items-center justify-center"
            style={{ y: y2 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div
              className="relative aspect-square w-full max-w-md will-change-transform"
              animate={
                isMobile
                  ? { y: 0 }
                  : {
                      y: [0, 8, 0],
                    }
              }
              transition={
                isMobile
                  ? { duration: 0 }
                  : {
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
            >
              {/* Animated border glow */}
              {!isMobile && (
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/30 to-secondary/15 blur-xl opacity-30 -z-10 will-change-transform"
                  animate={{
                    scale: [1, 1.03, 1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              {!isMobile && (
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/5 blur-2xl opacity-20 -z-10" />
              )}

              {/* Image container with border */}
              <div className="relative h-full w-full overflow-hidden rounded-3xl border-2 border-primary/20 shadow-2xl">
                <Image
                  src="/images/profile.jpg"
                  alt="Jainam Khara"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Floating accent elements - disabled on mobile */}
              {!isMobile && (
                <motion.div
                  className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-primary/20 border border-primary/40 blur-sm will-change-transform"
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
