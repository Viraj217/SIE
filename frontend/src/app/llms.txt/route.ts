import { SITE_URL, seoFaqs } from "@/lib/seo";
import { businessConfig, CANONICAL_PRODUCTS } from "@/lib/config";
import { STEEL_GRADES } from "@/lib/grades";

export const dynamic = "force-static";

export function GET() {
  const content = `# ${businessConfig.name}

> ${businessConfig.description}

${businessConfig.name} is an iron and steel merchant established in ${businessConfig.founded} in ${businessConfig.address.fullFormatted}.
Operating in the Darukhana steel market in Mazgaon, Mumbai, the firm supplies heavy shafting, forged rounds, alloy bars, and in-house hacksaw cut-to-size material across ${businessConfig.statesSuppliedClaim} states in India.

## Core Offerings & Materials

${CANONICAL_PRODUCTS.map(
  (product) => `### [${product.title}](${SITE_URL}/products/${product.slug})
- Category: ${product.categoryLabel}
- Diameter range: ${product.diameterRange || 'As specified'}
- Available grades: ${product.availableGrades?.join(', ') || 'Mild steel, Carbon, Alloy'}
- Summary: ${product.tagline}
- Cutting tolerance: ±1.0 mm straight cuts
- URL: ${SITE_URL}/products/${product.slug}
`
).join("\n")}

## Steel Grades Supplied

${STEEL_GRADES.map(
  (grade) => `### [${grade.code} — ${grade.name}](${SITE_URL}/steel-grades/${grade.slug})
- Standard designation: ${grade.bsDesignation}
- Equivalents: ${grade.equivalents.map((eq) => `${eq.standard} ${eq.designation}`).join('; ')}
- Family: ${grade.family}
- Summary: ${grade.summary}
- Typical applications: ${grade.applications.join('; ')}
- URL: ${SITE_URL}/steel-grades/${grade.slug}
`
).join("\n")}

Note: grade designations above are published standard references (BS 970, IS 1570, AISI/SAE, DIN/EN) for identification. Chemistry and mechanical properties of supplied material are governed by the Mill Test Certificate for that heat.

## Engineering Tools

- [Steel Weight Calculator](${SITE_URL}/tools/weight-calculator): Calculate theoretical weights in kg and Metric Tons for round bars, shafts, seamless pipes, and rectangular profiles.

## Industries Served

${businessConfig.industries.map((industry) => `- ${industry}`).join("\n")}

## Service Area & Reach

- Operating Base: Darukhana, Mazgaon, Mumbai, Maharashtra 400010
- Coverage: Pan-India across ${businessConfig.statesSuppliedClaim} states (Maharashtra, Gujarat, Goa, Karnataka, Tamil Nadu, Punjab, Rajasthan, etc.)

## Procurement & RFQ Process

1. Submit requirement details: steel grade, diameter (mm), cut length (mm), quantity (pieces or tonnage), delivery location, and urgency.
2. The Shah family confirms yard inventory and provides an ex-yard or delivered quotation within 2 hours.
3. Materials cut to ±1.0mm tolerance and dispatched with test certificates upon request.

## Contact & Yard Desk

${businessConfig.contacts
  .map((c) => `- ${c.name} (${c.role}): ${c.phone} | WhatsApp: +${c.whatsapp}`)
  .join("\n")}
- Email: ${businessConfig.email}
- Yard Hours: ${businessConfig.hours}

## Key Links

- [Homepage](${SITE_URL}/)
- [Product Catalog](${SITE_URL}/products)
- [Steel Grade Reference](${SITE_URL}/steel-grades)
- [Steel Weight Calculator](${SITE_URL}/tools/weight-calculator)
- [Sitemap XML](${SITE_URL}/sitemap.xml)

## Frequently Asked Questions

${seoFaqs.map((faq) => `### ${faq.question}\n${faq.answer}`).join("\n\n")}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
