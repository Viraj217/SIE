import type { Metadata } from "next";
import Link from "next/link";
import PrintCatalogButton from "@/components/PrintCatalogButton";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { SITE_URL, businessInfo } from "@/lib/seo";
import { CANONICAL_PRODUCTS } from "@/lib/config";
import { buildProductWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Printable Steel Product Catalogue & Specifications",
  description:
    "Browse Shah Industrial Enterprise steel materials and custom cutting services for heavy steamer shafts, forged rounds, EN series alloy rods, and seamless pipes in Mazgaon, Mumbai.",
  alternates: {
    canonical: "/catalog",
  },
  openGraph: {
    title: "Steel Product Catalog | Shah Industrial Enterprise",
    description:
      "Steel materials and custom cutting services for shafts, rods, alloy bars, and machining stock from Mazgaon, Mumbai.",
    url: "/catalog",
    type: "website",
  },
};

const BUYER_NOTES = [
  "Specify whether your material is intended for heavy machining, forging, marine repair, or general fabrication.",
  "Mention any urgency level if the requirement is for immediate breakdown or emergency replacement.",
  "Include your exact delivery destination to receive ex-yard Mazgaon or delivered transport estimates.",
];

export default function CatalogPage() {
  const catalogSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/catalog#catalog`,
        name: "Steel Product Catalog",
        url: `${SITE_URL}/catalog`,
        description:
          "Steel materials and custom cutting services available from Shah Industrial Enterprise in Mazgaon, Mumbai.",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: CANONICAL_PRODUCTS.map((product) => product.title),
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/catalog#products`,
        name: "Steel products and services",
        itemListElement: CANONICAL_PRODUCTS.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": product.category === "SERVICE" ? "Service" : "Product",
            name: product.title,
            category: product.categoryLabel,
            description: product.fullDescription,
            url: `${SITE_URL}/products/${product.slug}`,
            provider: {
              "@type": "LocalBusiness",
              name: businessInfo.name,
              telephone: businessInfo.phones[0],
              address: {
                "@type": "PostalAddress",
                streetAddress: businessInfo.address.street,
                addressLocality: businessInfo.address.locality,
                addressRegion: businessInfo.address.region,
                postalCode: businessInfo.address.postalCode,
                addressCountry: businessInfo.address.country,
              },
            },
          },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-paper text-slate">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema) }}
      />

      <Navigation />

      <section className="bg-slate px-5 pb-16 pt-32 text-white noise-overlay sm:px-8 md:px-12 sm:pt-36">
        <div className="mx-auto max-w-[1200px]">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/50">
            <Link href="/" className="hover:text-cyan-glow transition-colors">Home</Link>
            <span>/</span>
            <span className="text-cyan-glow">Printable Catalog</span>
          </nav>

          <p className="font-mono text-xs uppercase tracking-[0.22em] text-dawn-coral">Commercial Directory</p>
          <h1 className="mt-4 max-w-[850px] font-display text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[1.04]">
            Shah Industrial Product Catalog & Specification Guide
          </h1>
          <p className="mt-6 max-w-[680px] text-[1.05rem] leading-relaxed text-white/60">
            A comprehensive procurement reference for steel stock, alloy grades, shaft tolerances, and cut-to-size processing from our Mazgaon yard.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-md bg-dawn-coral px-6 py-3.5 font-mono text-xs uppercase tracking-[0.14em] text-slate-900 font-bold hover:bg-[#f09770] transition-colors"
            >
              Request Quotation
            </Link>
            <PrintCatalogButton />
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 md:px-12">
        <div className="mx-auto grid max-w-[1200px] gap-8 md:grid-cols-2 lg:grid-cols-3">
          {CANONICAL_PRODUCTS.map((product) => {
            const whatsAppUrl = buildProductWhatsAppUrl({
              productTitle: product.title,
            });

            return (
              <article key={product.slug} className="flex flex-col justify-between rounded-xl border border-steel/15 bg-white p-6 sm:p-7 shadow-[0_4px_30px_rgba(22,35,43,0.05)]">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-dawn-coral font-semibold">
                      {product.categoryLabel}
                    </span>
                    {product.isFeatured && (
                      <span className="font-mono text-[0.62rem] uppercase tracking-wider text-cyan-glow bg-slate px-2 py-0.5 rounded">
                        Priority
                      </span>
                    )}
                  </div>

                  <h2 className="font-display text-2xl font-bold mb-3 text-slate">
                    <Link href={`/products/${product.slug}`} className="hover:text-dawn-coral transition-colors">
                      {product.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate/70 leading-relaxed mb-6">
                    {product.tagline}
                  </p>

                  <ul className="space-y-2 font-mono text-xs mb-6 border-t border-steel/10 pt-4">
                    {product.specs.map((spec, i) => (
                      <li key={i} className="flex justify-between gap-2 text-slate/75">
                        <span className="text-slate/45">{spec.label}:</span>
                        <span className="font-medium text-slate text-right">{spec.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-steel/10 flex items-center justify-between gap-3">
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-mono text-xs font-semibold uppercase tracking-wider text-slate hover:text-dawn-coral transition-colors"
                  >
                    View Specs →
                  </Link>

                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded bg-[#25D366]/10 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-colors"
                  >
                    WhatsApp Quote
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1200px] rounded-2xl bg-slate p-8 sm:p-12 text-white noise-overlay">
          <span className="section-tag !text-cyan-glow mb-2">BUYER CHECKLIST</span>
          <h2 className="font-display text-3xl font-bold mb-6">Before You Request a Quote</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {BUYER_NOTES.map((note, idx) => (
              <div key={idx} className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                <p className="font-mono text-xs text-dawn-coral font-bold mb-2">0{idx + 1}</p>
                <p className="text-sm leading-relaxed text-white/70">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
