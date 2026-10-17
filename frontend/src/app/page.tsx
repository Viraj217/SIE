import Navigation from "@/components/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import ProofStrip from "@/components/sections/ProofStrip";
import OperatingPromise from "@/components/sections/OperatingPromise";
import ProductsSection from "@/components/sections/ProductsSection";
import IndustriesSection from "@/components/sections/IndustriesSection";
import TimelineSection from "@/components/sections/TimelineSection";
import FaqSection from "@/components/sections/FaqSection";
import ContactSection from "@/components/sections/ContactSection";
import SiteFooter from '@/components/SiteFooter';

export default function Home() {
  return (
    <main className="min-h-screen bg-paper text-slate">
      {/*
       * LocalBusiness + WebSite + FAQPage JSON-LD is now injected globally
       * by the root layout via <LocalBusinessSchemaMarkup />.
       * No duplicate schema needed here.
       */}
      <Navigation />
      <HeroSection />
      <ProofStrip />
      <OperatingPromise />
      <ProductsSection />
      <IndustriesSection />
      <TimelineSection />
      <ContactSection />
      <FaqSection />

      <SiteFooter />
    </main>
  );
}

