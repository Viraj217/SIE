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
        destination: "/catalog",
        permanent: true,
      },
      {
        source: "/contactus.html",
        destination: "/#contact",
        permanent: true,
      },
      {
        source: "/enquiry.html",
        destination: "/#contact",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
