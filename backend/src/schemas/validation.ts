import { z } from 'zod';

/**
 * Validation schema for the inquiry/quote request form submission.
 * Matches the contact form fields in ContactSection.tsx.
 */
export const createInquirySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(120, 'Name must be 120 characters or fewer'),
  company: z
    .string()
    .min(1, 'Company name is required')
    .max(200, 'Company name must be 200 characters or fewer'),
  contactInfo: z
    .string()
    .min(1, 'Email or phone is required')
    .max(200, 'Contact info must be 200 characters or fewer'),
  requirements: z
    .string()
    .min(10, 'Please describe your requirements (at least 10 characters)')
    .max(5000, 'Requirements must be 5000 characters or fewer'),
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
