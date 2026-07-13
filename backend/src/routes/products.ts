import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * GET /api/products
 * Returns the full product catalog with specs, ordered by displayOrder.
 * Optionally filter by category or active status.
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, active } = req.query;

    const where: Record<string, unknown> = {};

    if (category && typeof category === 'string') {
      where.category = category;
    }

    // Default to active-only unless explicitly set to 'false'
    if (active !== 'false') {
      where.isActive = true;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        specs: {
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

/**
 * GET /api/products/:slug
 * Returns a single product by slug, with specs.
 */
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    if (typeof slug !== 'string') {
      res.status(400).json({ success: false, message: 'Invalid product slug' });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        specs: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
});

export default router;
