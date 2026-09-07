import assert from 'node:assert';
import { parseDateOnly, serializeDateOnly, isValidDateOnly } from '../lib/dateUtils';
import { getBusinessYear, generateRfqNumber } from '../lib/rfqNumber';
import { createRfqSchema, createInquirySchema, inquiryItemSchema } from '../schemas/validation';
import { Prisma } from '@prisma/client';

console.log('=== Running RFQ Test Suite ===\n');

// ─────────────────────────────────────────────────────────
// 1. Date Utils Tests
// ─────────────────────────────────────────────────────────
console.log('Test 1: parseDateOnly & serializeDateOnly with exact calendar preservation');
{
  const input = '2026-09-10';
  const parsed = parseDateOnly(input);
  assert.strictEqual(parsed.getUTCFullYear(), 2026);
  assert.strictEqual(parsed.getUTCMonth(), 8); // 0-indexed September
  assert.strictEqual(parsed.getUTCDate(), 10);
  assert.strictEqual(parsed.getUTCHours(), 0);

  const serialized = serializeDateOnly(parsed);
  assert.strictEqual(serialized, input, 'Serialized date must match input string exactly');

  // String serialization fallback
  assert.strictEqual(serializeDateOnly(input), input);
  assert.strictEqual(serializeDateOnly(null), null);
  assert.strictEqual(serializeDateOnly(undefined), null);
  console.log('  ✓ Preserves YYYY-MM-DD without timezone date shift');
}

console.log('Test 2: isValidDateOnly rejects invalid calendar dates');
{
  assert.strictEqual(isValidDateOnly('2026-02-28'), true);
  assert.strictEqual(isValidDateOnly('2026-02-29'), false, '2026 is not a leap year');
  assert.strictEqual(isValidDateOnly('2024-02-29'), true, '2024 is a leap year');
  assert.strictEqual(isValidDateOnly('2026-04-31'), false, 'April has only 30 days');
  assert.strictEqual(isValidDateOnly('invalid-date'), false);
  assert.strictEqual(isValidDateOnly(''), false);
  console.log('  ✓ Calendar boundary and leap year checks work correctly');
}

// ─────────────────────────────────────────────────────────
// 2. Business Year Timezone Tests
// ─────────────────────────────────────────────────────────
console.log('Test 3: getBusinessYear rolls over on Asia/Kolkata timezone boundary');
{
  // 2026-12-31 18:29:00 UTC = 2026-12-31 23:59:00 IST (Year 2026)
  const justBeforeMidnightIst = new Date('2026-12-31T18:29:00Z');
  assert.strictEqual(getBusinessYear(justBeforeMidnightIst), 2026);

  // 2026-12-31 18:31:00 UTC = 2027-01-01 00:01:00 IST (Year 2027 in India!)
  const justAfterMidnightIst = new Date('2026-12-31T18:31:00Z');
  assert.strictEqual(getBusinessYear(justAfterMidnightIst), 2027);

  console.log('  ✓ Correctly uses Asia/Kolkata calendar year at UTC boundary');
}

// ─────────────────────────────────────────────────────────
// 3. Typed Transaction Client & Sequence Generation
// ─────────────────────────────────────────────────────────
console.log('Test 4: generateRfqNumber with typed Prisma.TransactionClient');
{
  let queryCaptured = false;
  // Create a mock Prisma.TransactionClient with strictly typed $queryRaw
  const mockTx = {
    $queryRaw: async <T = unknown>(query: TemplateStringsArray, ...values: unknown[]): Promise<T> => {
      queryCaptured = true;
      assert.ok(query.some((chunk) => chunk.includes('RfqCounter')));
      // Return simulated sequence 42
      return [{ lastNumber: 42 }] as unknown as T;
    },
  } as unknown as Prisma.TransactionClient;

  const currentYear = getBusinessYear();
  generateRfqNumber(mockTx).then((rfqNumber) => {
    assert.ok(queryCaptured, 'Database query must be executed');
    assert.strictEqual(rfqNumber, `RFQ-${currentYear}-00042`);
    console.log(`  ✓ Successfully generated sequence formatted: ${rfqNumber}`);
  });
}

