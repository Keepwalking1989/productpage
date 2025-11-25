import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create Categories
    const porcelainCategory = await prisma.category.upsert({
        where: { id: 'porcelain-tiles' },
        update: {},
        create: {
            id: 'porcelain-tiles',
            name: 'Porcelain Tiles',
            description: 'High-quality porcelain tiles for floors and walls',
        },
    });

    const ceramicCategory = await prisma.category.upsert({
        where: { id: 'ceramic-tiles' },
        update: {},
        create: {
            id: 'ceramic-tiles',
            name: 'Ceramic Tiles',
            description: 'Durable ceramic tiles for various applications',
        },
    });

    const slabCategory = await prisma.category.upsert({
        where: { id: 'slab-tiles' },
        update: {},
        create: {
            id: 'slab-tiles',
            name: 'Slab Tiles',
            description: 'Large format slab tiles for modern spaces',
        },
    });

    console.log('✅ Categories created');

    // Create Sizes for Porcelain Tiles
    const size600x1200 = await prisma.size.upsert({
        where: { id: 'porcelain-600x1200' },
        update: {},
        create: {
            id: 'porcelain-600x1200',
            name: '600x1200 mm',
            description: 'Large format porcelain tiles',
            categoryId: porcelainCategory.id,
        },
    });

    const size600x600 = await prisma.size.upsert({
        where: { id: 'porcelain-600x600' },
        update: {},
        create: {
            id: 'porcelain-600x600',
            name: '600x600 mm',
            description: 'Standard square porcelain tiles',
            categoryId: porcelainCategory.id,
        },
    });

    const size800x800 = await prisma.size.upsert({
        where: { id: 'porcelain-800x800' },
        update: {},
        create: {
            id: 'porcelain-800x800',
            name: '800x800 mm',
            description: 'Large square porcelain tiles',
            categoryId: porcelainCategory.id,
        },
    });

    // Create Sizes for Ceramic Tiles
    await prisma.size.upsert({
        where: { id: 'ceramic-300x600' },
        update: {},
        create: {
            id: 'ceramic-300x600',
            name: '300x600 mm',
            description: 'Standard ceramic wall tiles',
            categoryId: ceramicCategory.id,
        },
    });

    await prisma.size.upsert({
        where: { id: 'ceramic-400x400' },
        update: {},
        create: {
            id: 'ceramic-400x400',
            name: '400x400 mm',
            description: 'Square ceramic tiles',
            categoryId: ceramicCategory.id,
        },
    });

    // Create Sizes for Slab Tiles
    await prisma.size.upsert({
        where: { id: 'slab-1200x2400' },
        update: {},
        create: {
            id: 'slab-1200x2400',
            name: '1200x2400 mm',
            description: 'Extra large slab tiles',
            categoryId: slabCategory.id,
        },
    });

    await prisma.size.upsert({
        where: { id: 'slab-1600x3200' },
        update: {},
        create: {
            id: 'slab-1600x3200',
            name: '1600x3200 mm',
            description: 'Premium large format slabs',
            categoryId: slabCategory.id,
        },
    });

    console.log('✅ Sizes created');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`
📊 Summary:
  - Categories: 3
  - Sizes: 7
  - Products: 0 (add via Admin Panel)
  `);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
