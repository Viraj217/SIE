import { z } from "zod";

/**
 * Server-side RFQ intake proxy.
 *
 * Routes requests to the internal Express backend `POST /api/inquiries`.
 * Supports both structured RFQ payloads (with `items`) and legacy payloads,
 * applies honeypot filtering, and protects internal secrets.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const optionalPositiveNumber = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? null : Number(v)),
  z.number().positive('Value must be positive').nullable().optional()
);

const itemSchema = z.object({
  materialGrade: z.string().trim().min(1, 'Material grade is required').max(100),
  productType: z.string().trim().min(1, 'Product category is required').max(120),
  od: optionalPositiveNumber,
  idDimension: optionalPositiveNumber,
  length: optionalPositiveNumber,
  quantity: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z.number().positive('Quantity must be greater than 0')
  ),
  quantityUnit: z.string().trim().min(1, 'Quantity unit is required').max(20),
  process: z.string().trim().max(100).optional().nullable(),
  remarks: z.string().trim().max(500).optional().nullable(),
});

const structuredRfqSchema = z.object({
  contactPerson: z.string().trim().min(1, 'Contact person name is required').max(120),
  companyName: z.string().trim().min(1, 'Company name is required').max(200),
  email: z.string().trim().email('Invalid email address').max(200),
  phone: z.string().trim().min(5, 'Phone number must be at least 5 digits').max(30),
  city: z.string().trim().max(100).optional().nullable(),
  gstNumber: z.string().trim().max(20).optional().nullable(),
  deliveryLocation: z.string().trim().max(200).optional().nullable(),
  requiredDeliveryDate: z
    .string()
    .trim()
    .refine((v) => !v || DATE_REGEX.test(v), {
      message: 'Date must be in YYYY-MM-DD format',
    })
    .optional()
    .nullable(),
  message: z.string().trim().max(5000).optional().nullable(),
  items: z.array(itemSchema).min(1, 'At least one line item is required').max(50),
  website: z.string().max(200).optional(),
});

const legacyRfqSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  company: z.string().trim().min(1, 'Company name is required').max(200),
  contactInfo: z.string().trim().min(1, 'Contact info is required').max(200),
  requirements: z.string().trim().min(10, 'Requirements must be at least 10 characters').max(5000),
  website: z.string().max(200).optional(),
});

function backendBaseUrl(): string | null {
  const raw =
    process.env.BACKEND_API_URL ||
    (process.env.NODE_ENV !== "production" ? "http://localhost:5000" : "");

  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    if (
      process.env.NODE_ENV === 'production' &&
      ['localhost', '127.0.0.1', '::1'].includes(url.hostname)
    ) {
      return null;
    }
    return url.toString().replace(/\/+$/, "");
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, message: "Malformed request body." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== 'object') {
    return Response.json(
      { success: false, message: "Request body must be an object." },
      { status: 400 }
    );
  }

  const hasItems = Object.prototype.hasOwnProperty.call(body, 'items');

  let payloadToSend: Record<string, unknown>;
  let trippedHoneypot = false;

  if (hasItems) {
    const parsed = structuredRfqSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }
    const { website, ...rest } = parsed.data;
    if (website) trippedHoneypot = true;
    payloadToSend = rest;
  } else {
    const parsed = legacyRfqSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }
    const { website, ...rest } = parsed.data;
    if (website) trippedHoneypot = true;
    payloadToSend = rest;
  }

  // Honeypot tripped: acknowledge without forwarding to protect database & relay
  if (trippedHoneypot) {
    return Response.json(
      { success: true, inquiry: { id: "filtered" } },
      { status: 202 }
    );
  }

  const backendUrl = backendBaseUrl();
  const relaySecret = process.env.RFQ_RELAY_SECRET;

  if (!backendUrl || (process.env.NODE_ENV === 'production' && !relaySecret)) {
    console.error('RFQ relay is not configured for this deployment.');
    return Response.json(
      {
        success: false,
        message: "Our online enquiry desk is not configured just now.",
        fallback: true,
      },
      { status: 503 }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const upstream = await fetch(`${backendUrl}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(relaySecret ? { "x-rfq-relay-secret": relaySecret } : {}),
      },
      body: JSON.stringify(payloadToSend),
      signal: controller.signal,
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => null);

    if (!upstream.ok || !data?.success) {
      return Response.json(
        {
          success: false,
          message:
            upstream.status === 400 && data?.message
              ? data.message
              : "We could not record your enquiry just now.",
          errors: upstream.status === 400 ? data?.errors : undefined,
          fallback: upstream.status !== 400,
        },
        { status: upstream.status === 400 ? 400 : 502 }
      );
    }

    return Response.json(
      {
        success: true,
        message: data.message,
        inquiry: data.inquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("RFQ forwarding failed:", error);
    return Response.json(
      {
        success: false,
        message: "We could not reach our enquiry desk just now.",
        fallback: true,
      },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
