import { z } from "zod";

/**
 * Server-side RFQ intake.
 *
 * The contact form previously POSTed straight from the browser to
 * NEXT_PUBLIC_API_URL. That URL is baked into the client bundle at build time,
 * and it is currently http://localhost:5000 — meaning every enquiry submitted
 * from the deployed site fails. Routing through this handler means:
 *
 *   1. the browser always talks to a same-origin URL (no CORS, no localhost),
 *   2. the backend address is a server-only env var that can change per
 *      environment without rebuilding the client,
 *   3. a failure to reach the backend is reported honestly to the buyer so the
 *      enquiry can be re-sent over WhatsApp or phone instead of being lost.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const rfqSchema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().min(1).max(200),
  contactInfo: z.string().trim().min(1).max(200),
  requirements: z.string().trim().min(10).max(5000),
  // Honeypot — real buyers never see or fill this field. Deliberately NOT
  // constrained: a validation error would tell a bot to retry. Anything
  // non-empty here is dropped silently below with a 202.
  website: z.string().max(200).optional(),
});

function backendBaseUrl(): string | null {
  const raw = process.env.BACKEND_API_URL ||
    (process.env.NODE_ENV !== "production" ? "http://localhost:5000" : "");

  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    if (process.env.NODE_ENV === 'production' && ['localhost', '127.0.0.1', '::1'].includes(url.hostname)) {
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
      { success: false, message: "Malformed request." },
      { status: 400 }
    );
  }

  const parsed = rfqSchema.safeParse(body);

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

  const { website, ...inquiry } = parsed.data;

  // Honeypot tripped: acknowledge without storing, so the bot does not retry.
  if (website) {
    return Response.json({ success: true, inquiry: { id: "filtered" } }, { status: 202 });
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
      body: JSON.stringify(inquiry),
      signal: controller.signal,
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => null);

    if (!upstream.ok || !data?.success) {
      return Response.json(
        {
          success: false,
          // Surface upstream validation messages; hide anything else.
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

    return Response.json({ success: true, inquiry: data.inquiry }, { status: 201 });
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
