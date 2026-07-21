import type { Metadata } from "next";
import Link from "next/link";
import PrintCatalogButton from "@/components/PrintCatalogButton";
import { SITE_URL, businessInfo } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Steel Product Catalog | Shah Industrial Enterprise",
  description:
    "Browse Shah Industrial Enterprise steel materials and custom cutting services for shafts, rods, alloy bars, and machining stock from Mazgaon, Mumbai.",
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

const PRODUCTS = [
  {
    title: "Custom Hacksaw Cutting",
    category: "Service",
    details: ["Up to Ø 300mm", "Same-day cutting where stock permits", "MS, carbon, and alloy materials"],
    quote: "Share diameter, length, grade, quantity, and tolerance requirement.",
  },
  {
    title: "M.S. & Carbon Steel Rounds",
    category: "Raw Material",
    details: ["Ø 12 – 250mm", "3m to 6m std.", "IS 2062 A/B Standard"],
    quote: "Share diameter, length, quantity, finish, and delivery destination.",
  },
  {
    title: "Carbon Steel Rods",
    category: "Alloy Grades",
    details: ["Grades EN8/9/19/24", "Forged, Peeled Finish", "Normalized Hardness"],
    quote: "Share grade, diameter, cut length, heat treatment need, and quantity.",
  },
  {
    title: "N.S. & Alloy Steel Round Bars",
    category: "Alloy Grades",
    details: ["Grades EN19, EN24, EN353", "100 mm dia to 1000 mm dia", "Black, Peeled, Ground Finish"],
    quote: "Share grade, diameter, cut length, heat treatment need, and quantity.",
  },
  {
    title: "Forged Steel Round Bars",
    category: "Alloy Grades",
    details: ["Class 4, EN8, EN9 Grades", "200 mm dia to 600 mm dia", "Ultrasonic Tested"],
    quote: "Share grade, diameter, cut length, and specific testing requirements.",
  },
  {
    title: "Roller Shafts",
    category: "Raw Material",
    details: ["High Torque Resistance", "Precision Machined", "Sugar mill and heavy equipment"],
    quote: "Share required dimensions, application, and tolerance limits.",
  },
  {
    title: "Hydraulic Shafts",
    category: "Raw Material",
    details: ["Hard Chrome Plated", "Induction Hardened", "Earthmoving applications"],
    quote: "Share diameter, length, plating thickness, and base material preference.",
  },
  {
    title: "Iron & Steel Plates",
    category: "Raw Material",
    details: ["Structural Quality", "Boiler Quality", "Heavy fabrication"],
    quote: "Share thickness, width, length, grade, and required quantity.",
  },
  {
    title: "Heavy Seamless Pipes",
    category: "Raw Material",
    details: ["Seamless and ERW", "High burst strength", "Industrial pipelines"],
    quote: "Share schedule, nominal bore, grade, and required length.",
  },
  {
    title: "Iron & Steel Bars",
    category: "Raw Material",
    details: ["Flat profiles", "Square profiles", "Hexagonal profiles"],
    quote: "Share profile type, dimensions, grade, and quantity.",
  }
];

const BUYER_NOTES = [
  "Mention whether the stock is for machining, fabrication, repair, or resale.",
  "Add urgency if the material is needed for same-day dispatch or breakdown work.",
  "Include delivery location so availability and transport can be checked together.",
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
        about: PRODUCTS.map((product) => product.title),
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/catalog#products`,
        name: "Steel products and services",
        itemListElement: PRODUCTS.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": product.category === "Service" ? "Service" : "Product",
            name: product.title,
            category: product.category,
            description: [...product.details, product.quote].join(" "),
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
      <section className="bg-slate px-5 pb-16 pt-28 text-white sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1100px]">
          <Link href="/#products" className="font-mono text-xs uppercase tracking-[0.16em] text-cyan-glow/75 hover:text-cyan-glow">
            Back to products
          </Link>
          <p className="mt-10 font-mono text-xs uppercase tracking-[0.22em] text-dawn-coral">Catalog</p>
          <h1 className="mt-4 max-w-[760px] font-display text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[1.02]">
            Shah Industrial product catalog
          </h1>
          <p className="mt-6 max-w-[640px] text-[1rem] leading-relaxed text-white/58">
            A quick buyer reference for steel stock, alloy grades, and cut-to-size requirements. Use it to prepare a quote request with fewer follow-up calls.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-md bg-dawn-coral px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-white hover:bg-ember"
            >
              Request Quote
            </Link>
            <PrintCatalogButton />
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 md:px-12">
        <div className="mx-auto grid max-w-[1100px] gap-6 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <article key={product.title} className="rounded-lg border border-steel/10 bg-white p-6 shadow-[0_4px_30px_rgba(22,35,43,0.05)]">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-dawn-coral">{product.category}</p>
              <h2 className="mt-3 font-display text-2xl">{product.title}</h2>
              <ul className="mt-6 space-y-3">
                {product.details.map((detail) => (
                  <li key={detail} className="flex gap-3 text-sm leading-relaxed text-slate/68">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-glow" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-md bg-paper-warm p-4">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-steel">For quoting</p>
                <p className="mt-2 text-sm leading-relaxed text-slate/70">{product.quote}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1100px] rounded-lg bg-slate p-6 text-white sm:p-8">
          <h2 className="font-display text-3xl">Before you enquire</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {BUYER_NOTES.map((note) => (
              <p key={note} className="rounded-md border border-white/8 bg-white/[0.04] p-4 text-sm leading-relaxed text-white/62">
                {note}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
