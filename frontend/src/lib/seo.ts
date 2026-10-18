import { businessConfig, CANONICAL_PRODUCTS, SEO_FAQS, CatalogProduct } from "./config";
import type { SteelGrade } from "./grades";
export const SITE_URL = "https://www.shahindustrialenterprise.com";

// Backward-compatible businessInfo mapping
export const businessInfo = {
  name: businessConfig.name,
  legalName: businessConfig.legalName,
  founded: businessConfig.founded,
  description: businessConfig.description,
  address: {
    street: businessConfig.address.street,
    locality: businessConfig.address.locality,
    region: businessConfig.address.region,
    postalCode: businessConfig.address.postalCode,
    country: businessConfig.address.countryCode,
  },
  phones: businessConfig.contacts.map((c) => c.phone),
  contacts: businessConfig.contacts,
  email: businessConfig.email,
  hours: businessConfig.hours,
  coordinates: businessConfig.coordinates,
  serviceAreas: businessConfig.serviceAreas,
  products: CANONICAL_PRODUCTS.map((p) => p.title),
  industries: businessConfig.industries,
};

export const seoFaqs = SEO_FAQS;

/**
 * Generate LocalBusiness and WholesaleStore structured data graph for Schema.org.
 */
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "WholesaleStore"],
        "@id": `${SITE_URL}/#business`,
        name: "Shah Industrial Enterprise",
        legalName: "Shah Industrial Enterprise",
        foundingDate: "1961",
        image: `${SITE_URL}/og-social.png`,
        priceRange: "₹₹₹",
        url: SITE_URL,
        description: businessConfig.description,
        telephone: "+919820023666",
        email: "shahindenterprise@rediffmail.com",
        areaServed: "India",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Plot No. 156, 4th Lane, Darukhana, Mazgaon",
          addressLocality: "Mumbai",
          addressRegion: "Maharashtra",
          postalCode: "400010",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 18.9667,
          longitude: 72.8489,
        },
        knowsAbout: [
          ...CANONICAL_PRODUCTS.map((p) => p.title),
          ...businessConfig.industries,
        ],
        contactPoint: businessConfig.contacts.map((contact) => ({
          "@type": "ContactPoint",
          name: contact.name,
          telephone: contact.phone,
          contactType: "sales",
        })),
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "09:00",
            closes: "19:00",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Shah Industrial Enterprise",
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#business` },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faqs`,
        mainEntity: SEO_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };
}

/**
 * Generate Product Schema.org JSON-LD with BreadcrumbList (offers omitted for B2B price-on-enquiry).
 */
export function generateProductJsonLd(product: CatalogProduct) {
  const url = `${SITE_URL}/products/${product.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": product.category === "SERVICE" ? "Service" : "Product",
        "@id": `${url}#product`,
        name: product.title,
        description: product.fullDescription || product.tagline,
        url,
        category: product.categoryLabel,
        brand: {
          "@type": "Brand",
          name: "Shah Industrial Enterprise",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: `${SITE_URL}/products`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.title,
            item: url,
          },
        ],
      },
    ],
  };
}

/**
 * Generate Breadcrumb Schema.org JSON-LD.
 */
export function generateBreadcrumbJsonLd(crumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith("http") ? crumb.url : `${SITE_URL}${crumb.url}`,
    })),
  };
}

/**
 * Generate Product + BreadcrumbList JSON-LD for a steel grade landing page.
 */
export function generateGradeJsonLd(grade: SteelGrade) {
  const url = `${SITE_URL}/steel-grades/${grade.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#grade`,
        name: `${grade.code} Steel (${grade.bsDesignation})`,
        alternateName: grade.equivalents.map((e) => e.designation),
        description: grade.summary,
        url,
        category: grade.family,
        material: grade.code,
        brand: {
          "@type": "Brand",
          name: "Shah Industrial Enterprise",
        },
        additionalProperty: [
          ...grade.equivalents.map((eq) => ({
            "@type": "PropertyValue",
            name: `${eq.standard} designation`,
            value: eq.designation,
          })),
          ...grade.chemistry.map((row) => ({
            "@type": "PropertyValue",
            name: row.element,
            value: row.range,
          })),
          ...grade.mechanical.map((row) => ({
            "@type": "PropertyValue",
            name: row.property,
            value: row.value,
          })),
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Steel Grades", item: `${SITE_URL}/steel-grades` },
          { "@type": "ListItem", position: 3, name: `${grade.code} Steel`, item: url },
        ],
      },
    ],
  };
}
