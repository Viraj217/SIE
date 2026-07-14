import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

/**
 * GET /api/timeline
 * List all milestones (public).
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const milestones = await prisma.timelineMilestone.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.json({ success: true, data: milestones });
  } catch (error) {
    console.error('Failed to fetch milestones:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch milestones' });
  }
});

/**
 * POST /api/timeline
 * Create a new milestone (admin-only).
 */
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { year, title, description, imagePath, displayOrder } = req.body;

    const milestone = await prisma.timelineMilestone.create({
      data: { year, title, description, imagePath, displayOrder: displayOrder || 0 },
    });

    res.status(201).json({ success: true, data: milestone });
  } catch (error) {
    console.error('Failed to create milestone:', error);
    res.status(500).json({ success: false, message: 'Failed to create milestone' });
  }
});

/**
 * PATCH /api/timeline/:id
 * Update a milestone (admin-only).
 */
router.patch('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string') {
      res.status(400).json({ success: false, message: 'Invalid ID' });
      return;
    }
    const { year, title, description, imagePath, displayOrder } = req.body;

    const data: Record<string, unknown> = {};
    if (year !== undefined) data.year = year;
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (imagePath !== undefined) data.imagePath = imagePath;
    if (displayOrder !== undefined) data.displayOrder = displayOrder;

    const milestone = await prisma.timelineMilestone.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: milestone });
  } catch (error) {
    console.error('Failed to update milestone:', error);
    res.status(500).json({ success: false, message: 'Failed to update milestone' });
  }
});

/**
 * DELETE /api/timeline/:id
 * Delete a milestone (admin-only).
 */
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string') {
      res.status(400).json({ success: false, message: 'Invalid ID' });
      return;
    }
    await prisma.timelineMilestone.delete({ where: { id } });
    res.json({ success: true, message: 'Milestone deleted' });
  } catch (error) {
    console.error('Failed to delete milestone:', error);
    res.status(500).json({ success: false, message: 'Failed to delete milestone' });
  }
});

export default router;
