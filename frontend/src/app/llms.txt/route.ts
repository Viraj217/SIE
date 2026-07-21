import { SITE_URL, businessInfo, seoFaqs } from "@/lib/seo";

export function GET() {
  const content = `# ${businessInfo.name}

> ${businessInfo.description}

${businessInfo.name} is a steel and iron merchant based in ${businessInfo.address.street}, ${businessInfo.address.locality}, ${businessInfo.address.region} ${businessInfo.address.postalCode}. The business was established in ${businessInfo.founded}.

## Core offerings

${businessInfo.products.map((product) => `- ${product}`).join("\n")}

## Industries served

${businessInfo.industries.map((industry) => `- ${industry}`).join("\n")}

## Service area

${businessInfo.serviceAreas.join(", ")}

## Quote requirements

For accurate quoting, buyers should share material/service, grade, dimensions, quantity, delivery location, urgency, and preferred contact method.

## Contact

${businessInfo.contacts.map((contact) => `- ${contact.name}: ${contact.phone}`).join("\n")}
- Hours: ${businessInfo.hours}
- Location: ${businessInfo.address.street}, ${businessInfo.address.locality}, ${businessInfo.address.region} ${businessInfo.address.postalCode}, India

## Important pages

- [Homepage](${SITE_URL}/)
- [Product catalog](${SITE_URL}/catalog)
- [Sitemap](${SITE_URL}/sitemap.xml)

## FAQs

${seoFaqs.map((faq) => `### ${faq.question}\n${faq.answer}`).join("\n\n")}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
