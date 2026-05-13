"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Github, Linkedin, Mail } from "lucide-react";

const links = [
  { label: "Work",        href: "/projects"     },
  { label: "About",       href: "/about"        },
  { label: "Experience",  href: "/experience"   },
  { label: "Contact",     href: "/contact"      },
];

const socials = [
  { label: "GitHub",   href: "https://github.com/JainamKhara",                icon: Github   },
  { label: "LinkedIn", href: "https://linkedin.com/in/jainam-khara-3864a7251", icon: Linkedin },
  { label: "Email",    href: "mailto:kharajainam0@gmail.com",                  icon: Mail     },
];

export function Footer() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <footer className="border-t border-border bg-card">
      <div ref={ref} className="max-w-7xl mx-auto">

        {/* CTA section */}
        <div className="px-6 md:px-12 lg:px-20 py-20 border-b border-border overflow-hidden">
          <motion.p
            className="section-label mb-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            Let&apos;s work together
          </motion.p>

          <div className="overflow-hidden" style={{ padding: "0.5em 0" }}>
            <motion.h2
              initial={{ y: "110%" }}
              animate={inView ? { y: "0%" } : {}}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              className="font-display font-black italic text-[clamp(3rem,8vw,7rem)] leading-[1.2] tracking-tight text-foreground"
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

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-12 lg:px-20 py-8 gap-6"
        >
          <nav className="flex flex-wrap gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                data-cursor="hover"
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                data-cursor="hover"
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
            © {new Date().getFullYear()} Jainam Khara
          </p>
        </motion.div>
      </div>
    </footer>
  );
}