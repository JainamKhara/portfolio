"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { 
  Folder, 
  Briefcase, 
  Award, 
  User, 
  Mail, 
  FileText, 
  Github, 
  Linkedin,
  Send
} from "lucide-react";
import { SectionDivider } from "@/components/shared/section-divider";

export function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setTime(new Date().toLocaleTimeString("en-US", options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative bg-transparent overflow-hidden">
      {/* Full Width Section Separator before CTA */}
      <SectionDivider />

      {/* Structural Brutalist paper borders matching website sections */}
      <div className="absolute inset-y-0 left-6 md:left-12 lg:left-20 w-[1px] bg-border/10 pointer-events-none" />
      <div className="absolute inset-y-0 right-6 md:right-12 lg:right-20 w-[1px] bg-border/10 pointer-events-none" />

      <div ref={ref} className="max-w-7xl mx-auto">
        {/* CTA section */}
        <div className="px-6 md:px-12 lg:px-20 py-20 border-b border-border">
          <motion.p
            className="section-label mb-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            Let&apos;s work together
          </motion.p>

          <div className="py-2">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              className="font-display font-black italic text-[clamp(3rem,8.5vw,7.5rem)] leading-[1.1] tracking-tight text-foreground"
            >
              Build something{" "}
              <span className="not-italic text-primary">great.</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10"
          >
            <Link
              href="/contact"
              data-cursor="hover"
              className="inline-flex items-center gap-3 bg-primary text-white font-mono text-[11px] uppercase tracking-widest px-7 py-4 hover:bg-foreground transition-colors duration-400"
            >
              Get in touch
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Editorial Footer Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 border-b border-border/40 font-mono px-6 md:px-12 lg:px-20"
        >
          {/* Column 1: Navigation */}
          <div className="py-10 md:pr-10 border-b md:border-b-0 md:border-r border-border/40 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold italic tracking-tight text-primary mb-6">
                Navigation
              </h3>
              <nav className="flex flex-col gap-4">
                {[
                  { label: "Projects", href: "/projects", icon: Folder },
                  { label: "Experience", href: "/experience", icon: Briefcase },
                  { label: "Certificates", href: "/certificates", icon: Award },
                  { label: "About", href: "/about", icon: User },
                  { label: "Contact", href: "/contact", icon: Send },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      data-cursor="hover"
                      className="group flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.15em] text-foreground/70 hover:text-primary transition-all duration-300"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-primary/80 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                        <span>{item.label}</span>
                      </span>
                      <span className="transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 text-primary">
                        →
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Column 2: Connect */}
          <div className="py-10 md:px-10 border-b md:border-b-0 md:border-r border-border/40 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold italic tracking-tight text-primary mb-6">
                Connect
              </h3>
              <nav className="flex flex-col gap-4">
                {[
                  { label: "Resume / CV", href: "/Jainam_Khara_CV.pdf", isExternal: true, icon: FileText },
                  { label: "GitHub", href: "https://github.com/JainamKhara", isExternal: true, icon: Github },
                  { label: "LinkedIn", href: "https://www.linkedin.com/in/jainamkhara", isExternal: true, icon: Linkedin },
                  { label: "Email Client", href: "mailto:kharajaynam@gmail.com", isExternal: false, icon: Mail },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.isExternal ? "_blank" : undefined}
                      rel={item.isExternal ? "noopener noreferrer" : undefined}
                      data-cursor="hover"
                      className="group flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.15em] text-foreground/70 hover:text-primary transition-all duration-300"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-primary/80 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                        <span>{item.label}</span>
                      </span>
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        className="text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Column 3: Location & Time */}
          <div className="py-10 md:pl-10 flex flex-col justify-between gap-8">
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold italic tracking-tight text-primary mb-6">
                Location & Time
              </h3>
              <div className="space-y-5 text-[10.5px] uppercase tracking-wider text-muted-foreground">
                <div>
                  <span className="text-muted-foreground/50 block text-[9px] mb-1 font-mono">Ahmedabad, IN</span>
                  <span className="font-bold text-foreground">India</span>
                </div>
                <div>
                  <span className="text-muted-foreground/50 block text-[9px] mb-1 font-mono">Local Time</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-foreground tabular-nums">
                      {time || "00:00:00 PM"}
                    </span>
                    <span className="font-mono text-[8px] px-1.5 py-0.5 border border-border/40 bg-secondary/20 text-muted-foreground font-bold tracking-wide rounded-[2px]">
                      IST
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                <span className="font-mono text-[9px] sm:text-[9.5px] uppercase tracking-[0.25em] text-foreground/80 font-bold">
                  Available for work
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between px-6 md:px-12 lg:px-20 py-8 gap-4 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60"
        >
          <p>© {new Date().getFullYear()} JAINAM KHARA. ALL RIGHTS RESERVED.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-cursor="hover"
            className="relative py-1 flex items-center gap-2 group hover:text-primary transition-colors uppercase font-bold text-[9px] tracking-[0.2em]"
          >
            <span>Back to Top</span>
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none" className="-rotate-90 group-hover:-translate-y-0.5 transition-transform duration-300">
              <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-primary group-hover:w-full transition-all duration-400" />
          </button>
        </motion.div>
      </div>
    </footer>
  );
}