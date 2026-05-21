"use client";

import type { Ref } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface IDCardUIProps {
  isDragging?: boolean;
  innerRef?: Ref<HTMLDivElement>;
}

export function IDCardUI({ isDragging, innerRef }: IDCardUIProps) {
  return (
    <div
      ref={innerRef}
      className={cn(
        "relative select-none rounded-[1.6rem] pointer-events-auto transition-all duration-500",
        // Multi-layered clear/frosted polycarbonate bevel border container
        "p-[4px]",
        "bg-gradient-to-br from-white/95 via-white/35 to-black/25 dark:from-white/18 dark:via-white/5 dark:to-black/60",
        "border border-black/[0.12] dark:border-white/[0.1]",
        // Highly visible 3D physical depth shadow system
        isDragging 
          ? "shadow-[0_45px_85px_rgba(0,0,0,0.22),_0_20px_40px_rgba(0,0,0,0.12),_inset_0_1.5px_2px_rgba(255,255,255,0.65),_inset_0_-1.5px_2px_rgba(0,0,0,0.25)] dark:shadow-[0_45px_85px_rgba(0,0,0,0.75),_0_20px_40px_rgba(0,0,0,0.45),_inset_0_1.5px_2px_rgba(255,255,255,0.2),_inset_0_-1.5px_2px_rgba(0,0,0,0.65)]" 
          : "shadow-[0_22px_50px_rgba(0,0,0,0.12),_0_8px_18px_rgba(0,0,0,0.06),_inset_0_1px_1.5px_rgba(255,255,255,0.5),_inset_0_-1px_1.5px_rgba(0,0,0,0.2)] dark:shadow-[0_22px_50px_rgba(0,0,0,0.55),_0_8px_18px_rgba(0,0,0,0.3),_inset_0_1px_1.5px_rgba(255,255,255,0.12),_inset_0_-1px_1.5px_rgba(0,0,0,0.5)]"
      )}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        transformStyle: "preserve-3d",
      }}
    >
      {/* ── Polycarbonate Glass Sheen Overlays ── */}
      <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] border border-white/60 dark:border-white/10" />
      <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] dark:via-transparent dark:to-white/[0.04]" />

      {/* ── Inner card core representing the laminated printed badge stock ── */}
      <div 
        className={cn(
          "relative overflow-hidden rounded-[1.32rem] h-full w-full",
          "bg-card bg-gradient-to-br from-card via-card/99 to-background/96",
          "border border-black/[0.08] dark:border-white/[0.04]",
          "shadow-[inset_0_2px_3px_rgba(0,0,0,0.03),_inset_0_-2px_3px_rgba(255,255,255,0.3)] dark:shadow-[inset_0_2px_3px_rgba(0,0,0,0.2),_inset_0_-2px_3px_rgba(255,255,255,0.03)]"
        )}
      >
        {/* ── Graphic Accent Overlays ── */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(0,0,0,0.03),transparent_70%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.07),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 rounded-[1.32rem] border border-foreground/[0.05] dark:border-white/[0.03]" />
        <div className="pointer-events-none absolute inset-0 rounded-[1.32rem] shadow-[inset_0_0_0_1px_rgba(217,40,28,0.06)]" />
        
        {/* Editorial side technical ticks */}
        <div className="pointer-events-none absolute inset-y-8 left-0 w-px bg-foreground/[0.04] dark:bg-white/5" />
        <div className="pointer-events-none absolute inset-y-8 right-0 w-px bg-foreground/[0.04] dark:bg-black/40" />

        {/* Top hanger notch/eyelet clip - aligned relative to inner card core */}
        <div
          aria-hidden
          className="absolute left-1/2 top-[12px] z-20 h-6 w-6 -translate-x-1/2 rounded-full border-2 border-primary/45 dark:border-primary/55 bg-[linear-gradient(180deg,rgba(250,240,240,0.95)_0%,rgba(230,180,180,0.88)_36%,rgba(217,40,28,0.4)_100%)] dark:bg-[linear-gradient(180deg,rgba(255,240,240,0.95)_0%,rgba(220,100,100,0.88)_36%,rgba(150,20,20,0.96)_100%)] shadow-[0_8px_18px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_18px_rgba(0,0,0,0.36)]"
        >
          <div className="absolute inset-x-[3px] top-[3px] h-[2px] rounded-full bg-white/75" />
          <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background dark:bg-[#09090c] shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]" />
        </div>

        {/* ── Primary Layout Container ── */}
        <div className="relative px-6 pb-6 pt-12">
          
          {/* ── Top Header Bar ── */}
          <div className="mb-5 flex items-center justify-between border-b border-border/40 pb-3.5">
            <div>
              <p className="font-mono text-[8.5px] uppercase tracking-[0.3em] text-primary font-bold">
                Identity Access Card
              </p>
              <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.24em] text-muted-foreground/80">
                Corporate Directory
              </p>
            </div>
            <div className="rounded-md border border-foreground/10 dark:border-white/8 bg-foreground/5 dark:bg-white/[0.03] px-2.5 py-0.5 animate-pulse">
              <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-foreground/75 dark:text-foreground/60">
                SYS-VER // 2026
              </span>
            </div>
          </div>

          {/* ── Portrait Profile Picture ── */}
          <div className="relative overflow-hidden rounded-[1rem] border border-border bg-foreground/[0.02] dark:bg-black shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05),0_12px_22px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02),0_12px_22px_rgba(0,0,0,0.2)] mb-5">
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.03] dark:opacity-[0.045] mix-blend-multiply dark:mix-blend-screen" style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }} />
            
            <div className="relative aspect-[4/4] w-full">
              <Image
                src="/images/profile.jpg"
                alt="Jainam Khara"
                fill
                priority
                draggable={false}
                sizes="(max-width: 640px) 300px, 360px"
                className="object-cover grayscale contrast-[1.12] brightness-[0.9] hover:grayscale-0 transition-all duration-700"
                style={{ objectPosition: "50% 18%" }}
              />
            </div>
          </div>

          {/* ── Details Segment ── */}
          <div className="grid grid-cols-12 gap-3 items-start">
            {/* Left Side: Giant Name & Title */}
            <div className="col-span-7">
              <h2 className="font-display text-[1.85rem] sm:text-[2.1rem] md:text-[2.35rem] font-black leading-[0.88] tracking-tighter text-foreground select-none">
                Jainam
                <br />
                Khara
              </h2>
              <p className="mt-2.5 font-mono text-[7.5px] uppercase tracking-[0.24em] text-primary font-bold">
                Full-Stack Developer
              </p>
            </div>

            {/* Right Side: Status & Tech stack */}
            <div className="col-span-5 flex flex-col items-end text-right justify-between self-stretch py-0.5">
              <div className="flex items-center gap-1.5 border border-primary/20 bg-primary/[0.04] rounded px-2 py-0.5 w-fit">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                <span className="font-mono text-[6px] tracking-wider uppercase text-primary font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="flex flex-col gap-1 mt-4 items-end">
                <span className="font-mono text-[5.5px] text-muted-foreground/60 tracking-wider">CORE TECH STACK:</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {["NEXTJS", "TAILWIND", "TYPESCRIPT", "SUPABASE"].map((tech) => (
                    <span 
                      key={tech}
                      className="font-mono text-[6px] font-bold border border-border/80 bg-foreground/[0.02] dark:bg-white/[0.03] text-foreground/80 px-1 py-[1px] rounded-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom Grid Segment (Metadata) ── */}
          <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-border/40">
            {/* Location Block */}
            <div className="flex flex-col gap-1 border-r border-border/30 pr-4">
              <span className="font-mono text-[6.5px] tracking-widest text-muted-foreground uppercase">LOCATION</span>
              <span className="font-mono text-[9.5px] tracking-wide text-foreground uppercase font-medium">AHMEDABAD, IN</span>
            </div>
            {/* Status Block */}
            <div className="flex flex-col gap-1 pl-4 text-right">
              <span className="font-mono text-[6.5px] tracking-widest text-muted-foreground uppercase">STATUS</span>
              <span className="font-mono text-[9.5px] tracking-wide text-primary uppercase font-bold">AVAILABLE</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
