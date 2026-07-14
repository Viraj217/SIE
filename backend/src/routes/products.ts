import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

/**
 * GET /api/products
 * Returns the full product catalog with specs (public).
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, active } = req.query;

    const where: Record<string, unknown> = {};

    if (category && typeof category === 'string') {
      where.category = category;
    }

    if (active !== 'false') {
      where.isActive = true;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        specs: { orderBy: { displayOrder: 'asc' } },
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
 * Returns a single product by slug (public).
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
        specs: { orderBy: { displayOrder: 'asc' } },
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

/**
 * POST /api/products
 * Create a new product with specs (admin-only).
 */
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { slug, title, tagline, category, isFeatured, isActive, displayOrder, specs } = req.body;

    const product = await prisma.product.create({
      data: {
        slug,
        title,
        tagline,
        category: category || 'RAW_MATERIAL',
        isFeatured: isFeatured || false,
        isActive: isActive !== false,
        displayOrder: displayOrder || 0,
        specs: {
          create: (specs || []).map((s: { label: string; value: string }, i: number) => ({
            label: s.label,
            value: s.value,
            displayOrder: i,
          })),
        },
      },
      include: { specs: true },
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Failed to create product:', error);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
});

/**
 * PATCH /api/products/:id
 * Update a product and optionally replace its specs (admin-only).
 */
router.patch('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string') {
      res.status(400).json({ success: false, message: 'Invalid ID' });
      return;
    }
    const { title, tagline, slug, category, isFeatured, isActive, displayOrder, specs } = req.body;

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (tagline !== undefined) data.tagline = tagline;
    if (slug !== undefined) data.slug = slug;
    if (category !== undefined) data.category = category;
    if (isFeatured !== undefined) data.isFeatured = isFeatured;
    if (isActive !== undefined) data.isActive = isActive;
    if (displayOrder !== undefined) data.displayOrder = displayOrder;

    // If specs are provided, delete old ones and create new ones
    if (specs && Array.isArray(specs)) {
      await prisma.productSpec.deleteMany({ where: { productId: id } });
      await prisma.productSpec.createMany({
        data: specs.map((s: { label: string; value: string }, i: number) => ({
          productId: id,
          label: s.label,
          value: s.value,
          displayOrder: i,
        })),
      });
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: { specs: { orderBy: { displayOrder: 'asc' } } },
    });

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Failed to update product:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
});

/**
 * DELETE /api/products/:id
 * Delete a product and cascade-delete its specs (admin-only).
 */
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string') {
      res.status(400).json({ success: false, message: 'Invalid ID' });
      return;
    }

    await prisma.product.delete({ where: { id } });

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});

export default router;
