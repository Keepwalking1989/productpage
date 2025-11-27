'use server';

import prisma from '@/lib/prisma';

export async function getFilters() {
    try {
        const [categories, sizes, finishes, colors] = await Promise.all([
            // Get all categories
            prisma.category.findMany({
                select: { name: true },
                orderBy: { name: 'asc' },
            }),

            // Get all sizes
            prisma.size.findMany({
                select: { name: true },
                orderBy: { name: 'asc' },
            }),

            // Get distinct finishes from products
            prisma.product.findMany({
                select: { finish: true },
                where: { finish: { not: null } },
                distinct: ['finish'],
                orderBy: { finish: 'asc' },
            }),

            // Get distinct colors from products
            prisma.product.findMany({
                select: { color: true },
                where: { color: { not: null } },
                distinct: ['color'],
                orderBy: { color: 'asc' },
            }),
        ]);

        return {
            categories: categories.map(c => c.name),
            sizes: sizes.map(s => s.name),
            finishes: finishes.map(f => f.finish).filter(Boolean) as string[],
            colors: colors.map(c => c.color).filter(Boolean) as string[],
        };
    } catch (error) {
        console.error('Error fetching filters:', error);
        return {
            categories: [],
            sizes: [],
            finishes: [],
            colors: [],
        };
    }
}
