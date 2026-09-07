import { businessConfig, CANONICAL_PRODUCTS, SEO_FAQS, CatalogProduct } from "./config";
import type { SteelGrade } from "./grades";

export const SITE_URL = "https://shahindustrialenterprise.com";

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
 * Generate LocalBusiness and Store structured data graph for Schema.org.
 */
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "Store"],
        "@id": `${SITE_URL}/#business`,
        name: businessConfig.name,
        legalName: businessConfig.legalName,
        url: SITE_URL,
        description: businessConfig.description,
        telephone: businessConfig.contacts[0].phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: businessConfig.address.street,
          addressLocality: businessConfig.address.locality,
          addressRegion: businessConfig.address.region,
          postalCode: businessConfig.address.postalCode,
          addressCountry: businessConfig.address.countryCode,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: businessConfig.coordinates.latitude,
          longitude: businessConfig.coordinates.longitude,
        },
        knowsAbout: [
          ...CANONICAL_PRODUCTS.map((p) => p.title),
          ...businessConfig.industries,
        ],
        makesOffer: CANONICAL_PRODUCTS.map((product) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": product.category === "SERVICE" ? "Service" : "Product",
            name: product.title,
            description: product.tagline,
            url: `${SITE_URL}/products/${product.slug}`,
          },
        })),
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
        name: businessConfig.name,
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
 * Generate Product and Offer Schema.org JSON-LD.
 */
export function generateProductJsonLd(product: CatalogProduct) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": product.category === "SERVICE" ? "Service" : "Product",
        "@id": `${SITE_URL}/products/${product.slug}#product`,
        name: product.title,
        description: product.fullDescription || product.tagline,
        url: `${SITE_URL}/products/${product.slug}`,
        category: product.categoryLabel,
        provider: {
          "@type": "LocalBusiness",
          name: businessConfig.name,
          telephone: businessConfig.contacts[0].phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: businessConfig.address.street,
            addressLocality: businessConfig.address.locality,
            addressRegion: businessConfig.address.region,
            postalCode: businessConfig.address.postalCode,
            addressCountry: businessConfig.address.countryCode,
          },
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          priceSpecification: {
            "@type": "PriceSpecification",
            priceType: "Price on Enquiry",
            description: "Custom cut lengths and bulk tonnage rates quoted on requirement.",
          },
          seller: {
            "@type": "Organization",
            name: businessConfig.name,
          },
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
            item: `${SITE_URL}/products/${product.slug}`,
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
 *
 * Deliberately does NOT assert price, stock quantity or certification — only the
 * published standard designations the grade is identified by, and that quotations
 * are given on enquiry.
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
        seller: { "@id": `${SITE_URL}/#business` },
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
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "INR",
          priceSpecification: {
            "@type": "PriceSpecification",
            priceType: "Price on Enquiry",
            description: "Quoted per requirement — grade, diameter, cut length and quantity.",
          },
          seller: { "@id": `${SITE_URL}/#business` },
        },
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
