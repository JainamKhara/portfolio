"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Certificates
        </Button>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12 mb-12">
          {/* Main Content - Takes 2 columns */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                {certificate.name}
              </h1>

              <div className="text-base text-muted-foreground mb-6">
                <p className="mb-2">
                  <span className="font-semibold text-foreground">Issued by:</span> {certificate.organization}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Date:</span> {certificate.date}
                </p>
              </div>

              {/* Certificate Image - Contained with max-width */}
              {certificate.image && (
                <div className="mb-8">
                  <div className="max-w-2xl mx-auto rounded-lg overflow-hidden border-2 border-primary/20">
                    <Image
                      src={certificate.image}
                      alt={certificate.name}
                      className="object-contain w-full h-auto"
                      width={1200}
                      height={800}
                      priority
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">About This Certificate</h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {certificate.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Takes 1 column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-muted/50 rounded-lg border border-primary/10 p-6 h-fit sticky top-24">
              {/* Skills Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4">Skills Gained</h3>
                <div className="flex flex-wrap gap-2">
                  {certificate.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Certificate Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-3">Certificate Details</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Organization</p>
                      <p className="font-medium">{certificate.organization}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Completion Date</p>
                      <p className="font-medium">{certificate.date}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <Button className="w-full" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download Certificate
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
