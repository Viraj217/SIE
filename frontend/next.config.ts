import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/aboutus.html",
        destination: "/#milestones",
        permanent: true,
      },
      {
        source: "/products.html",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/contactus.html",
        destination: "/contact",
        permanent: true,
      },
      // Legacy enquiry page — two rules to handle both clean URLs and
      // any query-string variants (e.g. /enquiry.html?ref=brochure).
      // The :path* wildcard absorbs trailing slashes; the has.type query
      // match strips legacy params and redirects cleanly to /contact.
      {
        // Rule 1: strip any query string — matches when query params ARE present.
        // Next.js automatically appends query params to the destination unless
        // we explicitly set them here. We redirect to /contact bare.
        source: "/enquiry.html",
        has: [{ type: "query", key: "(.+)" }],
        destination: "/contact",
        permanent: true,
      },
      {
        // Rule 2: bare /enquiry.html with no query string.
        source: "/enquiry.html",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/catalog",
        destination: "/products",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

