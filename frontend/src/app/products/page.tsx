import type { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import SiteFooter from '@/components/SiteFooter';
import { CANONICAL_PRODUCTS, businessConfig } from '@/lib/config';
import { SITE_URL, generateBreadcrumbJsonLd } from '@/lib/seo';
import { buildProductWhatsAppUrl } from '@/lib/whatsapp';
import PrintCatalogButton from '@/components/PrintCatalogButton';

export const metadata: Metadata = {
  title: 'Steel Materials & Shafting Catalog — Shafts, Forged Rounds & EN Grades',
  description:
    'Explore heavy steamer shafts, forged rounds, carbon steel EN8/EN9, alloy steel EN19/EN24 bars, and custom hacksaw cutting services from Mazgaon, Mumbai.',
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'Steel Materials & Shafting Catalog — Shafts, Forged Rounds & EN Grades',
    description:
      'Heavy steamer shafts, carbon steel rounds, alloy bars, and custom hacksaw cutting in Mazgaon, Mumbai since 1989.',
    url: '/products',
    type: 'website',
    images: [{ url: '/og-social.png', width: 1731, height: 909, alt: 'Shah Industrial Enterprise — Industrial Steel and Shafting, Darukhana, Mumbai' }],
  },
};

export default function ProductsPage() {
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
  ]);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/products#collection`,
    name: 'Industrial Steel Materials & Processing Catalog',
    description:
      'Complete catalog of steel rounds, heavy steamer shafts, alloy bars, and custom cut-to-size services from Shah Industrial Enterprise.',
    url: `${SITE_URL}/products`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: CANONICAL_PRODUCTS.map((prod, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${SITE_URL}/products/${prod.slug}`,
        name: prod.title,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-paper text-slate">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <Navigation />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-slate pb-16 pt-32 text-white noise-overlay sm:pb-20 sm:pt-36">
        <div className="absolute top-[-150px] right-[-150px] h-[400px] w-[400px] rounded-full bg-cyan-glow/[0.04] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-150px] left-[-150px] h-[400px] w-[400px] rounded-full bg-dawn-coral/[0.03] blur-[100px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-5 sm:px-8 md:px-12">
          {/* Breadcrumb trail */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/50">
            <Link href="/" className="hover:text-cyan-glow transition-colors">Home</Link>
            <span>/</span>
            <span className="text-cyan-glow">Products</span>
          </nav>

          <div className="flex items-center gap-3 text-cyan-glow mb-4">
            <span className="h-px w-8 bg-cyan-glow/70" />
            <p className="font-mono text-[0.68rem] tracking-[0.28em] uppercase">
              Material Catalog · Mazgaon Yard
            </p>
          </div>

          <h1 className="max-w-[850px] font-display text-[clamp(2.4rem,6vw,4.8rem)] font-bold leading-[1.05]">
            Engineered Materials & Cut-to-Size Stock
          </h1>

          <p className="mt-6 max-w-[680px] text-[1.05rem] leading-relaxed text-white/65">
            Heavy steamer shafts, forged rounds, carbon steel rods, and hacksaw cutting. Confirm grade, dimensions, documentation, and availability when requesting a quotation.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 font-mono text-xs text-white/60">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span>Availability on Enquiry</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-white/60">
              <span className="text-cyan-glow">±1mm</span>
              <span>Cut Tolerance: Confirm</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-white/60">
              <span className="text-dawn-coral">18</span>
              <span>States Supplied</span>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="relative z-20 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 md:px-12">
          
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-steel/10 pb-6">
            <div>
              <span className="section-tag mb-1">INVENTORY DIRECTORY</span>
              <p className="text-slate/60 text-sm">Select a product to view technical specifications, available grades, and instant quote options.</p>
            </div>

            <Link
              href="/tools/weight-calculator"
              className="inline-flex items-center gap-2 rounded-md border border-steel/20 bg-white/70 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-slate hover:border-cyan-glow/80 hover:bg-white transition-all self-start sm:self-auto"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
              Steel Weight Calculator ↗
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CANONICAL_PRODUCTS.map((product) => {
              const whatsAppUrl = buildProductWhatsAppUrl({
                productTitle: product.title,
                grade: product.availableGrades?.[0] || 'Standard Grade',
              });

              return (
                <article
                  key={product.slug}
                  className="group relative flex flex-col justify-between rounded-xl border border-steel/10 bg-white p-7 shadow-[0_4px_30px_rgba(22,35,43,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-steel/30 hover:shadow-[0_12px_45px_rgba(22,35,43,0.09)]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="font-mono text-[0.68rem] tracking-[0.16em] uppercase text-dawn-coral font-medium bg-dawn-coral/10 px-2.5 py-1 rounded">
                        {product.categoryLabel}
                      </span>
                      {product.isFeatured && (
                        <span className="font-mono text-[0.62rem] tracking-wider uppercase text-cyan-glow bg-slate px-2 py-0.5 rounded">
                          Featured Product
                        </span>
                      )}
                    </div>

                    <h2 className="font-display text-2xl font-semibold mb-2 group-hover:text-dawn-coral transition-colors">
                      <Link href={`/products/${product.slug}`} className="focus:outline-none">
                        {product.title}
                      </Link>
                    </h2>

                    <p className="text-slate/65 text-sm leading-relaxed mb-6">
                      {product.tagline}
                    </p>

                    <div className="mb-6 rounded-lg bg-paper-warm/70 p-4 border border-steel/5">
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-steel mb-2">Key Specifications</p>
                      <ul className="space-y-1.5 font-mono text-xs">
                        {product.specs.slice(0, 3).map((spec, i) => (
                          <li key={i} className="flex justify-between gap-2 text-slate/75">
                            <span className="text-slate/50">{spec.label}:</span>
                            <span className="font-medium text-right text-slate">{spec.value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-steel/10 flex items-center justify-between gap-3">
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-slate hover:text-dawn-coral transition-colors"
                    >
                      View Specs <span>→</span>
                    </Link>

                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded bg-[#25D366]/10 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-colors"
                    >
                      WhatsApp Quote
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Bottom Procurement Guidance */}
          <div className="mt-16 rounded-2xl bg-slate p-8 sm:p-12 text-white noise-overlay">
            <div className="max-w-[700px]">
              <span className="section-tag !text-cyan-glow/80 mb-3">CUSTOM SPECIFICATIONS</span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold mb-4">
                Require a non-standard diameter, custom grade, or urgent breakdown supply?
              </h3>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8">
                Send the required grade, dimensions, quantity, and delivery location so availability, cutting feasibility, and transport can be confirmed.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="rounded-md bg-dawn-coral px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-900 hover:bg-[#f09770] transition-colors"
                >
                  Send RFQ Details
                </Link>
                <a
                  href={`tel:${(businessConfig.contacts.find((c) => c.isPrimary) ?? businessConfig.contacts[0]).phone}`}
                  className="rounded-md border border-white/20 px-6 py-3.5 font-mono text-xs uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
                >
                  Call: {(businessConfig.contacts.find((c) => c.isPrimary) ?? businessConfig.contacts[0]).formattedPhone}
                </a>
                <PrintCatalogButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
