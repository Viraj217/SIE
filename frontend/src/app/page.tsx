import Navigation from "@/components/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import ProofStrip from "@/components/sections/ProofStrip";
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
      <ProductsSection />
      <IndustriesSection />
      <TimelineSection />
      <ContactSection />

      <footer className="py-10 bg-slate relative z-20 border-t border-white/[0.04]">
        <div className="max-w-[1300px] mx-auto px-8 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
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