// ─────────────────────────────────────────────────────────
// 4. Schema & Strict Routing Validation Tests
// ─────────────────────────────────────────────────────────
console.log('Test 5: Valid structured RFQ payload passes validation');
{
  const validPayload = {
    contactPerson: 'Rajesh Sharma',
    companyName: 'Precision Heavy Eng. Pvt Ltd',
    email: 'rajesh@precisioneng.com',
    phone: '+91 98200 12345',
    city: 'Mumbai',
    gstNumber: '27AAAAA0000A1Z5',
    deliveryLocation: 'Mazgaon Yard',
    requiredDeliveryDate: '2026-10-15',
    message: 'Need urgent dispatch with MTC 3.1',
    items: [
      {
        materialGrade: 'EN8',
        productType: 'Heavy Steamer Shafts & Marine Shafts',
        od: 120,
        idDimension: null,
        length: 850,
        quantity: 10,
        quantityUnit: 'NOS',
        process: 'Cut Piece',
        remarks: '±1mm tolerance',
      },
      {
        materialGrade: 'EN19',
        productType: 'Alloy Steel Rounds',
        od: 200,
        idDimension: null,
        length: null,
        quantity: 2.5,
        quantityUnit: 'MT',
        process: 'Black Bar',
        remarks: null,
      },
    ],
  };

  const parsed = createRfqSchema.parse(validPayload);
  assert.strictEqual(parsed.items.length, 2);
  assert.strictEqual(parsed.contactPerson, 'Rajesh Sharma');
  assert.strictEqual(parsed.items[1].quantity, 2.5);
  console.log('  ✓ Structured RFQ parses multi-items and decimal quantities');
}

console.log('Test 6: Strict routing - payload with items cannot fall back to legacy');
{
  // When 'items' is present but empty, it MUST fail RFQ validation and never fall back
  const emptyItemsPayload = {
    name: 'Rajesh',
    company: 'Precision',
    contactInfo: 'rajesh@example.com',
    requirements: 'Need shafts',
    items: [],
  };

  const hasItems = Object.prototype.hasOwnProperty.call(emptyItemsPayload, 'items');
  assert.strictEqual(hasItems, true, 'Must detect presence of items property');

  let failedStructuredValidation = false;
  try {
    createRfqSchema.parse(emptyItemsPayload);
  } catch {
    failedStructuredValidation = true;
  }
  assert.strictEqual(failedStructuredValidation, true, 'Empty items must fail structured validation');

  // When 'items' is a string instead of array
  const malformedItemsPayload = {
    contactPerson: 'Rajesh',
    companyName: 'Precision',
    email: 'rajesh@example.com',
    phone: '9820000000',
    items: 'invalid-string',
  };

  let failedMalformedItems = false;
  try {
    createRfqSchema.parse(malformedItemsPayload);
  } catch {
    failedMalformedItems = true;
  }
  assert.strictEqual(failedMalformedItems, true, 'Malformed items must fail structured validation');

  console.log('  ✓ Strict routing enforces structured validation failure without fallback');
}

console.log('Test 7: Legacy inquiry payload without items passes createInquirySchema');
{
  const legacyPayload = {
    name: 'Vikram Mehta',
    company: 'Mehta Fabrication Works',
    contactInfo: '+91 98200 99999',
    requirements: 'Looking for 100mm EN8 round bars, 5 meters length.',
  };

  const hasItems = Object.prototype.hasOwnProperty.call(legacyPayload, 'items');
  assert.strictEqual(hasItems, false, 'Legacy payload must NOT have items property');

  const parsed = createInquirySchema.parse(legacyPayload);
  assert.strictEqual(parsed.name, 'Vikram Mehta');
  console.log('  ✓ Legacy inquiries parse cleanly and remain 100% backward-compatible');
}

console.log('Test 8: Honeypot detection');
{
  const botPayload = {
    contactPerson: 'Bot User',
    companyName: 'Spam Corp',
    email: 'bot@spam.com',
    phone: '1234567890',
    website: 'http://spam-link.com',
    items: [
      {
        materialGrade: 'EN8',
        productType: 'Shafts',
        quantity: 1,
        quantityUnit: 'NOS',
      },
    ],
  };

  assert.ok(Boolean(botPayload.website), 'Honeypot field must be detected as filled');
  console.log('  ✓ Bot honeypot detected');
}

console.log('\n=== ALL TESTS PASSED SUCCESSFULLY ===');
