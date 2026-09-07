/**
 * Date-only utilities for handling YYYY-MM-DD calendar dates.
 *
 * PostgreSQL `@db.Date` stores only calendar year, month, and day without timezone offsets.
 * To prevent any date-shifting bugs when moving between browser client, server runtime,
 * and database drivers across different timezones (e.g. UTC vs Asia/Kolkata), dates must
 * always be parsed and serialized using UTC date parts.
 */

const DATE_ONLY_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Validates if a string is in YYYY-MM-DD format and corresponds to a real calendar date.
 */
export function isValidDateOnly(dateStr: string): boolean {
  if (typeof dateStr !== 'string') return false;
  const match = DATE_ONLY_REGEX.exec(dateStr);
  if (!match) return false;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  if (year < 1900 || year > 2200 || month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  const d = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  return (
    d.getUTCFullYear() === year &&
    d.getUTCMonth() === month - 1 &&
    d.getUTCDate() === day
  );
}

/**
 * Parses a 'YYYY-MM-DD' calendar date string into a Date object at UTC midnight.
 * Throws if the input is not a valid calendar date string.
 */
export function parseDateOnly(dateStr: string): Date {
  const match = DATE_ONLY_REGEX.exec(dateStr);
  if (!match) {
    throw new Error(`Invalid date format. Expected YYYY-MM-DD, received: "${dateStr}"`);
  }

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`Invalid calendar date: "${dateStr}"`);
  }

  return date;
}

/**
 * Formats a Date object or ISO string into a 'YYYY-MM-DD' string using UTC date components.
 * Returns null if input is null, undefined, or invalid.
 */
export function serializeDateOnly(date: Date | string | null | undefined): string | null {
  if (!date) return null;

  if (typeof date === 'string') {
    // If it's already a clean YYYY-MM-DD string, return it directly if valid
    if (DATE_ONLY_REGEX.test(date)) {
      return isValidDateOnly(date) ? date : null;
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
  }

  if (date instanceof Date) {
    if (isNaN(date.getTime())) return null;
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
  }

  return null;
}
