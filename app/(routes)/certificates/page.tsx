// app/(routes)/certificates/page.tsx
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { CertificateCard } from "@/components/certificates/certificate-card";
import { certificates } from "@/data/certificates";
import { Search, X } from "lucide-react";
import { scrambleText } from "@/lib/animations";

const allOrgs = Array.from(
  new Set(certificates.map((c) => c.organization)),
).sort();

export default function CertificatesPage() {
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);
  const statsView  = useInView(statsRef, { once: true, margin: "-10%" });

  const [filter, setFilter]   = useState<string | null>(null);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      if (titleRef.current) scrambleText(titleRef.current, "CERTIFICATES", 1200);
    }, 200);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(
    () =>
      certificates.filter((c) => {
        const matchOrg = !filter || c.organization === filter;
        const matchSearch =
          !search ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.organization.toLowerCase().includes(search.toLowerCase());
        return matchOrg && matchSearch;
      }),
    [filter, search],
  );

  const stats = [
    { value: certificates.length,   label: "Total Certifications" },
    { value: allOrgs.length,        label: "Organizations"        },
    { value: "10+",                 label: "Course Hours"         },
  ];

  return (
    <div className="min-h-screen">
      {/* ── Page Hero ── */}
      <div className="relative min-h-[40vh] flex flex-col justify-end pt-28 pb-16 px-6 md:px-12 lg:px-20 border-b border-border overflow-hidden">
        <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-display font-black text-[13vw] text-foreground/[0.02] uppercase leading-none">
            CERTS
          </span>
        </div>

        <motion.p className="section-label mb-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          Credentials
        </motion.p>
        <h1 ref={titleRef} className="font-display font-black text-[clamp(2.5rem,7vw,6rem)] leading-none tracking-tight mb-8">
          ████████████
        </h1>
        <div className="glow-line" />
      </div>

      {/* ── Search + Filter bar ── */}
      <div className="px-6 md:px-12 lg:px-20 py-8 border-b border-border">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search certificates…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-transparent border border-border font-mono text-[11px] uppercase tracking-widest text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter(null)}
              data-cursor="hover"
              className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-all duration-300 ${
                filter === null ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-foreground/30"
              }`}
            >
              All
            </button>
            {allOrgs.map((org) => (
              <button
                key={org}
                onClick={() => setFilter(org === filter ? null : org)}
                data-cursor="hover"
                className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-all duration-300 ${
                  filter === org ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-foreground/30"
                }`}
              >
                {org}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="px-6 md:px-12 lg:px-20 py-16">
        <motion.p className="section-label text-muted-foreground mb-8">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </motion.p>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((cert, i) => (
              <motion.div
                key={cert.id}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
                className="group"
              >
                <div className="border border-border hover:border-primary/50 transition-all duration-500 overflow-hidden h-full relative">
                  <CertificateCard {...cert} />
                  {/* gold sweep */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-700" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              No certificates match. Try adjusting your search.
            </p>
          </div>
        )}
      </div>

      {/* ── Stats strip ── */}
      <div ref={statsRef} className="border-t border-border px-6 md:px-12 lg:px-20 py-16">
        <div className="grid grid-cols-3 gap-px bg-border">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              animate={statsView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
              className="bg-background p-10 text-center group hover:bg-primary/5 transition-colors duration-500"
            >
              <p className="font-display font-black text-4xl md:text-5xl text-primary mb-2 tabular-nums">
                {s.value}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
