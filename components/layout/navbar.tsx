"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ThemeSwitch } from "./theme-switch";
import { useLoaderDone } from "../PageLoader/useLoaderDone";

const NAV = [
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Certificates", href: "/certificates" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

interface NavLinkProps {
  item: typeof NAV[0];
  isActive: boolean;
}

function NavLink({ item, isActive }: NavLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={item.href}
      data-cursor="hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-full flex items-center justify-center font-mono text-[11px] font-bold uppercase tracking-[0.2em] select-none overflow-visible transition-colors duration-300 border-r border-border/40 first:border-l shrink-0 min-w-fit"
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
    >
      {/* 3D Vertical Flipping Card Section (Normal flow to size the link correctly) */}
      <motion.div
        className="h-full flex items-center justify-center px-4 lg:px-6"
        animate={{
          rotateX: isHovered ? 360 : 0,
          backgroundColor: isHovered
            ? "#D9281C"
            : isActive
            ? "rgba(217, 40, 28, 0.08)"
            : "rgba(0, 0, 0, 0)",
        }}
        transition={{
          rotateX: {
            type: "spring",
            stiffness: 120,
            damping: 20,
            mass: 1,
          },
          backgroundColor: {
            duration: 0.3,
            ease: "easeInOut",
          },
        }}
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "visible",
          willChange: "transform",
        }}
      >
        {/* Text Label - spins 3D coordinate-synced with its card background wrapper */}
        <span
          className={cn(
            "relative z-10 transition-colors duration-300 block whitespace-nowrap",
            isHovered
              ? "text-white"
              : isActive
              ? "text-primary"
              : "text-foreground"
          )}
          style={{ transform: "translateZ(1px)" }} // Tiny positive Z offset to guarantee absolute layered clarity
        >
          {item.label}
        </span>

        {/* Active Route bottom border highlighter indicator (Hidden during active rotation) */}
        {isActive && !isHovered && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#D9281C]" />
        )}
      </motion.div>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const logoSpanRef = useRef<HTMLSpanElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const done = useLoaderDone();
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("jk_loaded") === "true") {
      setIsSkipped(true);
    }
  }, []);

  useEffect(() => {
    const btn = menuBtnRef.current;
    if (!btn) return;
    btn.setAttribute("aria-expanded", menuOpen ? "true" : "false");
    if (menuOpen) {
      btn.setAttribute("aria-controls", "mobile-menu");
    } else {
      btn.removeAttribute("aria-controls");
    }
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* GSAP magnetic logo */
  useEffect(() => {
    const el = logoSpanRef.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    const move = (e: MouseEvent) => {
      const b = el.getBoundingClientRect();
      xTo((e.clientX - (b.left + b.width / 2)) * 0.3);
      yTo((e.clientY - (b.top + b.height / 2)) * 0.3);
    };
    const reset = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", reset);
    };
  }, []);

  return (
    <>
      <motion.header
        initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
        animate={done ? { clipPath: "inset(0 0 0% 0)", opacity: 1 } : { clipPath: "inset(0 0 100% 0)", opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: isSkipped ? 0.05 : 0.2 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 lg:px-8 transition-all duration-500 border-b-2 border-primary/80 bg-background/95 backdrop-blur-xl",
          scrolled ? "h-14 shadow-lg" : "h-16",
        )}
      >
        {/* Background Layer with Backdrop Filter */}
        <div className="absolute inset-0 bg-secondary/80 dark:bg-zinc-950/90 backdrop-blur-xl -z-10 pointer-events-none" />
        {/* Brand Segment (High-contrast Serif Display Typography with Right Border divider) */}
        <div className="flex items-center h-full border-r border-border/40 pr-8 md:pr-12">
          <Link
            ref={logoRef}
            href="/"
            data-cursor="hover"
            className="flex items-center gap-3 hover:text-primary transition-colors duration-300 group"
          >
            <span
              ref={logoSpanRef}
              className="inline-flex items-center justify-center w-9 h-9 text-foreground relative select-none"
            >
              <svg
                className="w-full h-full text-foreground"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Subtle blueprint frame grid box */}
                <rect
                  x="2"
                  y="2"
                  width="28"
                  height="28"
                  className="stroke-border/40 origin-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:stroke-primary/25 group-hover:scale-[1.04]"
                  strokeWidth="0.8"
                  strokeDasharray="3 3"
                />
                
                {/* Left Code Bracket (<) */}
                <path
                  d="M 10 10 L 4 16 L 10 22"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="origin-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-x-[2.5px] group-hover:-rotate-[6deg]"
                />
                
                {/* The Slash (/) in Vermilion Red */}
                <line
                  x1="13.5"
                  y1="23.5"
                  x2="18.5"
                  y2="8.5"
                  stroke="#D9281C"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="origin-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[15deg] group-hover:scale-[1.05]"
                />
                
                {/* Right Code Bracket (>) */}
                <path
                  d="M 22 10 L 28 16 L 22 22"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="origin-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-[2.5px] group-hover:rotate-[6deg]"
                />
              </svg>
            </span>
            <span className="hidden sm:inline-block font-display font-black text-xl italic tracking-tight text-[#D9281C]">
              Jainam
            </span>
          </Link>
        </div>

        {/* Desktop Nav Links (Segmented Brutalist block grid cells with full-height display) */}
        <nav className="hidden lg:flex items-center h-full">
          {NAV.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        {/* Actions Segment with Left Border divider */}
        <div className="hidden lg:flex items-center gap-6 h-full border-l border-border/40 pl-8 lg:pl-12">
          <ThemeSwitch />
          <Link
            href="/contact"
            data-cursor="hover"
            className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] px-6 py-2.5 bg-foreground text-background hover:bg-primary hover:text-white transition-all duration-300 border border-foreground/10 hover:border-primary hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#D9281C]"
          >
            Hire me
          </Link>
        </div>

        {/* Mobile controls (Compact fit) */}
        <div className="lg:hidden flex items-center gap-4 h-full">
          <ThemeSwitch />
          <button
            ref={menuBtnRef}
            className="flex flex-col gap-1.5 p-2 z-50 group"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7.5 : 0 }}
              transition={{ duration: 0.3 }}
              className="block w-5 h-[1.5px] bg-foreground group-hover:bg-primary transition-colors"
            />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="block w-5 h-[1.5px] bg-foreground group-hover:bg-primary transition-colors"
            />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7.5 : 0 }}
              transition={{ duration: 0.3 }}
              className="block w-5 h-[1.5px] bg-foreground group-hover:bg-primary transition-colors"
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-background flex flex-col justify-between px-6 md:px-12 pt-32 pb-12"
          >
            <div className="flex-grow flex flex-col justify-center">
              <nav className="flex flex-col gap-6 md:gap-8">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + 0.05 * i, duration: 0.4 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "font-display font-black text-[clamp(2.5rem,10vw,5rem)] leading-none transition-[color,transform] duration-300 block hover:text-primary hover:translate-x-3 w-fit",
                        pathname === item.href
                          ? "text-primary"
                          : "text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            <div className="mt-auto">
              <p className="section-label text-[10px] tracking-[0.25em] text-muted-foreground uppercase mb-2">
                Connect
              </p>
              <a
                href="mailto:kharajaynam@gmail.com"
                className="font-display text-xl hover:text-primary transition-colors duration-300"
              >
                kharajaynam@gmail.com
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
