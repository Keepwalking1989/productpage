import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
    try {
        console.log('🔍 Checking database structure...\n');

        // Check categories
        const categoryCount = await prisma.category.count();
        console.log(`✅ Categories table exists - ${categoryCount} records`);

        const categories = await prisma.category.findMany();
        console.log('Categories:', categories.map(c => c.name).join(', '));

        // Check sizes
        const sizeCount = await prisma.size.count();
        console.log(`\n✅ Sizes table exists - ${sizeCount} records`);

        const sizes = await prisma.size.findMany({ include: { category: true } });
        console.log('Sizes:', sizes.map(s => `${s.name} (${s.category.name})`).join(', '));

        // Check products
        const productCount = await prisma.product.count();
        console.log(`\n✅ Products table exists - ${productCount} records`);

        // Check product images
        const imageCount = await prisma.productImage.count();
        console.log(`✅ ProductImages table exists - ${imageCount} records`);

        console.log('\n✅ All tables exist and are accessible!');
    } catch (error) {
        console.error('❌ Error checking database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkDatabase();
