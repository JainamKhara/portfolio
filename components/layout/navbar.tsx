"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ThemeSwitch } from "@/components/theme-switch";

const NAV = [
  { label: "Projects",     href: "/projects"     },
  { label: "Experience",   href: "/experience"   },
  { label: "Certificates", href: "/certificates" },
  { label: "About",        href: "/about"        },
  { label: "Contact",      href: "/contact"      },
];

export function Navbar() {
  const pathname   = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const logoRef    = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* GSAP magnetic logo */
  useEffect(() => {
    const el = logoRef.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    const move  = (e: MouseEvent) => {
      const b = el.getBoundingClientRect();
      xTo((e.clientX - (b.left + b.width  / 2)) * 0.3);
      yTo((e.clientY - (b.top  + b.height / 2)) * 0.3);
    };
    const reset = () => { xTo(0); yTo(0); };
    el.addEventListener("mousemove",  move);
    el.addEventListener("mouseleave", reset);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", reset); };
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 lg:px-20 h-16 transition-all duration-500",
          scrolled
            ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-[0_2px_20px_-10px_rgba(0,0,0,0.1)] h-14"
            : "bg-transparent h-20",
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          data-cursor="hover"
          className="flex items-center gap-3 font-display font-black text-xl tracking-tight hover:text-primary transition-colors duration-300 group"
        >
          <span ref={logoRef} className="inline-flex items-center justify-center w-8 h-8 bg-primary text-white font-mono font-bold text-[10px] shadow-lg shadow-primary/20">
            JK
          </span>
          <span className="hidden sm:inline-block">Jainam</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-cursor="hover"
              className={cn(
                "font-mono text-[11px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 relative py-1",
                pathname === item.href
                  ? "text-primary"
                  : "text-foreground/60 hover:text-foreground",
              )}
            >
              {item.label}
              {pathname === item.href && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-primary"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <ThemeSwitch />
          <Link
            href="/contact"
            data-cursor="hover"
            className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-2.5 border border-foreground/10 bg-foreground text-background hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"
          >
            Hire me
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="lg:hidden flex items-center gap-4">
          <ThemeSwitch />
          <button
            className="flex flex-col gap-1.5 p-2 z-50 group"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7.5 : 0 }} transition={{ duration: 0.3 }} className="block w-6 h-[1.5px] bg-foreground group-hover:bg-primary transition-colors" />
            <motion.span animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }} transition={{ duration: 0.2 }} className="block w-6 h-[1.5px] bg-foreground group-hover:bg-primary transition-colors" />
            <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7.5 : 0 }} transition={{ duration: 0.3 }} className="block w-6 h-[1.5px] bg-foreground group-hover:bg-primary transition-colors" />
          </button>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-background flex flex-col justify-center px-10 pt-20"
          >
            <nav className="flex flex-col gap-8">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + 0.05 * i, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "font-display font-black text-[clamp(2.5rem,12vw,5rem)] leading-none transition-all duration-300 flex items-center gap-4 group",
                      pathname === item.href ? "text-primary" : "hover:text-primary hover:translate-x-4",
                    )}
                  >
                    <span className="font-mono text-[12px] opacity-20 group-hover:opacity-100">0{i+1}</span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto pb-12">
              <p className="section-label text-muted-foreground mb-2">Connect</p>
              <a href="mailto:kharajainam0@gmail.com" className="font-display text-xl hover:text-primary transition-colors">
                kharajainam0@gmail.com
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
