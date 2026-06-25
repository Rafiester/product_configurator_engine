import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding categories...');
  const defaultCategories = [
    'GPU',
    'RAM',
    'CPU',
    'Chassis',
    'Motherboard',
    'SSD',
    'PSU',
    'Cooler',
    'ARGB / Accessories'
  ];

  for (const name of defaultCategories) {
    const existing = await prisma.category.findUnique({
      where: { name }
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          name,
          status: 'active'
        }
      });
      console.log(`Created category: ${name}`);
    } else {
      console.log(`Category already exists: ${name}`);
    }
  }

  console.log('Seeding categories finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
