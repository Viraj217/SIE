'use client';

import type { ReactNode } from 'react';
import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

type ProductCategory = 'RAW_MATERIAL' | 'ALLOY' | 'SERVICE';

interface ProductSpec {
  label: string;
  value: string;
}

interface Product {
  slug: string;
  title: string;
  tagline: string;
  category: ProductCategory;
  isFeatured?: boolean;
  specs: ProductSpec[];
  icon?: ReactNode;
  illustration?: ReactNode;
}

interface ProductCardProps {
  title: string;
  tagline: string;
  specs: ProductSpec[];
  isFeatured?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

function ProductCard({ title, tagline, specs, isFeatured = false, icon, children }: ProductCardProps) {
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

  const handleRequest = () => {
    window.dispatchEvent(new CustomEvent('populateRequirements', { detail: title }));
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

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
          {specs.map((spec, i) => (
            <li key={i} className={`flex justify-between gap-4 py-3 text-[0.8rem] border-b last:border-b-0 sm:text-[0.85rem] ${isFeatured ? 'border-white/8' : 'border-steel/8'}`}>
              <span className={`${isFeatured ? 'text-white/40' : 'text-slate/60'} font-mono`}>{spec.label}</span>
              <span className="text-right font-mono font-medium tracking-tight">{spec.value}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2.5 font-mono text-[0.75rem]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className={isFeatured ? 'text-white/50' : 'text-slate/60'}>Ready for Dispatch</span>
        </div>
        <button
          onClick={handleRequest}
          className={`mt-6 w-full rounded py-2.5 font-mono text-[0.75rem] tracking-[0.1em] uppercase transition-colors ${
            isFeatured ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate/5 hover:bg-slate/10 text-slate'
          }`}
        >
          Request this material
        </button>
      </div>
    </motion.div>
  );
}

const STATIC_PRODUCTS: Product[] = [
  {
    slug: 'custom-hacksaw-cutting',
    title: 'Custom Hacksaw Cutting',
    category: 'SERVICE',
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
    category: 'RAW_MATERIAL',
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
    category: 'ALLOY',
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
  },
  {
    slug: 'alloy-steel-round-bars',
    title: 'Alloy Steel Round Bars',
    category: 'ALLOY',
    tagline: 'High-strength alloy bars tailored for heavy-duty automotive and industrial machinery components.',
    isFeatured: false,
    specs: [
        { label: 'Grades', value: 'EN19, EN24, EN353' },
        { label: 'Diameter', value: 'Ø 20 – 300mm' },
        { label: 'Finish', value: 'Black, Peeled, Ground' }
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    illustration: (
      <svg width="240" height="120" viewBox="0 0 240 120" fill="none">
        <path d="M40,60 Q120,40 200,60" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-white/20" />
        <rect x="60" y="45" width="120" height="30" rx="4" className="fill-steel/20 stroke-steel/40" />
        <line x1="60" y1="60" x2="180" y2="60" stroke="currentColor" className="text-white/30" />
        <text x="120" y="81" textAnchor="middle" fill="rgba(60,92,107,0.4)" fontSize="8" fontFamily="monospace">ALLOY STEEL ROUND BARS</text>
      </svg>
    )
  },
  {
    slug: 'forged-steel-round-bars',
    title: 'Forged Steel Round Bars',
    category: 'ALLOY',
    tagline: 'Superior grain structure forged bars for maximum structural integrity and impact resistance.',
    isFeatured: true,
    specs: [
        { label: 'Grades', value: 'Class 4, EN8, EN9' },
        { label: 'Diameter', value: 'Ø 150 – 600mm' },
        { label: 'Condition', value: 'Normalized, UT Tested' }
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    illustration: (
      <svg width="240" height="120" viewBox="0 0 240 120" fill="none">
        <path d="M40,60 Q120,40 200,60" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-white/20" />
        <rect x="60" y="45" width="120" height="30" rx="4" className="fill-steel/20 stroke-steel/40" />
        <line x1="60" y1="60" x2="180" y2="60" stroke="currentColor" className="text-white/30" />
        <text x="120" y="81" textAnchor="middle" fill="rgba(60,92,107,0.4)" fontSize="8" fontFamily="monospace">FORGED STEEL ROUND BARS</text>
      </svg>
    )
  },
  {
    slug: 'roller-shafts',
    title: 'Roller Shafts',
    category: 'RAW_MATERIAL',
    tagline: 'Precision-machined shafts optimized for extreme torque in sugar mills and heavy crushing equipment.',
    isFeatured: false,
    specs: [
        { label: 'Material', value: 'EN8, EN9' },
        { label: 'Application', value: 'Crushing & Milling' },
        { label: 'Tolerance', value: 'High Precision' }
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    illustration: (
      <svg width="240" height="120" viewBox="0 0 240 120" fill="none">
        <path d="M40,60 Q120,40 200,60" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-white/20" />
        <rect x="60" y="45" width="120" height="30" rx="4" className="fill-steel/20 stroke-steel/40" />
        <line x1="60" y1="60" x2="180" y2="60" stroke="currentColor" className="text-white/30" />
        <text x="120" y="81" textAnchor="middle" fill="rgba(60,92,107,0.4)" fontSize="8" fontFamily="monospace">ROLLER SHAFTS</text>
      </svg>
    )
  },
  {
    slug: 'hydraulic-shafts',
    title: 'Hydraulic Shafts',
    category: 'RAW_MATERIAL',
    tagline: 'Hard chrome plated and induction hardened shafts for earthmoving and fluid power systems.',
    isFeatured: false,
    specs: [
        { label: 'Surface', value: 'Hard Chrome' },
        { label: 'Hardness', value: 'Induction Hardened' },
        { label: 'Usage', value: 'Cylinders & Pumps' }
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    illustration: (
      <svg width="240" height="120" viewBox="0 0 240 120" fill="none">
        <path d="M40,60 Q120,40 200,60" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-white/20" />
        <rect x="60" y="45" width="120" height="30" rx="4" className="fill-steel/20 stroke-steel/40" />
        <line x1="60" y1="60" x2="180" y2="60" stroke="currentColor" className="text-white/30" />
        <text x="120" y="81" textAnchor="middle" fill="rgba(60,92,107,0.4)" fontSize="8" fontFamily="monospace">HYDRAULIC SHAFTS</text>
      </svg>
    )
  },
  {
    slug: 'iron-steel-plates',
    title: 'Iron & Steel Plates',
    category: 'RAW_MATERIAL',
    tagline: 'Structural and boiler quality plates for heavy fabrication, marine, and pressure vessel applications.',
    isFeatured: false,
    specs: [
        { label: 'Grades', value: 'IS 2062, ASTM A36' },
        { label: 'Thickness', value: '5mm – 150mm' },
        { label: 'Profile Cutting', value: 'Available' }
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    illustration: (
      <svg width="240" height="120" viewBox="0 0 240 120" fill="none">
        <path d="M40,60 Q120,40 200,60" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-white/20" />
        <rect x="60" y="45" width="120" height="30" rx="4" className="fill-steel/20 stroke-steel/40" />
        <line x1="60" y1="60" x2="180" y2="60" stroke="currentColor" className="text-white/30" />
        <text x="120" y="81" textAnchor="middle" fill="rgba(60,92,107,0.4)" fontSize="8" fontFamily="monospace">IRON & STEEL PLATES</text>
      </svg>
    )
  },
  {
    slug: 'iron-steel-pipes-tubes',
    title: 'Iron & Steel Pipes & Tubes',
    category: 'RAW_MATERIAL',
    tagline: 'Seamless and ERW pipes offering excellent burst strength for industrial pipelines and structural supports.',
    isFeatured: false,
    specs: [
        { label: 'Types', value: 'Seamless, ERW' },
        { label: 'Schedule', value: 'Sch 40, Sch 80' },
        { label: 'Standard', value: 'API, ASTM, IS' }
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    illustration: (
      <svg width="240" height="120" viewBox="0 0 240 120" fill="none">
        <path d="M40,60 Q120,40 200,60" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-white/20" />
        <rect x="60" y="45" width="120" height="30" rx="4" className="fill-steel/20 stroke-steel/40" />
        <line x1="60" y1="60" x2="180" y2="60" stroke="currentColor" className="text-white/30" />
        <text x="120" y="81" textAnchor="middle" fill="rgba(60,92,107,0.4)" fontSize="8" fontFamily="monospace">IRON & STEEL PIPES & TUBES</text>
      </svg>
    )
  },
  {
    slug: 'iron-steel-bars',
    title: 'Iron & Steel Bars',
    category: 'RAW_MATERIAL',
    tagline: 'Versatile flat, square, and hexagonal profiles for general engineering and construction purposes.',
    isFeatured: false,
    specs: [
        { label: 'Profiles', value: 'Flat, Square, Hex' },
        { label: 'Grades', value: 'MS, EN8' },
        { label: 'Lengths', value: 'Custom Cut' }
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    illustration: (
      <svg width="240" height="120" viewBox="0 0 240 120" fill="none">
        <path d="M40,60 Q120,40 200,60" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-white/20" />
        <rect x="60" y="45" width="120" height="30" rx="4" className="fill-steel/20 stroke-steel/40" />
        <line x1="60" y1="60" x2="180" y2="60" stroke="currentColor" className="text-white/30" />
        <text x="120" y="81" textAnchor="middle" fill="rgba(60,92,107,0.4)" fontSize="8" fontFamily="monospace">IRON & STEEL BARS</text>
      </svg>
    )
  },
];

const FILTERS: Array<{ label: string; value: 'ALL' | ProductCategory }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Services', value: 'SERVICE' },
  { label: 'MS Stock', value: 'RAW_MATERIAL' },
  { label: 'Alloy Grades', value: 'ALLOY' },
];

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>(STATIC_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | ProductCategory>('ALL');

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesFilter = activeFilter === 'ALL' || product.category === activeFilter;
    const matchesSearch = !query ||
      product.title.toLowerCase().includes(query) ||
      product.tagline.toLowerCase().includes(query) ||
      product.specs.some((spec) => `${spec.label} ${spec.value}`.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/products`);
        const result = await res.json();
        
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          const merged = result.data.map((dbProd: {
            slug: string;
            title: string;
            tagline: string;
            category?: ProductCategory;
            isFeatured?: boolean;
            specs?: ProductSpec[];
          }) => {
            const match = STATIC_PRODUCTS.find((p) => p.slug === dbProd.slug);
            return {
              ...dbProd,
              category: dbProd.category || match?.category || 'RAW_MATERIAL',
              specs: dbProd.specs?.map((s) => ({ label: s.label, value: s.value })) || match?.specs || [],
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
    <section id="products" className="relative z-20 bg-paper py-12 noise-overlay sm:py-16 lg:py-20" style={{ perspective: "1200px" }}>
      <div className="relative z-10 mx-auto max-w-[1200px] px-5 sm:px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between lg:mb-16"
        >
          <div className="max-w-[650px]">
              <span className="section-tag">CATALOG</span>
              <h2 className="section-title">Quality on Demand</h2>
              <p className="section-desc">Raw materials processed to absolute specifications. Ready for dispatch or custom cut to minimize your shop-floor setup time.</p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-steel/50" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  placeholder="Search grade, diam..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-steel/20 bg-white/50 py-2.5 pl-10 pr-4 text-sm font-mono text-slate placeholder:text-steel/50 focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow sm:w-56"
                />
              </div>
              <a
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-slate px-5 py-2.5 font-mono text-xs tracking-wider text-white transition-colors hover:bg-slate-light uppercase whitespace-nowrap"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                View Catalog
              </a>
            </div>
          </motion.div>

        <div className="mb-8 flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-full border px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] transition-colors ${
                activeFilter === filter.value
                  ? 'border-slate bg-slate text-white'
                  : 'border-steel/15 bg-white/45 text-slate/65 hover:border-steel/30 hover:text-slate'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {filteredProducts.map((product) => (
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
          {filteredProducts.length === 0 && (
            <div className="col-span-full rounded-lg border border-steel/10 bg-white/45 p-8 text-center">
              <p className="font-display text-2xl text-slate">No matching material found</p>
              <p className="mt-2 text-sm text-steel">Try another grade or send the requirement directly. We can confirm availability quickly.</p>
              <button
                type="button"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-6 rounded-md bg-dawn-coral px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-white"
              >
                Send Requirement
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
