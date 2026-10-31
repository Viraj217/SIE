import { businessConfig, CANONICAL_PRODUCTS } from "./config";
import { STEEL_GRADES } from "./grades";

export interface WhatsAppProductInquiry {
  productTitle: string;
  grade?: string;
  availableGrades?: string[];
  diameter?: string;
  length?: string;
  quantity?: string;
  deliveryLocation?: string;
  urgency?: string;
  additionalNotes?: string;
}

/**
 * Generate formatted WhatsApp URL for a specific product or grade inquiry.
 * Leaves clean blank prompts for dimensions, quantity, and delivery location.
 */
export function buildProductWhatsAppUrl(
  inquiry: WhatsAppProductInquiry,
  phoneNumber: string = businessConfig.primaryWhatsAppNumber
): string {
  const lines: string[] = [
    `*Inquiry for Shah Industrial Enterprise*`,
    ``,
    `Hello Shah Industrial Team,`,
    `I am interested in requesting a price quotation:`,
    ``,
    `*Product / Material:* ${inquiry.productTitle}`,
  ];

  if (inquiry.grade) {
    lines.push(`*Required Grade:* ${inquiry.grade}`);
  } else if (inquiry.availableGrades && inquiry.availableGrades.length > 0) {
    lines.push(`*Required Grade:* (Available: ${inquiry.availableGrades.join(", ")})`);
  } else {
    lines.push(`*Required Grade:* `);
  }

  const dimVal = inquiry.diameter && inquiry.length
    ? `${inquiry.diameter} x ${inquiry.length}`
    : inquiry.diameter || "";
  lines.push(`*Diameter (mm) x Cut Length (mm):* ${dimVal}`);
  lines.push(`*Quantity (Nos / Kg):* ${inquiry.quantity || ""}`);
  lines.push(`*Delivery Location:* ${inquiry.deliveryLocation || ""}`);

  if (inquiry.urgency) lines.push(`*Urgency:* ${inquiry.urgency}`);
  if (inquiry.additionalNotes) lines.push(`*Additional Requirements:* ${inquiry.additionalNotes}`);

  lines.push(``);
  lines.push(`Please share material availability and quotation.`);

  const messageText = lines.join("\n");
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(messageText)}`;
}

/**
 * Generate general inquiry WhatsApp link.
 */
export function buildGeneralWhatsAppUrl(
  customGreeting?: string,
  phoneNumber: string = businessConfig.primaryWhatsAppNumber
): string {
  const greeting =
    customGreeting ||
    `Hello Shah Industrial Enterprise,\n\nI would like to inquire about steel materials, cut-to-size availability, and pricing.`;

  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(greeting)}`;
}

/**
 * Generate formatted WhatsApp link from RFQ form submission.
 */
export function buildRfqWhatsAppUrl(
  formData: {
    name: string;
    company: string;
    material: string;
    dimensions?: string;
    quantity: string;
    deliveryLocation?: string;
    urgency?: string;
    requirements?: string;
    items?: Array<{ material: string; grade: string; dimensions?: string; quantity: string; process?: string; condition?: string; standard?: string; remarks?: string }>;
  },
  phoneNumber: string = businessConfig.primaryWhatsAppNumber
): string {
  const lines = [
    `*New Material Requirement (via Website RFQ)*`,
    ``,
    `*Buyer:* ${formData.name || "Industrial Buyer"}`,
    `*Company:* ${formData.company || "Direct Requirement"}`,
    `*Material / Service:* ${formData.material || "Steel Raw Material"}`,
  ];

  if (formData.items?.length) {
    lines.push('', '*Material line items:*');
    formData.items.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.material} | Grade: ${item.grade}`);
      if (item.dimensions) lines.push(`   Dimensions: ${item.dimensions}`);
      if (item.quantity) lines.push(`   Quantity: ${item.quantity}`);
      if (item.process) lines.push(`   Processing / Form: ${item.process}`);
      if (item.condition) lines.push(`   Material condition: ${item.condition}`);
      if (item.standard) lines.push(`   Standard: ${item.standard}`);
      if (item.remarks) lines.push(`   Notes: ${item.remarks}`);
    });
  }
  if (!formData.items?.length && formData.dimensions) lines.push(`*Size / Grade:* ${formData.dimensions}`);
  if (!formData.items?.length && formData.quantity) lines.push(`*Quantity:* ${formData.quantity}`);
  if (formData.deliveryLocation) lines.push(`*Delivery Location:* ${formData.deliveryLocation}`);
  if (formData.urgency) lines.push(`*Urgency:* ${formData.urgency}`);
  if (formData.requirements) lines.push(`*Details:* ${formData.requirements}`);

  lines.push(``);
  lines.push(`Please review and share your best ex-yard or delivered price.`);

  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}

// ─── Page-context-aware WhatsApp URL ─────────────────────────────────────────

/**
 * Derive a human-readable page name from a Next.js pathname.
 */
export function derivePageName(pathname: string): string {
  if (!pathname || pathname === "/") return "Home";

  const segments = pathname.replace(/^\//, "").split("/");

  const rootLabels: Record<string, string> = {
    products: "Products Catalogue",
    "steel-grades": "Steel Grades Reference",
    contact: "Contact",
  };

  if (segments.length === 1 && rootLabels[segments[0]]) {
    return rootLabels[segments[0]];
  }

  if (segments[0] === "products" && segments[1]) {
    const product = CANONICAL_PRODUCTS.find((p) => p.slug === segments[1]);
    if (product) return product.title;
    return segments[1]
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  if (segments[0] === "steel-grades" && segments[1]) {
    const grade = STEEL_GRADES.find((g) => g.slug === segments[1]);
    if (grade) return `${grade.code} Steel (${grade.bsDesignation})`;
    return `${segments[1].toUpperCase()} Steel Grade`;
  }

  if (segments[0] === "tools" && segments[1] === "weight-calculator") {
    return "Steel Weight Calculator";
  }

  return segments[segments.length - 1]
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Build a dynamic pre-filled WhatsApp message URL including current page
 * context with prompt fields for buyers to fill in.
 */
export function buildContextualWhatsAppUrl(
  pathname: string,
  phoneNumber: string = businessConfig.primaryWhatsAppNumber
): string {
  if (pathname && pathname.startsWith("/products/")) {
    const slug = pathname.replace("/products/", "").split("/")[0];
    const product = CANONICAL_PRODUCTS.find((p) => p.slug === slug);
    if (product) {
      return buildProductWhatsAppUrl(
        {
          productTitle: product.title,
          availableGrades: product.availableGrades,
        },
        phoneNumber
      );
    }
  }

  if (pathname && pathname.startsWith("/steel-grades/")) {
    const slug = pathname.replace("/steel-grades/", "").split("/")[0];
    const grade = STEEL_GRADES.find((g) => g.slug === slug);
    if (grade) {
      return buildProductWhatsAppUrl(
        {
          productTitle: `${grade.code} Steel (${grade.bsDesignation})`,
          grade: grade.code,
        },
        phoneNumber
      );
    }
  }

  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
  const pageName = derivePageName(pathname);
  const lines = [
    `*Inquiry for Shah Industrial Enterprise*`,
    ``,
    `Hello Shah Industrial Team,`,
    `I am inquiring from the ${pageName} page of your website:`,
    ``,
    `*Product / Material:* `,
    `*Required Grade:* `,
    `*Diameter (mm) x Cut Length (mm):* `,
    `*Quantity (Nos / Kg):* `,
    `*Delivery Location:* `,
    ``,
    `Please share material availability and pricing.`,
  ];

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}
