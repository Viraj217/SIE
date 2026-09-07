import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createInquirySchema, createRfqSchema } from '../schemas/validation';
import { parseDateOnly, serializeDateOnly } from '../lib/dateUtils';
import { generateRfqNumber } from '../lib/rfqNumber';
import { ZodError } from 'zod';
import { requireAuth } from '../middleware/auth';
import { timingSafeEqual } from 'node:crypto';
import { InquiryStatus, InquirySource } from '@prisma/client';

const router = Router();

function validateRelaySecret(req: Request, res: Response): boolean {
  const configured = process.env.RFQ_RELAY_SECRET;

  if (!configured) {
    if (process.env.NODE_ENV === 'production') {
      console.error('RFQ_RELAY_SECRET is required in production.');
      res.status(503).json({ success: false, message: 'Inquiry service is not configured.' });
      return false;
    }
    return true;
  }

  const supplied = req.header('x-rfq-relay-secret') || '';
  const expectedBuffer = Buffer.from(configured);
  const suppliedBuffer = Buffer.from(supplied);
  const matches =
    expectedBuffer.length === suppliedBuffer.length &&
    timingSafeEqual(expectedBuffer, suppliedBuffer);

  if (!matches) {
    res.status(401).json({ success: false, message: 'Unauthorized inquiry source.' });
    return false;
  }

  return true;
}

/**
 * POST /api/inquiries
 * Submit an inquiry or structured RFQ (public).
 *
 * Strict routing:
 * - If the request contains an 'items' property, it is routed to the structured RFQ intake.
 *   If validation fails, it immediately returns 400 and NEVER falls back to legacy.
 * - If 'items' is absent, it routes to the legacy inquiry handler.
 */
router.post('/', async (req: Request, res: Response) => {
  if (!validateRelaySecret(req, res)) return;

  // Honeypot check: reject bot traffic silently before any DB operation
  if (req.body && typeof req.body === 'object' && 'website' in req.body && Boolean(req.body.website)) {
    res.status(202).json({
      success: true,
      message: 'Inquiry received.',
      inquiry: { id: 'filtered' },
    });
    return;
  }

  const hasItems = req.body && typeof req.body === 'object' && Object.prototype.hasOwnProperty.call(req.body, 'items');

  if (hasItems) {
    // ── Structured RFQ Path ──
    try {
      const data = createRfqSchema.parse(req.body);
      const deliveryDate = data.requiredDeliveryDate
        ? parseDateOnly(data.requiredDeliveryDate)
        : null;

      const inquiry = await prisma.$transaction(async (tx) => {
        const rfqNumber = await generateRfqNumber(tx);

        const legacyContactInfo = `${data.email} | ${data.phone}`;
        const legacySummary = [
          `=== RFQ ${rfqNumber} ===`,
          `Contact: ${data.contactPerson} (${data.companyName})`,
          `Items: ${data.items.length} line item(s)`,
          data.deliveryLocation ? `Delivery Location: ${data.deliveryLocation}` : null,
          data.requiredDeliveryDate ? `Required By: ${data.requiredDeliveryDate}` : null,
          data.gstNumber ? `GST: ${data.gstNumber}` : null,
          data.message ? `Notes:\n${data.message}` : null,
        ]
          .filter(Boolean)
          .join('\n');

        return await tx.inquiry.create({
          data: {
            rfqNumber,
            source: InquirySource.WEBSITE,
            status: InquiryStatus.NEW,
            name: data.contactPerson,
            company: data.companyName,
            contactInfo: legacyContactInfo,
            requirements: legacySummary,
            contactPerson: data.contactPerson,
            email: data.email,
            phone: data.phone,
            city: data.city || null,
            gstNumber: data.gstNumber || null,
            deliveryLocation: data.deliveryLocation || null,
            requiredDeliveryDate: deliveryDate,
            message: data.message || null,
            items: {
              create: data.items.map((item) => ({
                materialGrade: item.materialGrade,
                productType: item.productType,
                od: item.od != null ? item.od : null,
                idDimension: item.idDimension != null ? item.idDimension : null,
                length: item.length != null ? item.length : null,
                quantity: item.quantity,
                quantityUnit: item.quantityUnit,
                process: item.process || null,
                remarks: item.remarks || null,
              })),
            },
          },
          include: {
            items: true,
          },
        });
      });

      res.status(201).json({
        success: true,
        message: 'RFQ submitted successfully. The Shah family will be in touch shortly.',
        inquiry: {
          id: inquiry.id,
          rfqNumber: inquiry.rfqNumber,
          createdAt: inquiry.createdAt,
          itemCount: inquiry.items.length,
        },
      });
      return;
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
        return;
      }

      console.error('Failed to create structured RFQ:', error);
      res.status(500).json({
        success: false,
        message: 'Something went wrong while processing the RFQ. Please try again or contact us directly.',
      });
      return;
    }
  }

  // ── Legacy Inquiry Path (no 'items' in body) ──
  try {
    const data = createInquirySchema.parse(req.body);

    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name,
        company: data.company,
        contactInfo: data.contactInfo,
        requirements: data.requirements,
        source: InquirySource.LEGACY,
        status: InquiryStatus.PENDING,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. The Shah family will be in touch shortly.',
      inquiry: {
        id: inquiry.id,
        createdAt: inquiry.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
      return;
    }

    console.error('Failed to create inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again or contact us directly.',
    });
  }
});

/**
 * GET /api/inquiries
 * List all inquiries (admin-only).
 */
router.get('/', requireAuth, async (_req: Request, res: Response) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const serialized = inquiries.map((inq) => ({
      ...inq,
      requiredDeliveryDate: serializeDateOnly(inq.requiredDeliveryDate),
    }));

    res.json({ success: true, data: serialized });
  } catch (error) {
    console.error('Failed to fetch inquiries:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch inquiries' });
  }
});

/**
 * PATCH /api/inquiries/:id
 * Update inquiry status and/or notes (admin-only).
 */
router.patch('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string') {
      res.status(400).json({ success: false, message: 'Invalid ID' });
      return;
    }
    const { status, notes } = req.body || {};

    const data: { status?: InquiryStatus; notes?: string } = {};
    if (status) {
      if (!Object.values(InquiryStatus).includes(status as InquiryStatus)) {
        res.status(400).json({ success: false, message: `Invalid status: ${status}` });
        return;
      }
      data.status = status as InquiryStatus;
    }
    if (notes !== undefined) data.notes = notes;

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data,
      include: {
        items: true,
      },
    });

    res.json({
      success: true,
      data: {
        ...inquiry,
        requiredDeliveryDate: serializeDateOnly(inquiry.requiredDeliveryDate),
      },
    });
  } catch (error) {
    console.error('Failed to update inquiry:', error);
    res.status(500).json({ success: false, message: 'Failed to update inquiry' });
  }
});

/**
 * DELETE /api/inquiries/:id
 * Permanently delete an inquiry (admin-only).
 */
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string') {
      res.status(400).json({ success: false, message: 'Invalid ID' });
      return;
    }

    await prisma.inquiry.delete({ where: { id } });

    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    console.error('Failed to delete inquiry:', error);
    res.status(500).json({ success: false, message: 'Failed to delete inquiry' });
  }
});

export default router;
