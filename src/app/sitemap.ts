import type { MetadataRoute } from "next";
import { projects, designWorks, writingPosts } from "@/lib/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Static pages
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/design`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/writing`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.5 },
  ];

  // Project pages
  const projectRoutes = projects
    .filter((p) => p.visibility === "published")
    .map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  // Design pages
  const designRoutes = designWorks.map((d) => ({
    url: `${baseUrl}/design/${d.slug}`,
    lastModified: new Date(d.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Writing pages
  const writingRoutes = writingPosts
    .filter((p) => p.visibility === "published")
    .map((p) => ({
      url: `${baseUrl}/writing/${p.slug}`,
      lastModified: new Date(p.updatedAt || p.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...projectRoutes, ...designRoutes, ...writingRoutes];
}