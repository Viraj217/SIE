import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

import FloatingActions from "@/components/FloatingActions";
import MobileStickyBar from "@/components/MobileStickyBar";
import Analytics from "@/components/Analytics";
import ActionAnalytics from "@/components/ActionAnalytics";
import { LocalBusinessSchemaMarkup } from "@/components/SchemaMarkup";
import { SITE_URL, businessInfo, generateLocalBusinessSchema } from "@/lib/seo";
import { CANONICAL_PRODUCTS } from "@/lib/config";
import { Suspense } from "react";
import VercelObservability from "@/components/VercelObservability";

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
    // B2B commercial modifiers: Stockist, Mumbai, grade callouts drive procurement searches.
    default:
      "Shah Industrial Enterprise | Steel Stockist, Darukhana Mumbai",
    template: "%s | Shah Industrial Enterprise",
  },
  description:
    "Steel stockist & iron merchant at Darukhana, Mazgaon, Mumbai since 1961. Supplying heavy steamer shafts, EN8, EN24 (AISI 4340) alloy round bars, forged rounds & custom hacksaw cutting. Dispatch from Mazgaon yard. Call +91 98200 23666.",
  keywords: [
    "steel stockist Mumbai",
    "steel merchant Darukhana",
    "iron and steel merchant Mumbai",
    "steel supplier Mazgaon",
    "heavy steamer shafts Mumbai",
    "forged steel round bars Mumbai",
    "custom hacksaw cutting Mumbai",
    "cut to size steel Mumbai",
    "EN8 steel supplier Mumbai",
    "EN9 round bar Mumbai",
    "EN19 AISI 4140 steel Mumbai",
    "EN24 AISI 4340 steel Mumbai",
    "EN31 bearing steel Mumbai",
    "C45 carbon steel Mumbai",
  ],
  applicationName: businessInfo.name,
  authors: [{ name: businessInfo.name, url: SITE_URL }],
  creator: businessInfo.name,
  publisher: businessInfo.name,
  category: "Industrial steel stockist and supplier",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title:
      "Shah Industrial Enterprise — Steel Stockist & Merchant, Darukhana Mumbai",
    description:
      "Steel stockist & iron merchant at Darukhana, Mazgaon, Mumbai since 1961. EN8, EN24 (AISI 4340) alloy bars, heavy steamer shafts, forged rounds & hacksaw cutting. Fast dispatch from the Mazgaon yard.",
    url: "/",
    siteName: "Shah Industrial Enterprise",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-social.png",
        width: 1200,
        height: 630,
        alt: "Shah Industrial Enterprise — Industrial Steel Stockist, Darukhana, Mumbai",
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
    title: "Shah Industrial Enterprise — Steel Stockist, Mumbai",
    description:
      "Steel stockist & iron merchant at Darukhana, Mazgaon, Mumbai since 1961. EN8, EN24, alloy bars, forged rounds, hacksaw cutting.",
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
  // Generated once at build time; XSS-safe via safeJsonLd in SchemaMarkup.
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${fraunces.variable} ${ibmPlexMono.variable} antialiased pb-[calc(76px+env(safe-area-inset-bottom))] md:pb-0`}
      >
        {/*
         * LocalBusiness JSON-LD is injected at the root layout level so
         * every page on the site carries the business entity schema.
         * Individual pages (homepage, products, grades) may add their own
         * additional Product / BreadcrumbList schemas on top.
         */}
        <LocalBusinessSchemaMarkup schema={localBusinessSchema} />
        {children}
        <FloatingActions />
        <MobileStickyBar />
        <Analytics />
        <Suspense fallback={null}>
          <ActionAnalytics />
        </Suspense>
        <VercelObservability />
      </body>
    </html>
  );
}
