import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { STEEL_GRADES, getGradeBySlug } from "@/lib/grades";
import { CANONICAL_PRODUCTS, businessConfig } from "@/lib/config";
import { generateGradeJsonLd } from "@/lib/seo";
import { buildProductWhatsAppUrl } from "@/lib/whatsapp";

interface Props {
  params: Promise<{ grade: string }>;
}

export function generateStaticParams() {
  return STEEL_GRADES.map((grade) => ({ grade: grade.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { grade: slug } = await params;
  const grade = getGradeBySlug(slug);

  if (!grade) {
    return { title: "Steel Grade Not Found" };
  }

  const aisi = grade.equivalents.find((e) => e.standard.startsWith("AISI"))?.designation;

  return {
    title: `${grade.code} Steel${aisi ? ` (${aisi})` : ""} — Round Bar & Shaft Supplier in Mumbai`,
    description: `${grade.code} / ${grade.bsDesignation} reference chemistry, common cross-references and applications. Enquire about round bar and shaft supply from Darukhana, Mazgaon, Mumbai.`,
    alternates: { canonical: `/steel-grades/${grade.slug}` },
    openGraph: {
      title: `${grade.code} Steel (${grade.bsDesignation}) — Supplier in Mumbai`,
      description: grade.summary,
      url: `/steel-grades/${grade.slug}`,
      type: "website",
      images: [{ url: "/og-social.png", width: 1731, height: 909, alt: "Shah Industrial Enterprise — Industrial Steel and Shafting, Darukhana, Mumbai" }],
    },
    keywords: [
      `${grade.code} steel`,
      `${grade.code} round bar`,
      `${grade.code} supplier Mumbai`,
      `${grade.code} material`,
      grade.bsDesignation,
      ...grade.equivalents.map((e) => e.designation),
      "steel supplier Mumbai",
      "Darukhana steel stockist",
    ],
  };
}

export default async function GradeDetailPage({ params }: Props) {
  const { grade: slug } = await params;
  const grade = getGradeBySlug(slug);

  if (!grade) {
    notFound();
  }

  const gradeJsonLd = generateGradeJsonLd(grade);
  const relatedProducts = grade.relatedProductSlugs
    .map((s) => CANONICAL_PRODUCTS.find((p) => p.slug === s))
    .filter((p): p is (typeof CANONICAL_PRODUCTS)[number] => Boolean(p));

  const comparedGrades = grade.comparedWith
    .map((s) => getGradeBySlug(s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  const whatsAppUrl = buildProductWhatsAppUrl({
    productTitle: `${grade.code} Steel (${grade.bsDesignation})`,
    grade: grade.code,
  });

  return (
    <main className="min-h-screen bg-paper text-slate">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gradeJsonLd) }}
      />
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate pb-16 pt-32 text-white noise-overlay sm:pb-20 sm:pt-36">
        <div className="absolute top-[-150px] right-[-150px] h-[400px] w-[400px] rounded-full bg-cyan-glow/[0.04] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-150px] left-[-150px] h-[400px] w-[400px] rounded-full bg-dawn-coral/[0.03] blur-[100px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-5 sm:px-8 md:px-12">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/50">
            <Link href="/" className="hover:text-cyan-glow transition-colors">Home</Link>
            <span>/</span>
            <Link href="/steel-grades" className="hover:text-cyan-glow transition-colors">Steel Grades</Link>
            <span>/</span>
            <span className="text-cyan-glow">{grade.code}</span>
          </nav>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-4 flex items-center gap-3 text-cyan-glow">
                <span className="h-px w-8 bg-cyan-glow/70" />
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em]">
                  {grade.family} · {grade.bsDesignation}
                </p>
              </div>

              <h1 className="mb-6 font-display text-[clamp(2.1rem,5vw,3.9rem)] font-bold leading-[1.08]">
                {grade.heading}
              </h1>

              <p className="mb-8 max-w-[640px] text-[1.05rem] leading-relaxed text-white/70">
                {grade.intro}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="rounded-md bg-dawn-coral px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-900 transition-all hover:bg-[#f09770] hover:shadow-[0_8px_30px_rgba(232,132,92,0.25)]"
                >
                  Request {grade.code} Quotation →
                </Link>
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-900 transition-all hover:bg-[#20bd5a]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                  {grade.code} Price on WhatsApp
                </a>
              </div>
            </div>

            {/* Equivalents card */}
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8">
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-glow">
                  Common Cross-references
                </span>
              </div>

              <dl className="space-y-4 font-mono text-sm">
                {grade.equivalents.map((eq) => (
                  <div key={eq.standard} className="flex justify-between gap-4 border-b border-white/5 pb-2">
                    <dt className="text-xs text-white/45">{eq.standard}</dt>
                    <dd className="text-right text-xs font-medium text-white sm:text-sm">{eq.designation}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-4 font-mono text-[0.68rem] leading-relaxed text-white/45">
                Cross-references are not proof of interchangeability. Confirm the governing standard,
                condition, section size and required properties before ordering.
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-xs text-white/50">
                <span>Supply Desk:</span>
                <span className="text-white/80">Darukhana, Mazgaon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
            <div className="space-y-12">
              {/* Chemistry */}
              <div>
                <span className="section-tag mb-2">CHEMICAL COMPOSITION</span>
                <h2 className="section-title mb-6 text-3xl sm:text-4xl">
                  {grade.code} Chemical Composition
                </h2>

                <div className="overflow-x-auto rounded-lg border border-steel/15 bg-white shadow-sm">
                  <table className="w-full text-left font-mono text-xs sm:text-sm">
                    <thead className="border-b border-steel/15 bg-paper-warm text-slate/70">
                      <tr>
                        <th className="p-4 text-[0.7rem] uppercase tracking-wider">Element</th>
                        <th className="p-4 text-[0.7rem] uppercase tracking-wider">Range (per standard)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-steel/10">
                      {grade.chemistry.map((row) => (
                        <tr key={row.element}>
                          <td className="p-4 font-semibold text-slate">{row.element}</td>
                          <td className="p-4 text-slate/75">{row.range}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-3 font-mono text-[0.7rem] leading-relaxed text-slate/50">
                  Reference ranges vary by standard revision and exact designation. Confirm the
                  purchase specification and use the Mill Test Certificate for the supplied heat.
                </p>
              </div>

              {/* Mechanical */}
              <div>
                <span className="section-tag mb-2">MECHANICAL PROPERTIES</span>
                <h2 className="mb-6 font-display text-2xl font-bold">
                  {`${grade.code} Properties & Condition`}
                </h2>

                <div className="overflow-x-auto rounded-lg border border-steel/15 bg-white shadow-sm">
                  <table className="w-full text-left font-mono text-xs sm:text-sm">
                    <tbody className="divide-y divide-steel/10">
                      {grade.mechanical.map((row) => (
                        <tr key={row.property}>
                          <td className="p-4 font-semibold text-slate">{row.property}</td>
                          <td className="p-4 text-slate/75">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 font-mono text-[0.7rem] leading-relaxed text-slate/50">
                  Mechanical properties depend on heat-treatment condition and section size. Confirm
                  the required values against the governing order specification before purchase.
                </p>
              </div>

              {/* Characteristics */}
              <div>
                <span className="section-tag mb-2">WHY THIS GRADE</span>
                <h2 className="mb-4 font-display text-2xl font-bold">
                  Key Characteristics of {grade.code}
                </h2>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {grade.characteristics.map((item) => (
                    <li key={item} className="flex items-start gap-3 rounded-lg border border-steel/10 bg-white p-4">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-glow" />
                      <span className="text-xs leading-relaxed text-slate/80 sm:text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Applications */}
              <div>
                <span className="section-tag mb-2">SECTOR USAGE</span>
                <h2 className="mb-4 font-display text-2xl font-bold">
                  {grade.code} Applications
                </h2>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {grade.applications.map((app) => (
                    <li key={app} className="flex items-start gap-3 rounded-lg border border-steel/10 bg-white p-4">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-dawn-coral" />
                      <span className="text-xs leading-relaxed text-slate/80 sm:text-sm">{app}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Forms supplied — internal links into the catalogue */}
              {relatedProducts.length > 0 && (
                <div>
                  <span className="section-tag mb-2">FORMS SUPPLIED</span>
                  <h2 className="mb-4 font-display text-2xl font-bold">
                    How we supply {grade.code}
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {relatedProducts.map((product) => (
                      <Link
                        key={product.slug}
                        href={`/products/${product.slug}`}
                        className="group block rounded-lg border border-steel/10 bg-white p-5 transition-all hover:border-steel/30 hover:shadow-md"
                      >
                        <span className="font-mono text-[0.65rem] uppercase tracking-wider text-dawn-coral">
                          {product.categoryLabel}
                        </span>
                        <h3 className="mt-1 font-display text-lg font-bold text-slate transition-colors group-hover:text-dawn-coral">
                          {product.shortTitle ?? product.title}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-slate/60">{product.tagline}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="rounded-xl bg-slate p-6 text-white shadow-xl noise-overlay sm:p-8">
                <span className="mb-3 block font-mono text-[0.68rem] uppercase tracking-[0.2em] text-cyan-glow">
                  Direct Procurement
                </span>
                <h2 className="mb-3 font-display text-2xl font-bold">
                  Get a price on {grade.code}
                </h2>
                <p className="mb-6 text-xs leading-relaxed text-white/60 sm:text-sm">
                  Send the diameter, cut length, quantity and delivery destination. Enquiries go
                  straight to the family desk at the Darukhana yard.
                </p>

                <div className="mb-6 rounded border border-white/10 bg-white/[0.04] p-3 font-mono text-xs">
                  <p className="mb-1 text-[0.65rem] uppercase tracking-wider text-white/40">
                    What to include:
                  </p>
                  <p className="text-white/80">• Grade &amp; required condition</p>
                  <p className="text-white/80">• Diameter &amp; cut length in mm</p>
                  <p className="text-white/80">• Total quantity (pieces / kg)</p>
                  <p className="text-white/80">• Delivery location</p>
                </div>

                <Link
                  href="/contact"
                  className="block w-full rounded-md bg-dawn-coral py-3.5 text-center font-mono text-xs font-bold uppercase tracking-wider text-slate-900 transition-colors hover:bg-[#f09770]"
                >
                  Open RFQ Form
                </Link>
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block w-full rounded-md border border-[#25D366]/40 bg-[#25D366]/10 py-3 text-center font-mono text-xs font-semibold uppercase tracking-wider text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-slate-900"
                >
                  WhatsApp Instant Inquiry ↗
                </a>
              </div>

              {/* Cross-grade links */}
              {comparedGrades.length > 0 && (
                <div className="rounded-xl border border-steel/15 bg-white p-6">
                  <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-wider text-steel/60">
                    Buyers also compare
                  </p>
                  <ul className="space-y-2.5">
                    {comparedGrades.map((other) => (
                      <li key={other.slug}>
                        <Link
                          href={`/steel-grades/${other.slug}`}
                          className="group flex items-baseline justify-between gap-3"
                        >
                          <span className="font-display text-base font-bold text-slate transition-colors group-hover:text-dawn-coral">
                            {other.code}
                          </span>
                          <span className="font-mono text-[0.68rem] text-slate/45">
                            {other.bsDesignation}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-xl border border-steel/15 bg-paper-warm p-6">
                <h2 className="mb-2 font-display text-lg font-bold">Calculate {grade.code} tonnage</h2>
                <p className="mb-4 text-xs leading-relaxed text-slate/65">
                  Estimate theoretical bar weight before you raise the enquiry.
                </p>
                <Link
                  href="/tools/weight-calculator"
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-dawn-coral hover:underline"
                >
                  Open Steel Weight Calculator →
                </Link>
              </div>

              <div className="rounded-xl border border-steel/15 bg-white p-6">
                <p className="mb-2 font-mono text-[0.68rem] uppercase tracking-wider text-steel/60">
                  Direct Yard Desk
                </p>
                <p className="mb-1 font-display text-lg font-bold text-slate">Kalpesh &amp; Ritesh Shah</p>
                <p className="mb-3 font-mono text-xs text-slate/70">Darukhana, Mazgaon, Mumbai</p>
                <div className="space-y-1.5 font-mono text-xs text-slate/80">
                  <p>Mobile: {(businessConfig.contacts.find((c) => c.isPrimary) ?? businessConfig.contacts[0]).formattedPhone}</p>
                  <p>Hours: {businessConfig.hours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
