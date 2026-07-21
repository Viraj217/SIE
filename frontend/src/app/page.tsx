import Navigation from "@/components/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import ProofStrip from "@/components/sections/ProofStrip";
import OperatingPromise from "@/components/sections/OperatingPromise";
import ProductsSection from "@/components/sections/ProductsSection";
import IndustriesSection from "@/components/sections/IndustriesSection";
import TrustSection from "@/components/sections/TrustSection";
import TimelineSection from "@/components/sections/TimelineSection";
import FaqSection from "@/components/sections/FaqSection";
import ContactSection from "@/components/sections/ContactSection";
import { SITE_URL, businessInfo, seoFaqs } from "@/lib/seo";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "Store"],
        "@id": `${SITE_URL}/#business`,
        name: businessInfo.name,
        legalName: businessInfo.legalName,
        url: SITE_URL,
        foundingDate: businessInfo.founded,
        description: businessInfo.description,
        telephone: businessInfo.phones,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: businessInfo.address.street,
          addressLocality: businessInfo.address.locality,
          addressRegion: businessInfo.address.region,
          postalCode: businessInfo.address.postalCode,
          addressCountry: businessInfo.address.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: businessInfo.coordinates.latitude,
          longitude: businessInfo.coordinates.longitude,
        },
        areaServed: businessInfo.serviceAreas.map((area) => ({ "@type": "Place", name: area })),
        knowsAbout: [...businessInfo.products, ...businessInfo.industries],
        makesOffer: businessInfo.products.map((product) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": product.toLowerCase().includes("cutting") ? "Service" : "Product",
            name: product,
          },
        })),
        contactPoint: businessInfo.contacts.map((contact) => ({
          "@type": "ContactPoint",
          name: contact.name,
          telephone: contact.phone,
          contactType: "sales",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        })),
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "09:00",
            closes: "19:00",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: businessInfo.name,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#business` },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faqs`,
        mainEntity: seoFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-paper text-slate">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navigation />
      <HeroSection />
      <ProofStrip />
      <OperatingPromise />
      <ProductsSection />
      <IndustriesSection />
      {/* <TrustSection /> */}
      <TimelineSection />
      <ContactSection />
      <FaqSection />

      <footer className="relative z-20 border-t border-white/[0.04] bg-slate py-8 sm:py-10">
        <div className="mx-auto flex max-w-[1300px] flex-col items-center justify-between gap-3 px-5 sm:gap-4 sm:px-8 md:flex-row md:px-12">
          <p className="font-mono text-[0.7rem] text-white/60 tracking-[0.15em] uppercase">
            © {new Date().getFullYear()} Shah Industrial Enterprise
          </p>
          <p className="font-mono text-[0.65rem] text-white/50 tracking-wider">
            Darukhana, Mazgaon — Mumbai 400010
          </p>
        </div>
      </footer>
    </main>
  );
}
