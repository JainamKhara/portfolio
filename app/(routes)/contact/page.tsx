// app/(routes)/contact/page.tsx
"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ContactForm } from "@/components/contact/contact-form";
import { socialLinks } from "@/data/social";
import { Github, Linkedin, Mail, Phone, ArrowUpRight } from "lucide-react";
import { scrambleText } from "@/lib/animations";

const iconMap: Record<string, React.ReactNode> = {
  github:   <Github   className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  mail:     <Mail     className="h-5 w-5" />,
  phone:    <Phone    className="h-5 w-5" />,
};

export default function ContactPage() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef  = useRef<HTMLDivElement>(null);
  const inView   = useInView(formRef, { once: true, margin: "-10%" });

  useEffect(() => {
    const t = setTimeout(() => {
      if (titleRef.current) scrambleText(titleRef.current, "CONTACT", 1000);
    }, 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen">
      {/* ── Page Hero ── */}
      <div className="relative min-h-[50vh] flex flex-col justify-end pt-28 pb-16 px-6 md:px-12 lg:px-20 border-b border-border overflow-hidden">
        {/* Ambient glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 80%, rgba(201,168,76,0.05) 0%, transparent 70%)",
          }}
        />

        <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-display font-black text-[18vw] text-foreground/[0.02] uppercase leading-none">
            TALK
          </span>
        </div>

        <motion.p
          className="section-label mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Let&apos;s Connect
        </motion.p>

        <h1 ref={titleRef} className="font-display font-black text-[clamp(3rem,9vw,7rem)] leading-none tracking-tight mb-8">
          ███████
        </h1>

        <div className="glow-line" />
      </div>

      {/* ── Content ── */}
      <div ref={formRef} className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[70vh]">
        {/* Left — Form */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="p-8 md:p-16 border-b lg:border-b-0 lg:border-r border-border"
        >
          <p className="section-label mb-6">Send a message</p>
          <ContactForm />
        </motion.div>

        {/* Right — Info */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="p-8 md:p-16 flex flex-col justify-between"
        >
          <div>
            <p className="section-label mb-8">Or reach out directly</p>

            <div className="space-y-4">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 + i * 0.1 }}
                  className="group flex items-center justify-between border border-border p-4 hover:border-primary/50 hover:bg-primary/5 transition-all duration-400"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-primary">{iconMap[social.icon]}</div>
                    <div>
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">{social.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                        {social.url.replace(/(mailto:|tel:|https:\/\/)/g, "")}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="section-label mb-3 text-muted-foreground">Location</p>
            <p className="font-display font-bold text-2xl">Ahmedabad, Gujarat</p>
            <p className="text-muted-foreground text-sm mt-1">India · GMT+5:30</p>

            <div className="mt-6 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Available for freelance &amp; internships
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}