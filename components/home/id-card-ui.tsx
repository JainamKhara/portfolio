"use client";

import type { Ref } from "react";
import Image from "next/image";

interface IDCardUIProps {
  isDragging?: boolean;
  innerRef?: Ref<HTMLDivElement>;
}

export function IDCardUI({ isDragging, innerRef }: IDCardUIProps) {
  return (
    <div
      ref={innerRef}
      className="relative select-none overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0c0c10] pointer-events-auto"
      style={{
        background:
          "linear-gradient(160deg, rgba(18,18,24,0.98) 0%, rgba(10,10,14,0.995) 58%, rgba(17,14,24,0.985) 100%)",
        boxShadow: isDragging
          ? "0 30px 66px rgba(0,0,0,0.74), 0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -16px 28px rgba(0,0,0,0.22)"
          : "0 24px 50px rgba(0,0,0,0.66), 0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -14px 24px rgba(0,0,0,0.18)",
        cursor: isDragging ? "grabbing" : "grab",
        transformStyle: "preserve-3d",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] border border-white/[0.03]" />
      <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] shadow-[inset_0_0_0_1px_rgba(108,71,255,0.06)]" />
      <div className="pointer-events-none absolute inset-y-8 left-0 w-px bg-white/6" />
      <div className="pointer-events-none absolute inset-y-8 right-0 w-px bg-black/50" />
      <div className="pointer-events-none absolute left-3 right-3 top-3 h-7 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0))]" />

      <div
        aria-hidden
        className="absolute left-1/2 top-4 z-20 h-6 w-6 -translate-x-1/2 rounded-full border border-white/14 bg-[linear-gradient(180deg,rgba(245,242,255,0.95)_0%,rgba(177,150,243,0.88)_36%,rgba(78,56,146,0.96)_100%)] shadow-[0_8px_18px_rgba(0,0,0,0.36)]"
      >
        <div className="absolute inset-x-[3px] top-[3px] h-[2px] rounded-full bg-white/75" />
        <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#09090c] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
      </div>

      <div className="relative px-4 pb-4 pt-12">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-primary/90">
              Identity Card
            </p>
            <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.24em] text-muted-foreground/55">
              Corporate Access
            </p>
          </div>
          <div className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1">
            <span className="font-mono text-[7px] uppercase tracking-[0.22em] text-foreground/65">
              JK / 2026
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[1.15rem] border border-white/10 bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03),0_18px_26px_rgba(0,0,0,0.24)]">
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-background/72 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(112deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.04)_24%,transparent_46%,transparent_70%,rgba(255,255,255,0.07)_100%)]" />
          <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.045] mix-blend-screen" style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }} />
          <div className="pointer-events-none absolute inset-x-3 top-3 z-10 h-[1px] bg-white/22" />
          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 h-[1px] bg-black/28" />

          <div className="relative aspect-[4/5]">
            <Image
              src="/images/profile.jpg"
              alt="Jainam Khara"
              fill
              priority
              draggable={false}
              sizes="(max-width: 640px) 240px, 280px"
              className="object-cover grayscale contrast-[1.08] brightness-[0.92]"
              style={{ objectPosition: "50% 18%" }}
            />
          </div>
        </div>

        <div className="mt-5">
          <h2 className="font-display text-[2.12rem] font-black leading-[0.95] tracking-tight text-foreground [text-shadow:0_10px_22px_rgba(0,0,0,0.3)]">
            Jainam
            <br />
            Khara
          </h2>
          <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.32em] text-primary/90">
            Full-Stack Developer
          </p>
        </div>

        <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-[0.85rem] border border-white/7 bg-white/[0.02] px-3 py-2.5">
            <p className="font-mono text-[7px] uppercase tracking-[0.28em] text-muted-foreground/55">
              Location
            </p>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/76">
              Ahmedabad, India
            </p>
          </div>
          <div className="rounded-[0.85rem] border border-white/7 bg-white/[0.02] px-3 py-2.5 text-right">
            <p className="font-mono text-[7px] uppercase tracking-[0.28em] text-muted-foreground/55">
              Status
            </p>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-primary">
              Available
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-5 bottom-0 h-6 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.16))]" />
    </div>
  );
}
