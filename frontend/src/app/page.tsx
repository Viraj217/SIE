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
import SiteFooter from '@/components/SiteFooter';
import { generateLocalBusinessSchema } from "@/lib/seo";

export default function Home() {
  const structuredData = generateLocalBusinessSchema();

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
      <TrustSection />
      <TimelineSection />
      <ContactSection />
      <FaqSection />

      <SiteFooter />
    </main>
  );
}
