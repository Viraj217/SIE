import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { STEEL_GRADES } from "@/lib/grades";
import { SITE_URL, generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Steel Grade Reference — EN8, EN9, EN19, EN24, EN31, C45",
  description:
    "Specifications, standard equivalents and applications for EN8, EN9, EN19 (4140), EN24 (4340), EN31 (52100) and C45 steel. Supplied as round bar and shaft stock, cut to size from Darukhana, Mumbai.",
  alternates: { canonical: "/steel-grades" },
  openGraph: {
    title: "Steel Grade Reference — EN8, EN9, EN19, EN24, EN31, C45",
    description:
      "Chemistry, standard equivalents and applications for the EN series and C45 engineering steels, supplied cut-to-size from Mazgaon, Mumbai.",
    url: "/steel-grades",
    type: "website",
    images: [{ url: "/og-social.png", width: 1731, height: 909, alt: "Shah Industrial Enterprise — Industrial Steel and Shafting, Darukhana, Mumbai" }],
  },
};

export default function SteelGradesPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Steel Grades", url: "/steel-grades" },
  ]);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/steel-grades#collection`,
    name: "Steel Grade Reference",
    url: `${SITE_URL}/steel-grades`,
    description:
      "Reference specifications and standard equivalents for the EN series and C45 engineering steels supplied by Shah Industrial Enterprise.",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: STEEL_GRADES.map((grade, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: grade.name,
        url: `${SITE_URL}/steel-grades/${grade.slug}`,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-paper text-slate">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <Navigation />

      <section className="relative overflow-hidden bg-slate pb-16 pt-32 text-white noise-overlay sm:pb-20 sm:pt-36">
        <div className="absolute top-[-150px] right-[-150px] h-[400px] w-[400px] rounded-full bg-cyan-glow/[0.04] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-150px] left-[-150px] h-[400px] w-[400px] rounded-full bg-dawn-coral/[0.03] blur-[100px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-5 sm:px-8 md:px-12">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/50">
            <Link href="/" className="hover:text-cyan-glow transition-colors">Home</Link>
            <span>/</span>
            <span className="text-cyan-glow">Steel Grades</span>
          </nav>

          <div className="mb-4 flex items-center gap-3 text-cyan-glow">
            <span className="h-px w-8 bg-cyan-glow/70" />
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em]">
              Grade Reference · Darukhana Yard
            </p>
          </div>

          <h1 className="max-w-[900px] font-display text-[clamp(2.2rem,5.5vw,4.4rem)] font-bold leading-[1.06]">
            EN8, EN9, EN19, EN24, EN31 &amp; C45 Steel Grades
          </h1>

          <p className="mt-6 max-w-[720px] text-[1.05rem] leading-relaxed text-white/65">
            Standard designations, chemistry ranges and typical applications for the engineering
            steels we stock as round bar, shaft and forged material — supplied cut-to-size from
            Darukhana, Mazgaon, Mumbai.
          </p>

          <p className="mt-6 max-w-[720px] rounded-md border border-white/10 bg-white/[0.03] p-4 font-mono text-[0.72rem] leading-relaxed text-white/50">
            Values shown are published standard designations (BS 970, IS 1570, AISI/SAE, DIN/EN)
            given for identification and cross-reference. Chemistry and mechanical properties of any
            supplied material are governed by the Mill Test Certificate for that heat.
          </p>
        </div>
      </section>

      <section className="relative z-20 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 md:px-12">
          <div className="mb-10 border-b border-steel/10 pb-6">
            <span className="section-tag mb-1">GRADE DIRECTORY</span>
            <p className="text-sm text-slate/60">
              Select a grade for full specifications, standard equivalents and the forms we supply it in.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {STEEL_GRADES.map((grade) => (
              <article
                key={grade.slug}
                className="group flex flex-col justify-between rounded-xl border border-steel/10 bg-white p-7 shadow-[0_4px_30px_rgba(22,35,43,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-steel/30 hover:shadow-[0_12px_45px_rgba(22,35,43,0.09)]"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="rounded bg-dawn-coral/10 px-2.5 py-1 font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-dawn-coral">
                      {grade.family}
                    </span>
                    <span className="font-mono text-[0.68rem] text-slate/40">{grade.bsDesignation}</span>
                  </div>

                  <h2 className="mb-2 font-display text-2xl font-semibold transition-colors group-hover:text-dawn-coral">
                    <Link href={`/steel-grades/${grade.slug}`}>{grade.code}</Link>
                  </h2>

                  <p className="mb-5 text-sm leading-relaxed text-slate/65">{grade.summary}</p>

                  <ul className="mb-6 flex flex-wrap gap-1.5">
                    {grade.equivalents.slice(0, 3).map((eq) => (
                      <li
                        key={eq.standard}
                        className="rounded border border-steel/15 bg-paper-warm/70 px-2 py-1 font-mono text-[0.66rem] text-slate/70"
                      >
                        {eq.designation}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-steel/10 pt-4">
                  <Link
                    href={`/steel-grades/${grade.slug}`}
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-slate transition-colors hover:text-dawn-coral"
                  >
                    {grade.code} Specifications <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 rounded-2xl bg-slate p-8 text-white noise-overlay sm:p-12">
            <div className="max-w-[700px]">
              <span className="section-tag !text-cyan-glow/80 mb-3">GRADE NOT LISTED?</span>
              <h2 className="mb-4 font-display text-2xl font-bold sm:text-3xl">
                Send us the grade on your drawing and we will confirm availability.
              </h2>
              <p className="mb-8 text-sm leading-relaxed text-white/60 sm:text-base">
                We also handle EN353, IS 2062, ASTM A36 and equivalent designations. Share the grade,
                diameter, cut length and quantity and we will come back on stock and price.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="rounded-md bg-dawn-coral px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-900 transition-colors hover:bg-[#f09770]"
                >
                  Send RFQ Details
                </Link>
                <Link
                  href="/products"
                  className="rounded-md border border-white/20 px-6 py-3.5 font-mono text-xs uppercase tracking-wider text-white transition-colors hover:bg-white/10"
                >
                  Browse Full Catalogue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
