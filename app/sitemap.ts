import { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { certificates } from "@/data/certificates";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://jainamkhara.app";

  // 1. Core static page routes
  const staticRoutes = [
    "",
    "/about",
    "/experience",
    "/projects",
    "/certificates",
    "/contact",
  ];

  const staticMaps = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Dynamic project page routes
  const projectMaps = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 3. Dynamic certificate page routes
  const certificateMaps = certificates.map((cert) => ({
    url: `${baseUrl}/certificates/${cert.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticMaps, ...projectMaps, ...certificateMaps];
}
