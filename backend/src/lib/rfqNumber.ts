import { Prisma } from '@prisma/client';

/**
 * Returns the calendar year according to the business timezone (Asia/Kolkata).
 * This ensures the RFQ sequence rolls over precisely at midnight Indian Standard Time (IST),
 * regardless of the server's local or UTC timezone.
 */
export function getBusinessYear(date: Date = new Date()): number {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
  });
  return parseInt(formatter.format(date), 10);
}

/**
 * Atomically generates the next sequential RFQ identifier (e.g. RFQ-2026-00001).
 *
 * Runs inside a Prisma interactive transaction client (Prisma.TransactionClient)
 * using an atomic PostgreSQL `INSERT ... ON CONFLICT ("year") DO UPDATE SET ... RETURNING` query.
 * If the transaction aborts or rolls back, the counter increment rolls back with it.
 */
export async function generateRfqNumber(tx: Prisma.TransactionClient): Promise<string> {
  const year = getBusinessYear();

  const result = await tx.$queryRaw<{ lastNumber: number }[]>`
    INSERT INTO "RfqCounter" ("year", "lastNumber")
    VALUES (${year}, 1)
    ON CONFLICT ("year")
    DO UPDATE SET "lastNumber" = "RfqCounter"."lastNumber" + 1
    RETURNING "lastNumber"
  `;

  if (!result || result.length === 0 || result[0].lastNumber == null) {
    throw new Error(`Failed to atomically allocate RFQ counter for year ${year}`);
  }

  const seq = Number(result[0].lastNumber);
  return `RFQ-${year}-${String(seq).padStart(5, '0')}`;
}
