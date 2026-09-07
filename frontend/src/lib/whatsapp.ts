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
