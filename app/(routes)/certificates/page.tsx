"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CertificateCard } from "@/components/certificates/certificate-card";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { certificates } from "@/data/certificates";

const allOrganizations = Array.from(
  new Set(certificates.map((cert) => cert.organization))
).sort();

export default function CertificatesPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const matchesOrganization =
        activeFilter === null || cert.organization === activeFilter;
      const matchesSearch =
        searchQuery === "" ||
        cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.organization.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesOrganization && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Header */}
        <SectionHeader
          title="Certifications & Credentials"
          subtitle="Professional certifications and course completions from industry-leading institutions"
        />

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 max-w-2xl mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search certificates by name or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-11 border-2 transition-colors focus:border-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge
              variant={activeFilter === null ? "default" : "outline"}
              className="cursor-pointer text-sm py-2 px-3 transition-all"
              onClick={() => setActiveFilter(null)}
            >
              All Certificates
            </Badge>
            {allOrganizations.map((org) => (
              <Badge
                key={org}
                variant={activeFilter === org ? "default" : "outline"}
                className="cursor-pointer text-sm py-2 px-3 transition-all"
                onClick={() => setActiveFilter(org)}
              >
                {org}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16">
          {filteredCertificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <CertificateCard {...cert} />
            </motion.div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredCertificates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No certificates found matching your search or filter. Try adjusting your criteria.
            </p>
          </div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="pt-16 border-t border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">
                {certificates.length}
              </div>
              <p className="text-muted-foreground">Total Certifications</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">
                {allOrganizations.length}
              </div>
              <p className="text-muted-foreground">Organizations</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10+</div>
              <p className="text-muted-foreground">Course Hours</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
