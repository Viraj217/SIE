import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { CANONICAL_PRODUCTS } from "@/lib/config";
import { STEEL_GRADES } from "@/lib/grades";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/steel-grades`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/weight-calculator`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/llms.txt`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = CANONICAL_PRODUCTS.map((prod) => ({
    url: `${SITE_URL}/products/${prod.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: prod.isFeatured ? 0.9 : 0.85,
  }));

  const gradeRoutes: MetadataRoute.Sitemap = STEEL_GRADES.map((grade) => ({
    url: `${SITE_URL}/steel-grades/${grade.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...productRoutes, ...gradeRoutes];
}
