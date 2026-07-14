import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createInquirySchema } from '../schemas/validation';
import { ZodError } from 'zod';
import { requireAuth } from '../middleware/auth';

const router = Router();

/**
 * POST /api/inquiries
 * Submit a new customer inquiry / quote request (public).
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = createInquirySchema.parse(req.body);

    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name,
        company: data.company,
        contactInfo: data.contactInfo,
        requirements: data.requirements,
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
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: inquiries });
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
    const { status, notes } = req.body;

    const data: Record<string, unknown> = {};
    if (status) data.status = status;
    if (notes !== undefined) data.notes = notes;

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: inquiry });
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
