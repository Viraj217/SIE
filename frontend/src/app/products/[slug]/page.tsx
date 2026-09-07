import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import SiteFooter from '@/components/SiteFooter';
import { CANONICAL_PRODUCTS, businessConfig } from '@/lib/config';
import { generateProductJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import { buildProductWhatsAppUrl } from '@/lib/whatsapp';
import { matchGradeLabel } from '@/lib/grades';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CANONICAL_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = CANONICAL_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.title,
    description: product.fullDescription.slice(0, 160),
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.title} | Shah Industrial Enterprise Mumbai`,
      description: product.tagline,
      url: `/products/${product.slug}`,
      type: 'website',
      images: [{ url: '/og-social.png', width: 1731, height: 909, alt: 'Shah Industrial Enterprise — Industrial Steel and Shafting, Darukhana, Mumbai' }],
    },
    keywords: [
      product.title,
      product.shortTitle || product.title,
      ...(product.availableGrades || []),
      'steel supplier Mumbai',
      'cut to size steel',
      'Darukhana steel stockist',
      'Mazgaon Mumbai steel merchant',
    ],
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = CANONICAL_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const productJsonLd = generateProductJsonLd(product);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: product.title, url: `/products/${product.slug}` },
  ]);

  const relatedProducts = CANONICAL_PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3);

  const defaultGrade = product.availableGrades?.[0] || 'Standard';
  const defaultDia = product.diameterRange?.split(' ')[0] || 'Standard';
  const whatsAppUrl = buildProductWhatsAppUrl({
    productTitle: product.title,
    grade: defaultGrade,
    diameter: defaultDia,
  });

  return (
    <main className="min-h-screen bg-paper text-slate">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate pb-16 pt-32 text-white noise-overlay sm:pb-20 sm:pt-36">
        <div className="absolute top-[-150px] right-[-150px] h-[400px] w-[400px] rounded-full bg-cyan-glow/[0.04] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-150px] left-[-150px] h-[400px] w-[400px] rounded-full bg-dawn-coral/[0.03] blur-[100px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-5 sm:px-8 md:px-12">
          {/* Breadcrumb Trail */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/50">
            <Link href="/" className="hover:text-cyan-glow transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-cyan-glow transition-colors">Products</Link>
            <span>/</span>
            <span className="text-cyan-glow truncate max-w-[200px] sm:max-w-none">{product.shortTitle || product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 text-cyan-glow mb-4">
                <span className="h-px w-8 bg-cyan-glow/70" />
                <p className="font-mono text-[0.68rem] tracking-[0.28em] uppercase">
                  {product.categoryLabel}
                </p>
              </div>

              <h1 className="font-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-bold leading-[1.08] mb-6">
                {product.title}
              </h1>

              <p className="text-[1.05rem] leading-relaxed text-white/70 mb-8 max-w-[620px]">
                {product.fullDescription}
              </p>

              {/* Conversion Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="rounded-md bg-dawn-coral px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-900 hover:bg-[#f09770] hover:shadow-[0_8px_30px_rgba(232,132,92,0.25)] transition-all"
                >
                  Request Quotation →
                </Link>
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-900 hover:bg-[#20bd5a] transition-all"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                  Get Price on WhatsApp
                </a>
              </div>
            </div>

            {/* Quick Spec Card */}
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-glow">Technical Snapshot</span>
                <span className="font-mono text-[0.68rem] text-white/40">SIE–{product.displayOrder.toString().padStart(2, '0')}</span>
              </div>

              <dl className="space-y-4 font-mono text-sm">
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between gap-4 border-b border-white/5 pb-2">
                    <dt className="text-white/45 text-xs">{spec.label}</dt>
                    <dd className="text-right text-white font-medium text-xs sm:text-sm">{spec.value}</dd>
                  </div>
                ))}
                {product.cutToSizeAvailable && (
                  <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                    <dt className="text-white/45 text-xs">Custom Cutting</dt>
                    <dd className="text-right text-cyan-glow font-medium text-xs">Available (±1.0mm)</dd>
                  </div>
                )}
              </dl>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
                <span>Supply Desk:</span>
                <span className="text-white/80">Darukhana, Mazgaon Yard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-12 lg:gap-16">
            
            {/* Left Column: Full Specifications & Grades */}
            <div className="space-y-12">
              
              {/* Detailed Specs */}
              <div>
                <span className="section-tag mb-2">TECHNICAL PARAMETERS</span>
                <h2 className="section-title text-3xl sm:text-4xl mb-6">Material Capabilities</h2>
                
                <div className="overflow-hidden rounded-lg border border-steel/15 bg-white shadow-sm">
                  <table className="w-full text-left font-mono text-xs sm:text-sm">
                    <thead className="bg-paper-warm border-b border-steel/15 text-slate/70">
                      <tr>
                        <th className="p-4 uppercase tracking-wider text-[0.7rem]">Parameter</th>
                        <th className="p-4 uppercase tracking-wider text-[0.7rem]">Standard Capability</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-steel/10">
                      {product.diameterRange && (
                        <tr>
                          <td className="p-4 font-semibold text-slate">Diameter Range</td>
                          <td className="p-4 text-slate/75">{product.diameterRange}</td>
                        </tr>
                      )}
                      {product.lengthRange && (
                        <tr>
                          <td className="p-4 font-semibold text-slate">Length Range</td>
                          <td className="p-4 text-slate/75">{product.lengthRange}</td>
                        </tr>
                      )}
                      {product.availableGrades && product.availableGrades.length > 0 && (
                        <tr>
                          <td className="p-4 font-semibold text-slate">Available Grades</td>
                          <td className="p-4 text-slate/75">
                            <span className="flex flex-wrap gap-1.5">
                              {product.availableGrades.map((label) => {
                                const grade = matchGradeLabel(label);
                                return grade ? (
                                  <Link
                                    key={label}
                                    href={`/steel-grades/${grade.slug}`}
                                    className="rounded border border-steel/20 bg-paper-warm px-2 py-1 text-[0.72rem] text-slate transition-colors hover:border-dawn-coral/50 hover:text-dawn-coral"
                                  >
                                    {label}
                                  </Link>
                                ) : (
                                  <span
                                    key={label}
                                    className="rounded border border-steel/10 px-2 py-1 text-[0.72rem] text-slate/70"
                                  >
                                    {label}
                                  </span>
                                );
                              })}
                            </span>
                          </td>
                        </tr>
                      )}
                      {product.finishOptions && (
                        <tr>
                          <td className="p-4 font-semibold text-slate">Surface Finish Options</td>
                          <td className="p-4 text-slate/75">{product.finishOptions.join(', ')}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="p-4 font-semibold text-slate">Cutting Tolerance</td>
                        <td className="p-4 text-slate/75">±1.0 mm (straight cuts)</td>
                      </tr>
                      {product.testingAvailable && (
                        <tr>
                          <td className="p-4 font-semibold text-slate">Testing & Documentation</td>
                          <td className="p-4 text-slate/75">{product.testingAvailable.join(', ')}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Steel Grades Breakdown if available */}
              {product.gradeDetails && product.gradeDetails.length > 0 && (
                <div>
                  <span className="section-tag mb-2">METALLURGY & EQUIVALENTS</span>
                  <h3 className="font-display text-2xl font-bold mb-6">Grade Characteristics</h3>

                  <div className="space-y-4">
                    {product.gradeDetails.map((grade) => (
                      <div key={grade.grade} className="rounded-lg border border-steel/15 bg-white p-5 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <h4 className="font-display text-lg font-bold text-slate">{grade.grade}</h4>
                          <span className="font-mono text-xs text-dawn-coral font-medium bg-dawn-coral/10 px-2.5 py-0.5 rounded">
                            Equiv: {grade.standardEquivalent}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 font-mono text-xs text-slate/70">
                          <div><span className="text-slate/40">Carbon:</span> {grade.carbonContent}</div>
                          <div><span className="text-slate/40">Tensile Strength:</span> {grade.tensileStrength}</div>
                        </div>
                        <p className="text-xs text-slate/60 leading-relaxed">{grade.recommendedUse}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Industrial Applications */}
              <div>
                <span className="section-tag mb-2">SECTOR USAGE</span>
                <h3 className="font-display text-2xl font-bold mb-4">Recommended Applications</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.applications.map((app, idx) => (
                    <div key={idx} className="flex items-start gap-3 rounded-lg border border-steel/10 bg-white p-4">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-dawn-coral" />
                      <span className="text-xs sm:text-sm text-slate/80 leading-relaxed">{app}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Buyer Checklist & RFQ Action */}
            <div className="space-y-8">
              
              {/* Ready to Quote Card */}
              <div className="rounded-xl bg-slate p-6 sm:p-8 text-white shadow-xl noise-overlay">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-cyan-glow block mb-3">
                  Direct Procurement
                </span>
                <h3 className="font-display text-2xl font-bold mb-3">
                  Request a Quote for {product.shortTitle || product.title}
                </h3>
                <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-6">
                  Provide your required diameter, cut lengths, quantity, and delivery destination. Direct response within 2 hours.
                </p>

                <div className="space-y-3 mb-6 font-mono text-xs">
                  <div className="rounded border border-white/10 bg-white/[0.04] p-3">
                    <p className="text-white/40 uppercase text-[0.65rem] tracking-wider mb-1">What to include:</p>
                    <p className="text-white/80">• Grade & required condition</p>
                    <p className="text-white/80">• Diameter & cut length in mm</p>
                    <p className="text-white/80">• Total quantity (pieces / kg)</p>
                    <p className="text-white/80">• Delivery location</p>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="block w-full text-center rounded-md bg-dawn-coral py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-900 hover:bg-[#f09770] transition-colors"
                >
                  Open RFQ Form
                </Link>

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block w-full text-center rounded-md border border-[#25D366]/40 bg-[#25D366]/10 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#25D366] hover:bg-[#25D366] hover:text-slate-900 transition-colors"
                >
                  WhatsApp Instant Inquiry ↗
                </a>
              </div>

              {/* Weight Calculator Shortcut */}
              <div className="rounded-xl border border-steel/15 bg-paper-warm p-6">
                <h4 className="font-display text-lg font-bold mb-2">Need to calculate tonnage?</h4>
                <p className="text-slate/65 text-xs leading-relaxed mb-4">
                  Use our interactive steel weight calculator to estimate theoretical weights for round bars, shafts, and hollow sections before quoting.
                </p>
                <Link
                  href="/tools/weight-calculator"
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-dawn-coral hover:underline"
                >
                  Open Steel Weight Calculator →
                </Link>
              </div>

              {/* Owner Contact */}
              <div className="rounded-xl border border-steel/15 bg-white p-6">
                <p className="font-mono text-[0.68rem] uppercase tracking-wider text-steel/60 mb-2">Direct Yard Desk</p>
                <p className="font-display text-lg font-bold text-slate mb-1">Kalpesh &amp; Ritesh Shah</p>
                <p className="font-mono text-xs text-slate/70 mb-3">Darukhana, Mazgaon, Mumbai</p>
                <div className="space-y-1.5 font-mono text-xs text-slate/80">
                  <p>Mobile: {(businessConfig.contacts.find((c) => c.isPrimary) ?? businessConfig.contacts[0]).formattedPhone}</p>
                  <p>Hours: {businessConfig.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Cross-links */}
          <div className="mt-20 pt-12 border-t border-steel/10">
            <span className="section-tag mb-2">EXPLORE RELATED MATERIALS</span>
            <h3 className="font-display text-2xl font-bold mb-8">Complementary Inventory</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/products/${rel.slug}`}
                  className="group block rounded-lg border border-steel/10 bg-white p-5 transition-all hover:border-steel/30 hover:shadow-md"
                >
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider text-dawn-coral">{rel.categoryLabel}</span>
                  <h4 className="font-display text-lg font-bold mt-1 text-slate group-hover:text-dawn-coral transition-colors">{rel.title}</h4>
                  <p className="text-xs text-slate/60 mt-2 line-clamp-2">{rel.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
