import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'owner@demo.com' },
    update: {},
    create: { email: 'owner@demo.com', name: 'Owner Demo', role: 'OWNER' }
  });

  const business = await prisma.business.create({
    data: {
      ownerId: user.id,
      name: 'Kedai Sage UMKM',
      category: 'Food & Beverage',
      description: 'Bisnis demo untuk manajemen penjualan harian.',
      address: 'Jakarta',
      currency: 'IDR'
    }
  });

  await prisma.product.createMany({
    data: [
      { businessId: business.id, name: 'Kopi Susu Sage', sku: 'KOP-SAG-001', category: 'Minuman', baseUnit: 'pcs', costPrice: 9000, sellingPrice: 18000, stock: 80, minStock: 15 },
      { businessId: business.id, name: 'Brownies Mini', sku: 'BRW-MIN-001', category: 'Snack', baseUnit: 'pcs', costPrice: 7000, sellingPrice: 15000, stock: 40, minStock: 10 }
    ]
  });
}

main().finally(async () => prisma.$disconnect());
