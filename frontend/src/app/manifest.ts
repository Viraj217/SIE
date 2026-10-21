import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shah Industrial Enterprise",
    short_name: "Shah Industrial",
    description:
      "Steel stockist & iron merchant at Darukhana, Mazgaon, Mumbai since 1961.",
    start_url: "/",
    display: "standalone",
    background_color: "#16232B",
    theme_color: "#16232B",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
