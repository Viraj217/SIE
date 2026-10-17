import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products/", "/steel-grades/", "/tools/", "/contact"],
        disallow: ["/admin", "/api"],
      },
      // Disallow known AI training crawlers per robots exclusion standard.
      { userAgent: "GPTBot", disallow: ["/"] },
      { userAgent: "CCBot", disallow: ["/"] },
      { userAgent: "Google-Extended", disallow: ["/"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
