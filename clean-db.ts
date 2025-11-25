import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
    try {
        console.log('🧹 Cleaning database...');

        // Names of categories to KEEP
        const validCategories = ['Porcelain Tiles', 'Ceramic Tiles', 'Slab Tiles'];

        // Delete sizes belonging to invalid categories first
        const deletedSizes = await prisma.size.deleteMany({
            where: {
                category: {
                    name: {
                        notIn: validCategories
                    }
                }
            }
        });
        console.log(`Deleted ${deletedSizes.count} sizes from invalid categories.`);

        // Delete invalid categories
        const deletedCategories = await prisma.category.deleteMany({
            where: {
                name: {
                    notIn: validCategories
                }
            }
        });
        console.log(`Deleted ${deletedCategories.count} invalid categories.`);

        // Verify what's left
        const remainingCategories = await prisma.category.findMany();
        console.log('\n✅ Remaining Categories:', remainingCategories.map(c => c.name).join(', '));

    } catch (error) {
        console.error('❌ Error cleaning database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanDatabase();
