"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import gsap from "gsap";

const NAV = [
  { label: "Work",        href: "/projects"     },
  { label: "About",       href: "/about"        },
  { label: "Experience",  href: "/experience"   },
  { label: "Certs",       href: "/certificates" },
  { label: "Contact",     href: "/contact"      },
];

export function Navbar() {
  const pathname   = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const logoRef    = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
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
          "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 transition-all duration-300",
          scrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent",
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          data-cursor="hover"
          className="flex items-center gap-2.5 font-display font-black text-lg tracking-tight hover:text-primary transition-colors duration-300 group"
        >
          <span ref={logoRef} className="inline-flex items-center justify-center w-7 h-7 bg-primary text-white font-mono font-bold text-xs">
            JK
          </span>
          <span>Jainam</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-cursor="hover"
              className={cn(
                "font-mono text-[11px] uppercase tracking-widest transition-colors duration-300 relative pb-0.5",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
              {pathname === item.href && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-0.5 left-0 right-0 h-px bg-primary"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Hire me CTA */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            data-cursor="hover"
            className="font-mono text-[11px] uppercase tracking-widest px-4 py-2 border border-border bg-background hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
          >
            Hire me
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 z-50"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }} transition={{ duration: 0.3 }} className="block w-6 h-[1.5px] bg-foreground" />
          <motion.span animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }} transition={{ duration: 0.2 }} className="block w-6 h-[1.5px] bg-foreground" />
          <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }} transition={{ duration: 0.3 }} className="block w-6 h-[1.5px] bg-foreground" />
        </button>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: "0%" }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-background flex flex-col justify-center px-10"
          >
            <nav className="flex flex-col gap-5">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "font-display font-black text-[clamp(2.5rem,9vw,4.5rem)] leading-none transition-colors duration-300",
                      pathname === item.href ? "text-primary" : "hover:text-primary",
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="section-label text-muted-foreground">kharajainam0@gmail.com</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
