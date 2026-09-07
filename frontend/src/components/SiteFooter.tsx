import Link from "next/link";
import { businessConfig, CANONICAL_PRODUCTS } from "@/lib/config";
import { STEEL_GRADES } from "@/lib/grades";

/**
 * Sitewide footer.
 *
 * Beyond the legal line, this is the site's internal-linking hub: every product
 * page and every grade page gets a crawlable link from every page on the site.
 * Before this existed the product routes were reachable only from /products.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();
  const primaryContact = businessConfig.contacts.find((c) => c.isPrimary) ?? businessConfig.contacts[0];

  return (
    <footer className="relative z-20 border-t border-white/[0.06] bg-slate text-white noise-overlay">
      <div className="mx-auto max-w-[1300px] px-5 py-14 sm:px-8 sm:py-16 md:px-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Identity + contact */}
          <div className="lg:pr-6">
            <p className="font-display text-[1.05rem] font-bold tracking-[0.06em]">
              SHAH INDUSTRIAL ENTERPRISE
            </p>
            <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/40">
              {businessConfig.establishedClaim}
            </p>

            <address className="mt-5 not-italic font-mono text-[0.72rem] leading-relaxed text-white/55">
              {businessConfig.address.street}
              <br />
              {businessConfig.address.locality}
              <br />
              {businessConfig.address.city} — {businessConfig.address.postalCode}, {businessConfig.address.region}
            </address>

            <div className="mt-5 space-y-1.5 font-mono text-[0.72rem] text-white/60">
              {businessConfig.landlines.map((line) => (
                <p key={line}>
                  <a href={`tel:${line.replace(/[^0-9+]/g, "")}`} className="hover:text-cyan-glow transition-colors">
                    {line}
                  </a>
                </p>
              ))}
              <p>
                <a href={`tel:${primaryContact.phone}`} className="hover:text-cyan-glow transition-colors">
                  {primaryContact.formattedPhone}
                </a>
              </p>
              <p>
                <a href={`mailto:${businessConfig.email}`} className="hover:text-cyan-glow transition-colors">
                  {businessConfig.email}
                </a>
              </p>
              <p className="pt-1 text-white/40">{businessConfig.hours}</p>
            </div>
          </div>

          {/* Materials */}
          <nav aria-label="Materials">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-cyan-glow/80">
              Materials
            </p>
            <ul className="mt-4 space-y-2">
              {CANONICAL_PRODUCTS.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-mono text-[0.73rem] leading-snug text-white/55 hover:text-white transition-colors"
                  >
                    {product.shortTitle ?? product.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Steel grades */}
          <nav aria-label="Steel grades">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-cyan-glow/80">
              Steel Grades
            </p>
            <ul className="mt-4 space-y-2">
              {STEEL_GRADES.map((grade) => (
                <li key={grade.slug}>
                  <Link
                    href={`/steel-grades/${grade.slug}`}
                    className="font-mono text-[0.73rem] leading-snug text-white/55 hover:text-white transition-colors"
                  >
                    {grade.code} <span className="text-white/30">/ {grade.bsDesignation}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/steel-grades"
                  className="font-mono text-[0.73rem] text-dawn-coral hover:underline"
                >
                  All grades →
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company / tools */}
          <nav aria-label="Company">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-cyan-glow/80">
              Company
            </p>
            <ul className="mt-4 space-y-2 font-mono text-[0.73rem] text-white/55">
              <li><Link href="/products" className="hover:text-white transition-colors">Product Catalogue</Link></li>
              <li><Link href="/steel-grades" className="hover:text-white transition-colors">Grade Reference</Link></li>
              <li><Link href="/tools/weight-calculator" className="hover:text-white transition-colors">Steel Weight Calculator</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Printable Catalogue</Link></li>
              <li><Link href="/#industries" className="hover:text-white transition-colors">Industries Served</Link></li>
              <li><Link href="/#milestones" className="hover:text-white transition-colors">Our History</Link></li>
              <li><Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact &amp; Enquiry</Link></li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/[0.07] pt-6 md:flex-row md:items-center">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.15em] text-white/55">
            © {year} Shah Industrial Enterprise
          </p>
          <p className="font-mono text-[0.63rem] tracking-wider text-white/40">
            Iron &amp; Steel Merchants · Darukhana, Mazgaon, Mumbai
          </p>
        </div>
      </div>
    </footer>
  );
}
