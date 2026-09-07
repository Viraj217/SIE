import type { Metadata } from "next";

/**
 * The calculator page itself is a client component and so cannot export
 * metadata. Without this layout it inherited the site-wide default title and
 * had no canonical of its own, while still being listed in the sitemap.
 */
export const metadata: Metadata = {
  title: "Steel Weight Calculator — Round Bar, Pipe, Flat & Hex",
  description:
    "Free steel weight calculator for round bars, shafts, seamless pipes, square, flat and hexagonal sections. Enter dimensions in mm to get weight in kg and metric tonnes.",
  alternates: { canonical: "/tools/weight-calculator" },
  openGraph: {
    title: "Steel Weight Calculator — Round Bar, Pipe, Flat & Hex",
    description:
      "Calculate theoretical steel weight in kg and metric tonnes for round bars, shafts, pipes and profiles before raising an enquiry.",
    url: "/tools/weight-calculator",
    type: "website",
    images: [{ url: "/og-social.png", width: 1731, height: 909, alt: "Shah Industrial Enterprise — Industrial Steel and Shafting, Darukhana, Mumbai" }],
  },
};

export default function WeightCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
