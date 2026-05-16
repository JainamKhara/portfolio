"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { certificates, Certificate } from "@/data/certificates";

export default function CertificatePage() {
  const router = useRouter();
  const params = useParams();
  const [certificate, setCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    const slug = params?.slug?.toString() || "";

    const foundCert = certificates.find((c) => c.id === slug);
    if (foundCert) {
      setCertificate(foundCert);
    } else {
      router.push("/certificates");
    }
  }, [params, router]);

  if (!certificate) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-pulse text-center">
          <p>Loading certificate...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 md:py-32">
      <div className="container px-6 md:px-12 lg:px-20">
        <Button 
          variant="ghost" 
          className="mb-12 font-mono text-[10px] uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-3 w-3" />
          Back to Certificates
        </Button>

        <div className="grid gap-12 lg:grid-cols-3 lg:gap-20 mb-20">
          {/* Main Content - Takes 2 columns */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="section-label mb-4 text-primary">Certification</p>
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-7xl leading-[0.9] tracking-tighter mb-8 uppercase">
                {certificate.name}
              </h1>

              <div className="flex flex-wrap gap-x-12 gap-y-6 mb-12">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Issued by</span>
                  <span className="font-display font-bold text-xl">{certificate.organization}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Date</span>
                  <span className="font-display font-bold text-xl">{certificate.date}</span>
                </div>
              </div>

              {/* Certificate Image - Contained with max-width */}
              {certificate.image && (
                <motion.div 
                  className="mb-12"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  <div className="border border-border p-4 md:p-8 bg-card/30 relative group">
                    <Image
                      src={certificate.image}
                      alt={certificate.name}
                      className="object-contain w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-1000 shadow-2xl"
                      width={1200}
                      height={800}
                      priority
                    />
                    <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/20 transition-all duration-700 pointer-events-none" />
                  </div>
                </motion.div>
              )}

              {/* Description */}
              <div className="space-y-12">
                <div>
                  <h2 className="font-display font-black text-2xl uppercase tracking-tight mb-6 flex items-center gap-4">
                    <span className="w-8 h-px bg-primary" />
                    About This Certificate
                  </h2>
                  <p className="text-lg text-foreground/80 leading-relaxed font-serif italic">
                    {certificate.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Takes 1 column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-1"
          >
            <div className="bg-background border border-border p-8 h-fit sticky top-28 shadow-2xl shadow-primary/5">
              {/* Skills Section */}
              <div className="mb-10">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-6">Skills Verified</h3>
                <div className="flex flex-wrap gap-2">
                  {certificate.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-border bg-foreground/[0.02] text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border mb-10" />

              {/* Actions */}
              <div className="space-y-6">
                <Button className="w-full h-12 font-mono text-[10px] uppercase tracking-widest bg-foreground text-background hover:bg-primary transition-all">
                  <Download className="mr-2 h-4 w-4" />
                  Verify Document
                </Button>
                
                <p className="font-mono text-[9px] text-center text-muted-foreground uppercase tracking-[0.1em]">
                  ID: {certificate.id.toUpperCase()}
                </p>
              </div>

              <div className="mt-12 pt-8 border-t border-border">
                <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-2">Authority</p>
                <p className="font-display font-bold text-lg">{certificate.organization}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
