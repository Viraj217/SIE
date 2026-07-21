import type { Metadata } from "next";
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import FloatingActions from "@/components/FloatingActions";
import { SITE_URL, businessInfo } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Shah Industrial Enterprise | Steel & Iron Merchants in Mumbai",
    template: "%s | Shah Industrial Enterprise",
  },
  description: "Steel and iron merchants in Mazgaon, Mumbai supplying custom-cut shafts, rods, alloy bars, and industrial raw materials since 1989.",
  keywords: [
    "steel supplier Mumbai",
    "iron merchant Mumbai",
    "steel merchant Darukhana",
    "steel supplier Mazgaon",
    "MS shafts",
    "mild steel shaft supplier",
    "carbon steel rods",
    "EN8 EN19 EN24 bars",
    "custom hacksaw cutting",
    "cut to size steel Mumbai",
    "Darukhana Mazgaon steel",
    ...businessInfo.products,
    ...businessInfo.industries,
  ],
  applicationName: businessInfo.name,
  authors: [{ name: businessInfo.name }],
  creator: businessInfo.name,
  publisher: businessInfo.name,
  category: "Industrial steel supplier",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Shah Industrial Enterprise",
    description: "Custom-cut steel shafts, rods, alloy bars, and heavy industrial raw materials from Mazgaon, Mumbai.",
    url: "/",
    siteName: "Shah Industrial Enterprise",
    locale: "en_IN",
    type: "website",
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
  },
  robots: {
    index: true,
    follow: true,
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
        className={`${inter.variable} ${fraunces.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <FloatingActions />
      </body>
    </html>
  );
}
