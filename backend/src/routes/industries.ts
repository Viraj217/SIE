import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

/**
 * GET /api/industries
 * List all industry sectors (public).
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const sectors = await prisma.industrySector.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.json({ success: true, data: sectors });
  } catch (error) {
    console.error('Failed to fetch industries:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch industries' });
  }
});

/**
 * POST /api/industries
 * Create a new industry sector (admin-only).
 */
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { name, slug, description, iconName, displayOrder } = req.body;

    const sector = await prisma.industrySector.create({
      data: { name, slug, description, iconName, displayOrder: displayOrder || 0 },
    });

    res.status(201).json({ success: true, data: sector });
  } catch (error) {
    console.error('Failed to create industry:', error);
    res.status(500).json({ success: false, message: 'Failed to create industry' });
  }
});

/**
 * PATCH /api/industries/:id
 * Update a sector (admin-only).
 */
router.patch('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string') {
      res.status(400).json({ success: false, message: 'Invalid ID' });
      return;
    }
    const { name, slug, description, iconName, displayOrder } = req.body;

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (slug !== undefined) data.slug = slug;
    if (description !== undefined) data.description = description;
    if (iconName !== undefined) data.iconName = iconName;
    if (displayOrder !== undefined) data.displayOrder = displayOrder;

    const sector = await prisma.industrySector.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: sector });
  } catch (error) {
    console.error('Failed to update industry:', error);
    res.status(500).json({ success: false, message: 'Failed to update industry' });
  }
});

/**
 * DELETE /api/industries/:id
 * Delete a sector (admin-only).
 */
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string') {
      res.status(400).json({ success: false, message: 'Invalid ID' });
      return;
    }
    await prisma.industrySector.delete({ where: { id } });
    res.json({ success: true, message: 'Industry sector deleted' });
  } catch (error) {
    console.error('Failed to delete industry:', error);
    res.status(500).json({ success: false, message: 'Failed to delete industry' });
  }
});

export default router;
