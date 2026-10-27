import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.therapywithdradya.com";
  const now = new Date();

  // Public marketing & functional pages
  const routes: {
    path: string;
    priority: number;
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  }[] = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/about", priority: 0.9, changeFrequency: "monthly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/sessions", priority: 0.9, changeFrequency: "monthly" },
    { path: "/book", priority: 0.9, changeFrequency: "daily" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/reviews", priority: 0.8, changeFrequency: "monthly" },
    { path: "/events", priority: 0.8, changeFrequency: "weekly" },
    { path: "/gallery", priority: 0.7, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms-and-cancellation", priority: 0.3, changeFrequency: "yearly" },
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
