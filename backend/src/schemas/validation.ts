import { z } from 'zod';
import { isValidDateOnly } from '../lib/dateUtils';

const optionalPositiveDecimal = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
  z.number().positive('Value must be a positive number').nullable().optional()
);

const requiredPositiveDecimal = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
  z.number({ required_error: 'Quantity is required' }).positive('Quantity must be greater than 0')
);

/**
 * Line item in a structured RFQ.
 */
export const inquiryItemSchema = z.object({
  materialGrade: z
    .string({ required_error: 'Material grade is required' })
    .trim()
    .min(1, 'Material grade is required')
    .max(100, 'Material grade must be 100 characters or fewer'),
  productType: z
    .string({ required_error: 'Product category is required' })
    .trim()
    .min(1, 'Product category is required')
    .max(120, 'Product category must be 120 characters or fewer'),
  od: optionalPositiveDecimal,
  idDimension: optionalPositiveDecimal,
  length: optionalPositiveDecimal,
  quantity: requiredPositiveDecimal,
  quantityUnit: z
    .string({ required_error: 'Quantity unit is required' })
    .trim()
    .min(1, 'Quantity unit is required')
    .max(20, 'Quantity unit must be 20 characters or fewer'),
  process: z
    .string()
    .trim()
    .max(100, 'Process spec must be 100 characters or fewer')
    .optional()
    .nullable(),
  remarks: z
    .string()
    .trim()
    .max(500, 'Remarks must be 500 characters or fewer')
    .optional()
    .nullable(),
});

export type InquiryItemInput = z.infer<typeof inquiryItemSchema>;

/**
 * Structured RFQ intake schema.
 */
export const createRfqSchema = z.object({
  contactPerson: z
    .string({ required_error: 'Contact person name is required' })
    .trim()
    .min(1, 'Contact person name is required')
    .max(120, 'Contact person name must be 120 characters or fewer'),
  companyName: z
    .string({ required_error: 'Company name is required' })
    .trim()
    .min(1, 'Company name is required')
    .max(200, 'Company name must be 200 characters or fewer'),
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .email('Invalid email address')
    .max(200, 'Email must be 200 characters or fewer'),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .min(5, 'Phone number must be at least 5 digits')
    .max(30, 'Phone number must be 30 characters or fewer'),
  city: z
    .string()
    .trim()
    .max(100, 'City must be 100 characters or fewer')
    .optional()
    .nullable(),
  gstNumber: z
    .string()
    .trim()
    .max(20, 'GST number must be 20 characters or fewer')
    .optional()
    .nullable(),
  deliveryLocation: z
    .string()
    .trim()
    .max(200, 'Delivery location must be 200 characters or fewer')
    .optional()
    .nullable(),
  requiredDeliveryDate: z
    .string()
    .trim()
    .refine((d) => !d || isValidDateOnly(d), {
      message: 'Required delivery date must be in YYYY-MM-DD format with a valid calendar date',
    })
    .optional()
    .nullable(),
  message: z
    .string()
    .trim()
    .max(5000, 'Message must be 5000 characters or fewer')
    .optional()
    .nullable(),
  items: z
    .array(inquiryItemSchema, { required_error: 'At least one line item is required' })
    .min(1, 'RFQ must contain at least one line item')
    .max(50, 'Cannot exceed 50 line items per RFQ'),
  website: z.string().max(200).optional(), // Honeypot field
});

export type CreateRfqInput = z.infer<typeof createRfqSchema>;

/**
 * Validation schema for the legacy inquiry submission.
 * Matches existing simple contact form fields.
 */
export const createInquirySchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(1, 'Name is required')
    .max(120, 'Name must be 120 characters or fewer'),
  company: z
    .string({ required_error: 'Company name is required' })
    .trim()
    .min(1, 'Company name is required')
    .max(200, 'Company name must be 200 characters or fewer'),
  contactInfo: z
    .string({ required_error: 'Contact info is required' })
    .trim()
    .min(1, 'Email or phone is required')
    .max(200, 'Contact info must be 200 characters or fewer'),
  requirements: z
    .string({ required_error: 'Requirements are required' })
    .trim()
    .min(10, 'Please describe your requirements (at least 10 characters)')
    .max(5000, 'Requirements must be 5000 characters or fewer'),
  website: z.string().max(200).optional(), // Honeypot field
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;

/**
 * Query parameters for listing products.
 */
export const listProductsSchema = z.object({
  category: z.enum(['RAW_MATERIAL', 'ALLOY', 'SERVICE']).optional(),
  activeOnly: z
    .string()
    .transform((v) => v === 'true')
    .optional(),
});

export type ListProductsQuery = z.infer<typeof listProductsSchema>;
