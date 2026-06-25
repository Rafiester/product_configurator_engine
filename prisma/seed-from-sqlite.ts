import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting SQLite dump import to PostgreSQL database...');

  // Read JSON files
  const products = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'products_dump.json'), 'utf-8')
  );
  const configurators = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'configurators_dump.json'), 'utf-8')
  );
  const mappings = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'mappings_dump.json'), 'utf-8')
  );

  console.log(`Loaded ${products.length} products, ${configurators.length} configurators, and ${mappings.length} mappings.`);

  // Clean the target tables first (wipe and replace)
  console.log('Cleaning existing records in database...');
  await prisma.builderProductMapping.deleteMany();
  await prisma.product.deleteMany();
  await prisma.builder.deleteMany();

  // Seed Products
  console.log('Importing products...');
  for (const p of products) {
    await prisma.product.create({
      data: {
        id: p.id,
        name: p.name,
        category: p.category,
        qty: parseInt(p.qty) || 0,
        sdp: parseFloat(p.sdp) || 0,
        page_price: parseFloat(p.page_price) || 0,
        srp: parseFloat(p.srp) || 0,
        status: p.status || 'active',
        deletedAt: p.deleted_at ? new Date(p.deleted_at) : null,
        createdAt: p.created_at ? new Date(p.created_at) : new Date(),
        updatedAt: p.updated_at ? new Date(p.updated_at) : new Date(),
      },
    });
  }

  // Seed Builders
  console.log('Importing builders...');
  for (const c of configurators) {
    await prisma.builder.create({
      data: {
        id: c.id,
        name: c.name,
        status: c.status || 'active',
        createdAt: c.created_at ? new Date(c.created_at) : new Date(),
        updatedAt: c.updated_at ? new Date(c.updated_at) : new Date(),
      },
    });
  }

  // Seed Mappings
  console.log('Importing mappings...');
  for (const m of mappings) {
    await prisma.builderProductMapping.create({
      data: {
        id: m.id,
        builderId: m.configurator_id,
        productId: m.product_id,
        category: m.category,
        qty: parseInt(m.qty) || 0,
        sdp: parseFloat(m.sdp) || 0,
        totalSdp: parseFloat(m.total_sdp) || 0,
        pagePrice: parseFloat(m.page_price) || 0,
        srp: parseFloat(m.srp) || 0,
        margin: parseFloat(m.margin) || 0,
        marginPercentage: parseFloat(m.margin_percentage) || 0,
        createdAt: m.created_at ? new Date(m.created_at) : new Date(),
        updatedAt: m.updated_at ? new Date(m.updated_at) : new Date(),
      },
    });
  }

  console.log('SQLite data import completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
