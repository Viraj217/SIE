'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

function ProductCard({ title, tagline, specs, isFeatured = false, icon, children }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 25 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);
  const glowOpacity = useTransform(mouseXSpring, [-0.5, 0, 0.5], [0.2, 0, 0.2]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      variants={{
        hidden: { opacity: 0, y: 60, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
      }}
    className={`relative flex flex-col cursor-default overflow-hidden rounded-lg p-6 group sm:p-8 lg:p-10 ${
        isFeatured
          ? "bg-slate text-white ring-1 ring-cyan-glow/20"
          : "bg-white text-slate ring-1 ring-steel/10 shadow-[0_4px_40px_rgba(22,35,43,0.06)]"
      }`}
    >
      {/* Hover glow overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-lg"
        style={{
          opacity: glowOpacity,
          background: isFeatured
            ? 'radial-gradient(600px circle at var(--mouse-x,50%) var(--mouse-y,50%), rgba(143,216,212,0.1), transparent 50%)'
            : 'radial-gradient(600px circle at var(--mouse-x,50%) var(--mouse-y,50%), rgba(232,132,92,0.06), transparent 50%)'
        }}
      />

      <div style={{ transform: "translateZ(30px)" }}>
        {isFeatured ? (
          <span className="inline-flex items-center gap-2 font-mono text-[0.65rem] text-cyan-glow border border-cyan-glow/30 px-3 py-1.5 rounded-sm mb-6 uppercase tracking-wider bg-cyan-glow/5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse" />
            Featured Service
          </span>
        ) : (
          <div className="w-10 h-10 rounded-md bg-paper-warm flex items-center justify-center mb-6 group-hover:bg-dawn-coral/10 transition-colors duration-300">
            {icon}
          </div>
        )}
        <h3 className="text-[1.4rem] font-display font-semibold mb-2">{title}</h3>
        <p className={`text-[0.9rem] mb-6 leading-relaxed ${isFeatured ? 'text-white/50' : 'text-steel'}`}>
          {tagline}
        </p>
      </div>

      {/* Illustration */}
      <div className="mb-8 opacity-70 group-hover:opacity-100 transition-opacity duration-500" style={{ transform: "translateZ(40px)" }}>
        {children}
      </div>

      <div className="mt-auto" style={{ transform: "translateZ(20px)" }}>
        <ul className="flex flex-col gap-0 mb-6">
          {specs.map((spec: any, i: number) => (
            <li key={i} className={`flex justify-between gap-4 py-3 text-[0.8rem] border-b last:border-b-0 sm:text-[0.85rem] ${isFeatured ? 'border-white/8' : 'border-steel/8'}`}>
              <span className={`${isFeatured ? 'text-white/40' : 'text-steel/60'} font-mono`}>{spec.label}</span>
              <span className="text-right font-mono font-medium tracking-tight">{spec.value}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2.5 font-mono text-[0.75rem]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className={isFeatured ? 'text-white/50' : 'text-steel/60'}>Ready for Dispatch</span>
        </div>
      </div>
    </motion.div>
  );
}

const STATIC_PRODUCTS = [
  {
    slug: 'custom-hacksaw-cutting',
    title: 'Custom Hacksaw Cutting',
    tagline: 'Precision-cut to exact dimensions. No waste. Ready for your lathe or CNC machining center.',
    isFeatured: true,
    specs: [
      { label: "Capability", value: "Up to Ø 300mm" },
      { label: "Tolerance", value: "± 1.0mm" },
      { label: "Materials", value: "MS, Carbon, Alloy" },
      { label: "Turnaround", value: "Same day" }
    ],
    illustration: (
      <svg viewBox="0 0 240 100" width="100%" height="80">
        <line x1="20" y1="55" x2="220" y2="55" stroke="#8FD8D4" strokeWidth="8" strokeLinecap="round" />
        <line x1="20" y1="55" x2="140" y2="55" stroke="#8FD8D4" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
        <path d="M140,30 L140,80" stroke="#E8845C" strokeWidth="1.5" strokeDasharray="3,3" />
        <rect x="130" y="15" width="20" height="15" fill="none" stroke="#8FD8D4" strokeWidth="1" rx="1" />
        <path d="M130,30 L135,37 L140,30 L145,37 L150,30" stroke="#8FD8D4" strokeWidth="1" fill="none" />
        <circle cx="140" cy="22" r="2" fill="#E8845C" />
      </svg>
    )
  },
  {
    slug: 'mild-steel-shafts',
    title: 'Mild Steel Shafts',
    tagline: 'Bright and black finish steel shafting, available in standard and custom lengths for industrial applications.',
    isFeatured: false,
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#3C5C6B" strokeWidth="1.5">
        <line x1="2" y1="12" x2="22" y2="12" />
        <circle cx="7" cy="12" r="2" />
        <circle cx="17" cy="12" r="2" />
      </svg>
    ),
    specs: [
      { label: "Diameter", value: "Ø 12 – 250mm" },
      { label: "Lengths", value: "3m to 6m std." },
      { label: "Standard", value: "IS 2062 A/B" }
    ],
    illustration: (
      <svg viewBox="0 0 240 100" width="100%" height="80">
        <rect x="20" y="38" width="200" height="24" rx="12" fill="none" stroke="#3C5C6B" strokeWidth="1.5" />
        <line x1="60" y1="38" x2="60" y2="62" stroke="#3C5C6B" strokeWidth="0.5" strokeDasharray="2,2" />
        <line x1="120" y1="38" x2="120" y2="62" stroke="#3C5C6B" strokeWidth="0.5" strokeDasharray="2,2" />
        <line x1="180" y1="38" x2="180" y2="62" stroke="#3C5C6B" strokeWidth="0.5" strokeDasharray="2,2" />
        <line x1="20" y1="75" x2="220" y2="75" stroke="rgba(60,92,107,0.3)" strokeWidth="0.5" />
        <text x="110" y="85" textAnchor="middle" fill="rgba(60,92,107,0.4)" fontSize="8" fontFamily="monospace">6000mm</text>
      </svg>
    )
  },
  {
    slug: 'carbon-steel-rods',
    title: 'Carbon Steel Rods',
    tagline: 'High-tensile forged bars in EN8, EN9, EN19, and EN24 grades. Normalized for consistent machinability.',
    isFeatured: false,
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#3C5C6B" strokeWidth="1.5">
        <rect x="2" y="10" width="20" height="4" rx="1" />
        <line x1="6" y1="10" x2="6" y2="14" />
        <line x1="12" y1="10" x2="12" y2="14" />
        <line x1="18" y1="10" x2="18" y2="14" />
      </svg>
    ),
    specs: [
      { label: "Grades", value: "EN8/9/19/24" },
      { label: "Finish", value: "Forged, Peeled" },
      { label: "Hardness", value: "Normalized" }
    ],
    illustration: (
      <svg viewBox="0 0 240 100" width="100%" height="80">
        <rect x="20" y="40" width="200" height="20" rx="2" fill="none" stroke="#3C5C6B" strokeWidth="1.5" />
        <g stroke="rgba(60,92,107,0.15)" strokeWidth="0.5">
          <line x1="40" y1="40" x2="50" y2="60" />
          <line x1="60" y1="40" x2="70" y2="60" />
          <line x1="80" y1="40" x2="90" y2="60" />
          <line x1="100" y1="40" x2="110" y2="60" />
          <line x1="120" y1="40" x2="130" y2="60" />
          <line x1="140" y1="40" x2="150" y2="60" />
          <line x1="160" y1="40" x2="170" y2="60" />
          <line x1="180" y1="40" x2="190" y2="60" />
        </g>
        <rect x="85" y="70" width="70" height="16" rx="2" fill="none" stroke="rgba(60,92,107,0.25)" strokeWidth="0.5" />
        <text x="120" y="81" textAnchor="middle" fill="rgba(60,92,107,0.4)" fontSize="8" fontFamily="monospace">EN8 / EN24</text>
      </svg>
    )
  }
];

export default function ProductsSection() {
  const [products, setProducts] = useState<any[]>(STATIC_PRODUCTS);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/products`);
        const result = await res.json();
        
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          const merged = result.data.map((dbProd: any) => {
            const match = STATIC_PRODUCTS.find((p) => p.slug === dbProd.slug);
            return {
              ...dbProd,
              specs: dbProd.specs.map((s: any) => ({ label: s.label, value: s.value })),
              illustration: match?.illustration || STATIC_PRODUCTS[1].illustration,
              icon: match?.icon || STATIC_PRODUCTS[1].icon,
            };
          });
          setProducts(merged);
        }
      } catch (err) {
        console.warn('Could not load products from API, using static fallbacks', err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section id="products" className="relative z-20 bg-paper py-20 noise-overlay sm:py-28 lg:py-36" style={{ perspective: "1200px" }}>
      <div className="relative z-10 mx-auto max-w-[1200px] px-5 sm:px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-[650px] mb-16 lg:mb-24"
        >
          <span className="section-tag">CATALOG</span>
          <h2 className="section-title">Quality on Demand</h2>
          <p className="section-desc">Raw materials processed to absolute specifications. Ready for dispatch or custom cut to minimize your shop-floor setup time.</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              title={product.title}
              tagline={product.tagline}
              isFeatured={product.isFeatured}
              icon={product.icon}
              specs={product.specs}
            >
              {product.illustration}
            </ProductCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
