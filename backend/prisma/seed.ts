import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin User ────────────────────────────────────────────────────────
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@shahindustrial.com' },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('shah2025', 12);
    await prisma.user.create({
      data: {
        email: 'admin@shahindustrial.com',
        passwordHash,
        name: 'Shah Admin',
        role: 'OWNER',
      },
    });
    console.log('  ✓ Created admin user: admin@shahindustrial.com / shah2025');
  } else {
    console.log('  ⊘ Admin user already exists, skipping');
  }

  // ── Products ──────────────────────────────────────────────────────────
  const cuttingService = await prisma.product.create({
    data: {
      slug: 'custom-hacksaw-cutting',
      title: 'Custom Hacksaw Cutting',
      tagline: 'Precision-cut to exact dimensions. No waste. Ready for your lathe or CNC machining center.',
      category: 'SERVICE',
      isFeatured: true,
      displayOrder: 0,
      specs: {
        create: [
          { label: 'Capability', value: 'Up to Ø 300mm', displayOrder: 0 },
          { label: 'Tolerance', value: '± 1.0mm', displayOrder: 1 },
          { label: 'Materials', value: 'MS, Carbon, Alloy', displayOrder: 2 },
          { label: 'Turnaround', value: 'Same day', displayOrder: 3 },
        ],
      },
    },
  });

  const msShafts = await prisma.product.create({
    data: {
      slug: 'mild-steel-shafts',
      title: 'Mild Steel Shafts',
      tagline: 'Bright and black finish steel shafting, available in standard and custom lengths for industrial applications.',
      category: 'RAW_MATERIAL',
      isFeatured: false,
      displayOrder: 1,
      specs: {
        create: [
          { label: 'Diameter', value: 'Ø 12 – 250mm', displayOrder: 0 },
          { label: 'Lengths', value: '3m to 6m std.', displayOrder: 1 },
          { label: 'Standard', value: 'IS 2062 A/B', displayOrder: 2 },
        ],
      },
    },
  });

  const carbonRods = await prisma.product.create({
    data: {
      slug: 'carbon-steel-rods',
      title: 'Carbon Steel Rods',
      tagline: 'High-tensile forged bars in EN8, EN9, EN19, and EN24 grades. Normalized for consistent machinability.',
      category: 'ALLOY',
      isFeatured: false,
      displayOrder: 2,
      specs: {
        create: [
          { label: 'Grades', value: 'EN8/9/19/24', displayOrder: 0 },
          { label: 'Finish', value: 'Forged, Peeled', displayOrder: 1 },
          { label: 'Hardness', value: 'Normalized', displayOrder: 2 },
        ],
      },
    },
  });

  console.log(`  ✓ Created ${3} products: ${cuttingService.slug}, ${msShafts.slug}, ${carbonRods.slug}`);

  // ── Timeline Milestones ───────────────────────────────────────────────
  const milestones = await Promise.all([
    prisma.timelineMilestone.create({
      data: {
        year: '1989',
        title: 'The Foundation',
        description: 'Shah Industrial Enterprise opens its doors in Darukhana, Mazgaon — supplying raw mild steel to local fabrication units across Mumbai.',
        displayOrder: 0,
      },
    }),
    prisma.timelineMilestone.create({
      data: {
        year: '2002',
        title: 'Heavy Machinery Expansion',
        description: 'Expanded inventory to include specialized carbon steel and alloy rods for the booming sugar mill and marine sectors, reaching 8 states.',
        displayOrder: 1,
      },
    }),
    prisma.timelineMilestone.create({
      data: {
        year: '2015',
        title: 'Precision Processing',
        description: 'Introduced automated, high-tolerance hacksaw cutting — allowing clients to receive exact-dimension stock ready for CNC machining.',
        displayOrder: 2,
      },
    }),
    prisma.timelineMilestone.create({
      data: {
        year: 'TODAY',
        title: 'Trusted Backbone',
        description: 'A second-generation legacy, recognized across 18 states for uncompromising material quality and delivery reliability.',
        displayOrder: 3,
      },
    }),
  ]);

  console.log(`  ✓ Created ${milestones.length} timeline milestones`);

  // ── Industry Sectors ──────────────────────────────────────────────────
  const sectors = await Promise.all([
    prisma.industrySector.create({
      data: {
        name: 'Sugar Mills & Processing',
        slug: 'sugar-mills',
        description: 'High-load bearing shafts and crushing rollers that withstand immense rotational torque through continuous seasonal operation cycles.',
        iconName: 'Factory',
        displayOrder: 0,
      },
    }),
    prisma.industrySector.create({
      data: {
        name: 'Marine & Offshore',
        slug: 'marine-offshore',
        description: 'Propeller shafts, winch components, and heavy-duty structural steel resistant to saline corrosion and extreme fatigue from ocean conditions.',
        iconName: 'Anchor',
        displayOrder: 1,
      },
    }),
    prisma.industrySector.create({
      data: {
        name: 'Earthmoving & Construction',
        slug: 'earthmoving-construction',
        description: 'Hydraulic cylinder rods, bucket pins, and heavy-wear components engineered to survive the most abrasive and high-impact environments.',
        iconName: 'HardHat',
        displayOrder: 2,
      },
    }),
    prisma.industrySector.create({
      data: {
        name: 'General Engineering',
        slug: 'general-engineering',
        description: 'Precision-cut raw stock for lathes, CNC machining centers, and bespoke fabrication workshops across the subcontinent.',
        iconName: 'Wrench',
        displayOrder: 3,
      },
    }),
  ]);

  console.log(`  ✓ Created ${sectors.length} industry sectors`);

  console.log('\n✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
