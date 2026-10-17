import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { CANONICAL_PRODUCTS } from "@/lib/config";
import { STEEL_GRADES } from "@/lib/grades";

export default function sitemap(): MetadataRoute.Sitemap {
  // Build date — used as lastModified for static routes.
  const buildDate = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/steel-grades`,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/weight-calculator`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/contact`,
      // Contact details change infrequently; signal yearly to avoid wasted crawl budget.
      lastModified: new Date("2025-01-01"),
      changeFrequency: "yearly",
      priority: 0.9,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = CANONICAL_PRODUCTS.map((prod) => ({
    url: `${SITE_URL}/products/${prod.slug}`,
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority: prod.isFeatured ? 0.9 : 0.85,
  }));

  const gradeRoutes: MetadataRoute.Sitemap = STEEL_GRADES.map((grade) => ({
    url: `${SITE_URL}/steel-grades/${grade.slug}`,
    lastModified: buildDate,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...productRoutes, ...gradeRoutes];
}

