import Navigation from "@/components/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import ProofStrip from "@/components/sections/ProofStrip";
import OperatingPromise from "@/components/sections/OperatingPromise";
import ProductsSection from "@/components/sections/ProductsSection";
import IndustriesSection from "@/components/sections/IndustriesSection";
import TimelineSection from "@/components/sections/TimelineSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-paper text-slate">
      <Navigation />
      <HeroSection />
      <ProofStrip />
      <OperatingPromise />
      <ProductsSection />
      <IndustriesSection />
      <TimelineSection />
      <ContactSection />

      <footer className="relative z-20 border-t border-white/[0.04] bg-slate py-8 sm:py-10">
        <div className="mx-auto flex max-w-[1300px] flex-col items-center justify-between gap-3 px-5 sm:gap-4 sm:px-8 md:flex-row md:px-12">
          <p className="font-mono text-[0.7rem] text-white/25 tracking-[0.15em] uppercase">
            © {new Date().getFullYear()} Shah Industrial Enterprise
          </p>
          <p className="font-mono text-[0.65rem] text-white/15 tracking-wider">
            Darukhana, Mazgaon — Mumbai 400010
          </p>
        </div>
      </footer>
    </main>
  );
}
