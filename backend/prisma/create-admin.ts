import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const email = (args[0] || process.env.ADMIN_EMAIL || 'admin@shahindustrial.com').toLowerCase().trim();
  const password = args[1] || process.env.ADMIN_PASSWORD;
  const name = args[2] || 'Shah Admin';

  if (!password || password.length < 6) {
    console.error('\n❌ Error: Please provide a password (minimum 6 characters).');
    console.log('\nUsage:');
    console.log('  npm run admin:create <email> <password> [name]');
    console.log('Example:');
    console.log('  npm run admin:create admin@shahindustrial.com MySecretPassword123 "Admin User"\n');
    process.exit(1);
  }

  console.log(`\n⏳ Setting up admin user (${email})...`);

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      name,
      role: 'OWNER',
    },
    create: {
      email,
      passwordHash,
      name,
      role: 'OWNER',
    },
  });

  console.log(`\n✅ Admin user successfully configured!`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Name:  ${user.name}`);
  console.log(`   Role:  ${user.role}\n`);
}

main()
  .catch((e) => {
    console.error('\n❌ Database operation failed:', e.message || e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
