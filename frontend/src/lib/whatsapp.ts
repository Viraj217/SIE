import { businessConfig } from "./config";

export interface WhatsAppProductInquiry {
  productTitle: string;
  grade?: string;
  diameter?: string;
  length?: string;
  quantity?: string;
  deliveryLocation?: string;
  urgency?: string;
  additionalNotes?: string;
}

/**
 * Generate formatted WhatsApp URL for a specific product inquiry.
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
    `*Product:* ${inquiry.productTitle}`,
  ];

  if (inquiry.grade) lines.push(`*Grade:* ${inquiry.grade}`);
  if (inquiry.diameter) lines.push(`*Diameter / Dimensions:* ${inquiry.diameter}`);
  if (inquiry.length) lines.push(`*Cut Length:* ${inquiry.length}`);
  if (inquiry.quantity) lines.push(`*Quantity:* ${inquiry.quantity}`);
  if (inquiry.deliveryLocation) lines.push(`*Delivery Location:* ${inquiry.deliveryLocation}`);
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

  if (formData.dimensions) lines.push(`*Size / Grade:* ${formData.dimensions}`);
  if (formData.quantity) lines.push(`*Quantity:* ${formData.quantity}`);
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
 *
 * Examples:
 *   "/"                                     → "Home"
 *   "/products"                             → "Products"
 *   "/products/heavy-steamer-shafts"        → "Heavy Steamer Shafts"
 *   "/steel-grades/en24"                    → "EN24 Steel Grade"
 *   "/tools/weight-calculator"              → "Steel Weight Calculator"
 *   "/contact"                              → "Contact"
 */
export function derivePageName(pathname: string): string {
  if (!pathname || pathname === "/") return "Home";

  const segments = pathname.replace(/^\//, "").split("/");

  // Known root-level pages
  const rootLabels: Record<string, string> = {
    products: "Products Catalogue",
    "steel-grades": "Steel Grades Reference",
    contact: "Contact",
  };

  if (segments.length === 1 && rootLabels[segments[0]]) {
    return rootLabels[segments[0]];
  }

  // Dynamic product slug  →  Title-case the slug words
  if (segments[0] === "products" && segments[1]) {
    return segments[1]
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  // Steel grade slug  →  Uppercase the grade code, e.g. "en24" → "EN24 Steel Grade"
  if (segments[0] === "steel-grades" && segments[1]) {
    return `${segments[1].toUpperCase()} Steel Grade`;
  }

  // Tools
  if (segments[0] === "tools" && segments[1] === "weight-calculator") {
    return "Steel Weight Calculator";
  }

  // Fallback: title-case the last segment
  return segments[segments.length - 1]
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Build a pre-filled WhatsApp message URL that includes the current page
 * context, so the team immediately knows which product/grade the buyer
 * is inquiring about.
 *
 * Message format (as specified):
 * "Hello Shah Industrial Team, I am inquiring from the [Page Name] page.
 *  Please share stock availability and pricing."
 *
 * Usage in Client Components (usePathname):
 * @example
 * const pathname = usePathname();
 * const url = buildContextualWhatsAppUrl(pathname);
 *
 * Usage in Server Components (headers-based):
 * @example
 * import { headers } from "next/headers";
 * const hdrs = await headers();
 * const pathname = hdrs.get("x-pathname") ?? "/";
 * const url = buildContextualWhatsAppUrl(pathname);
 */
export function buildContextualWhatsAppUrl(
  pathname: string,
  phoneNumber: string = businessConfig.primaryWhatsAppNumber
): string {
  const pageName = derivePageName(pathname);
  const message =
    `Hello Shah Industrial Team, I am inquiring from the ${pageName} page. ` +
    `Please share stock availability and pricing.`;

  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

