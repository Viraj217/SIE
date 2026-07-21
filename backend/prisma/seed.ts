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
  const productsToSeed = [
    {
      slug: 'custom-hacksaw-cutting',
      title: 'Custom Hacksaw Cutting',
      tagline: 'Precision-cut to exact dimensions. No waste. Ready for your lathe or CNC machining center.',
      category: 'SERVICE' as const,
      isFeatured: true,
      displayOrder: 0,
      specs: [
        { label: 'Capability', value: 'Up to Ø 300mm', displayOrder: 0 },
        { label: 'Tolerance', value: '± 1.0mm', displayOrder: 1 },
        { label: 'Materials', value: 'MS, Carbon, Alloy', displayOrder: 2 },
        { label: 'Turnaround', value: 'Same day', displayOrder: 3 },
      ],
    },
    {
      slug: 'mild-steel-shafts',
      title: 'Mild Steel Shafts',
      tagline: 'Bright and black finish steel shafting, available in standard and custom lengths for industrial applications.',
      category: 'RAW_MATERIAL' as const,
      isFeatured: false,
      displayOrder: 1,
      specs: [
        { label: 'Diameter', value: 'Ø 12 – 250mm', displayOrder: 0 },
        { label: 'Lengths', value: '3m to 6m std.', displayOrder: 1 },
        { label: 'Standard', value: 'IS 2062 A/B', displayOrder: 2 },
      ],
    },
    {
      slug: 'carbon-steel-rods',
      title: 'Carbon Steel Rods',
      tagline: 'High-tensile forged bars in EN8, EN9, EN19, and EN24 grades. Normalized for consistent machinability.',
      category: 'ALLOY' as const,
      isFeatured: false,
      displayOrder: 2,
      specs: [
        { label: 'Grades', value: 'EN8/9/19/24', displayOrder: 0 },
        { label: 'Finish', value: 'Forged, Peeled', displayOrder: 1 },
        { label: 'Hardness', value: 'Normalized', displayOrder: 2 },
      ],
    },

    {
      slug: 'alloy-steel-round-bars',
      title: 'Alloy Steel Round Bars',
      tagline: 'High-strength alloy bars tailored for heavy-duty automotive and industrial machinery components.',
      category: 'ALLOY' as const,
      isFeatured: false,
      displayOrder: 3,
      specs: [
        { label: 'Grades', value: 'EN19, EN24, EN353', displayOrder: 0 },
        { label: 'Diameter', value: 'Ø 20 – 300mm', displayOrder: 1 },
        { label: 'Finish', value: 'Black, Peeled, Ground', displayOrder: 2 }
      ],
    },
    {
      slug: 'forged-steel-round-bars',
      title: 'Forged Steel Round Bars',
      tagline: 'Superior grain structure forged bars for maximum structural integrity and impact resistance.',
      category: 'RAW_MATERIAL' as const,
      isFeatured: true,
      displayOrder: 4,
      specs: [
        { label: 'Grades', value: 'Class 4, EN8, EN9', displayOrder: 0 },
        { label: 'Diameter', value: 'Ø 150 – 600mm', displayOrder: 1 },
        { label: 'Condition', value: 'Normalized, UT Tested', displayOrder: 2 }
      ],
    },
    {
      slug: 'roller-shafts',
      title: 'Roller Shafts',
      tagline: 'Precision-machined shafts optimized for extreme torque in sugar mills and heavy crushing equipment.',
      category: 'RAW_MATERIAL' as const,
      isFeatured: false,
      displayOrder: 5,
      specs: [
        { label: 'Material', value: 'EN8, EN9', displayOrder: 0 },
        { label: 'Application', value: 'Crushing & Milling', displayOrder: 1 },
        { label: 'Tolerance', value: 'High Precision', displayOrder: 2 }
      ],
    },
    {
      slug: 'hydraulic-shafts',
      title: 'Hydraulic Shafts',
      tagline: 'Hard chrome plated and induction hardened shafts for earthmoving and fluid power systems.',
      category: 'ALLOY' as const,
      isFeatured: false,
      displayOrder: 6,
      specs: [
        { label: 'Surface', value: 'Hard Chrome', displayOrder: 0 },
        { label: 'Hardness', value: 'Induction Hardened', displayOrder: 1 },
        { label: 'Usage', value: 'Cylinders & Pumps', displayOrder: 2 }
      ],
    },
    {
      slug: 'iron-steel-plates',
      title: 'Iron & Steel Plates',
      tagline: 'Structural and boiler quality plates for heavy fabrication, marine, and pressure vessel applications.',
      category: 'RAW_MATERIAL' as const,
      isFeatured: false,
      displayOrder: 7,
      specs: [
        { label: 'Grades', value: 'IS 2062, ASTM A36', displayOrder: 0 },
        { label: 'Thickness', value: '5mm – 150mm', displayOrder: 1 },
        { label: 'Profile Cutting', value: 'Available', displayOrder: 2 }
      ],
    },
    {
      slug: 'iron-steel-pipes-tubes',
      title: 'Iron & Steel Pipes & Tubes',
      tagline: 'Seamless and ERW pipes offering excellent burst strength for industrial pipelines and structural supports.',
      category: 'RAW_MATERIAL' as const,
      isFeatured: false,
      displayOrder: 8,
      specs: [
        { label: 'Types', value: 'Seamless, ERW', displayOrder: 0 },
        { label: 'Schedule', value: 'Sch 40, Sch 80', displayOrder: 1 },
        { label: 'Standard', value: 'API, ASTM, IS', displayOrder: 2 }
      ],
    },
    {
      slug: 'iron-steel-bars',
      title: 'Iron & Steel Bars',
      tagline: 'Versatile flat, square, and hexagonal profiles for general engineering and construction purposes.',
      category: 'RAW_MATERIAL' as const,
      isFeatured: false,
      displayOrder: 9,
      specs: [
        { label: 'Profiles', value: 'Flat, Square, Hex', displayOrder: 0 },
        { label: 'Grades', value: 'MS, EN8', displayOrder: 1 },
        { label: 'Lengths', value: 'Custom Cut', displayOrder: 2 }
      ],
    },
  ];

  for (const prod of productsToSeed) {
    const existing = await prisma.product.findUnique({
      where: { slug: prod.slug },
    });

    if (!existing) {
      await prisma.product.create({
        data: {
          slug: prod.slug,
          title: prod.title,
          tagline: prod.tagline,
          category: prod.category,
          isFeatured: prod.isFeatured,
          displayOrder: prod.displayOrder,
          specs: {
            create: prod.specs,
          },
        },
      });
      console.log(`  ✓ Created product: ${prod.slug}`);
    } else {
      console.log(`  ⊘ Product ${prod.slug} already exists, skipping`);
    }
  }

  // ── Timeline Milestones ───────────────────────────────────────────────
  const milestonesToSeed = [
    {
      year: '1989',
      title: 'The Foundation',
      description: 'Shah Industrial Enterprise opens its doors in Darukhana, Mazgaon — supplying raw mild steel to local fabrication units across Mumbai.',
      displayOrder: 0,
    },
    {
      year: '2002',
      title: 'Heavy Machinery Expansion',
      description: 'Expanded inventory to include specialized carbon steel and alloy rods for the booming sugar mill and marine sectors, reaching 8 states.',
      displayOrder: 1,
    },
    {
      year: '2015',
      title: 'Precision Processing',
      description: 'Introduced automated, high-tolerance hacksaw cutting — allowing clients to receive exact-dimension stock ready for CNC machining.',
      displayOrder: 2,
    },
    {
      year: 'TODAY',
      title: 'Trusted Backbone',
      description: 'A second-generation legacy, recognized across 18 states for uncompromising material quality and delivery reliability.',
      displayOrder: 3,
    },
  ];

  for (const ms of milestonesToSeed) {
    const existing = await prisma.timelineMilestone.findFirst({
      where: { year: ms.year, title: ms.title },
    });

    if (!existing) {
      await prisma.timelineMilestone.create({
        data: ms,
      });
      console.log(`  ✓ Created timeline milestone: ${ms.year}`);
    } else {
      console.log(`  ⊘ Timeline milestone ${ms.year} already exists, skipping`);
    }
  }

  // ── Industry Sectors ──────────────────────────────────────────────────
  const sectorsToSeed = [
    {
      name: 'Sugar Mills & Processing',
      slug: 'sugar-mills',
      description: 'High-load bearing shafts and crushing rollers that withstand immense rotational torque through continuous seasonal operation cycles.',
      iconName: 'Factory',
      displayOrder: 0,
    },
    {
      name: 'Marine & Offshore',
      slug: 'marine-offshore',
      description: 'Propeller shafts, winch components, and heavy-duty structural steel resistant to saline corrosion and extreme fatigue from ocean conditions.',
      iconName: 'Anchor',
      displayOrder: 1,
    },
    {
      name: 'Earthmoving & Construction',
      slug: 'earthmoving-construction',
      description: 'Hydraulic cylinder rods, bucket pins, and heavy-wear components engineered to survive the most abrasive and high-impact environments.',
      iconName: 'HardHat',
      displayOrder: 2,
    },
    {
      name: 'General Engineering',
      slug: 'general-engineering',
      description: 'Precision-cut raw stock for lathes, CNC machining centers, and bespoke fabrication workshops across the subcontinent.',
      iconName: 'Wrench',
      displayOrder: 3,
    },
  ];

  for (const sec of sectorsToSeed) {
    const existing = await prisma.industrySector.findUnique({
      where: { slug: sec.slug },
    });

    if (!existing) {
      await prisma.industrySector.create({
        data: sec,
      });
      console.log(`  ✓ Created industry sector: ${sec.slug}`);
    } else {
      console.log(`  ⊘ Industry sector ${sec.slug} already exists, skipping`);
    }
  }

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
