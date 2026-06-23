import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Seeding database...');

  // Create some initial products
  const product = await prisma.product.create({
    data: {
      name: 'Intel Core i5-12400F',
      category: 'CPU',
      qty: 10,
      sdp: 550.00,
      page_price: 650.00,
      srp: 699.00,
      status: 'active'
    }
  });

  // Create a base configurator
  const configurator = await prisma.configurator.create({
    data: {
      name: 'Budget Gaming PC',
      status: 'active'
    }
  });

  // Map them together
  await prisma.configuratorProductMapping.create({
    data: {
      configuratorId: configurator.id,
      productId: product.id,
      category: product.category,
      qty: 1,
      sdp: product.sdp,
      totalSdp: product.sdp, // qty * sdp
      pagePrice: product.page_price,
      srp: product.srp,
      margin: 100.00, // pagePrice - totalSdp (650 - 550)
      marginPercentage: 15.38 // (100 / 650) * 100
    }
  });

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
