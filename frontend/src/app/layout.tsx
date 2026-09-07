import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

import FloatingActions from "@/components/FloatingActions";
import MobileStickyBar from "@/components/MobileStickyBar";
import Analytics from "@/components/Analytics";
import ActionAnalytics from "@/components/ActionAnalytics";
import { SITE_URL, businessInfo } from "@/lib/seo";
import { CANONICAL_PRODUCTS } from "@/lib/config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#16232B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Shah Industrial Enterprise | Steamer Shafts, Forged Rounds & Iron Steel Merchants",
    template: "%s | Shah Industrial Enterprise",
  },
  description:
    "Iron and steel merchants in Darukhana, Mazgaon, Mumbai supplying heavy steamer shafts, carbon steel, alloy steel round bars (EN8, EN9, EN19, EN24), forged rounds, seamless pipes, and custom hacksaw cutting since 1989.",
  keywords: [
    "steel supplier Mumbai",
    "iron merchant Mumbai",
    "iron and steel merchants Mumbai",
    "heavy steamer shafts",
    "steamer shaft supplier",
    "forged rounds Mumbai",
    "hacksaw cutting specialist",
    "steel merchant Darukhana",
    "steel supplier Mazgaon",
    "MS shafts",
    "mild steel shaft supplier",
    "carbon steel rods",
    "EN8 EN19 EN24 bars",
    "custom hacksaw cutting",
    "cut to size steel Mumbai",
    "Darukhana Mazgaon steel",
    ...CANONICAL_PRODUCTS.map((p) => p.title),
    ...businessInfo.industries,
  ],
  applicationName: businessInfo.name,
  authors: [{ name: businessInfo.name, url: SITE_URL }],
  creator: businessInfo.name,
  publisher: businessInfo.name,
  category: "Industrial steel supplier",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Shah Industrial Enterprise — Forged for Strength, Cut to Precision",
    description:
      "Custom-cut steel shafts, alloy bars, and heavy industrial raw materials from Mazgaon, Mumbai since 1989.",
    url: "/",
    siteName: "Shah Industrial Enterprise",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-social.png",
        width: 1731,
        height: 909,
        alt: "Shah Industrial Enterprise — Industrial Steel and Shafting, Darukhana, Mumbai",
      },
    ],
  },
  other: {
    "geo.region": "IN-MH",
    "geo.placename": "Mazgaon, Mumbai",
    "geo.position": `${businessInfo.coordinates.latitude};${businessInfo.coordinates.longitude}`,
    ICBM: `${businessInfo.coordinates.latitude}, ${businessInfo.coordinates.longitude}`,
    "business:contact_data:locality": businessInfo.address.locality,
    "business:contact_data:region": businessInfo.address.region,
    "business:contact_data:postal_code": businessInfo.address.postalCode,
    "business:contact_data:country_name": "India",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shah Industrial Enterprise",
    description: "Steel and iron merchants in Mazgaon, Mumbai since 1989.",
    images: ["/og-social.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${fraunces.variable} ${ibmPlexMono.variable} antialiased pb-[72px] md:pb-0`}
      >
        {children}
        <FloatingActions />
        <MobileStickyBar />
        <Analytics />
        <ActionAnalytics />
      </body>
    </html>
  );
}
