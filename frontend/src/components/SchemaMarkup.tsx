/**
 * SchemaMarkup — XSS-safe JSON-LD injection component.
 *
 * Renders structured data inside a <script type="application/ld+json"> tag.
 *
 * Security note: JSON.stringify is called on the schema object, which escapes
 * all special characters by default. We additionally replace any HTML-unsafe
 * sequences that JSON.stringify does NOT escape (</script>, <!-- ) to prevent
 * a crafted string value from breaking out of the <script> tag context.
 *
 * @see https://owasp.org/www-community/attacks/xss/
 */

// ─── Utility ──────────────────────────────────────────────────────────────────

/**
 * Safely serialise an arbitrary schema object to a JSON string that is safe
 * to inject into a <script> tag inside an HTML document.
 *
 * Replaces the three sequences that could allow an attacker to break out of a
 * <script> block even when JSON.stringify has already escaped the content:
 *   < → \u003c   > → \u003e   & → \u0026
 */
export function safeJsonLd(schema: unknown): string {
  return JSON.stringify(schema)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

// ─── Prop types ───────────────────────────────────────────────────────────────

interface SchemaMarkupProps {
  /** Pre-built schema object (from seo.ts generators). */
  schema: Record<string, unknown>;
  /** Optional data-testid for automated testing. */
  testId?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Drop-in replacement for ad-hoc inline JSON-LD <script> tags.
 *
 * @example
 * // In a page or layout:
 * import SchemaMarkup from "@/components/SchemaMarkup";
 * import { generateLocalBusinessSchema } from "@/lib/seo";
 *
 * <SchemaMarkup schema={generateLocalBusinessSchema()} />
 */
export default function SchemaMarkup({ schema, testId }: SchemaMarkupProps) {
  return (
    <script
      type="application/ld+json"
      // safeJsonLd prevents XSS via HTML entity escaping of angle brackets.
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
      {...(testId ? { "data-testid": testId } : {})}
    />
  );
}

// ─── Named exports for specific schema types ──────────────────────────────────

/**
 * LocalBusiness / WholesaleStore schema block for the root layout.
 * Reads data directly from the pre-built generator so it is always in sync.
 */
export function LocalBusinessSchemaMarkup({
  schema,
}: {
  schema: Record<string, unknown>;
}) {
  return <SchemaMarkup schema={schema} testId="local-business-schema" />;
}

/**
 * Product schema block for individual product / grade pages.
 */
export function ProductSchemaMarkup({
  schema,
}: {
  schema: Record<string, unknown>;
}) {
  return <SchemaMarkup schema={schema} testId="product-schema" />;
}

/**
 * BreadcrumbList schema block.
 */
export function BreadcrumbSchemaMarkup({
  schema,
}: {
  schema: Record<string, unknown>;
}) {
  return <SchemaMarkup schema={schema} testId="breadcrumb-schema" />;
}
