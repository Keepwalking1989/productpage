'use server';

import prisma from '@/lib/prisma';

export async function getCategories() {
    try {
        return await prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export async function getSizesByCategory(categoryId: string) {
    try {
        return await prisma.size.findMany({
            where: { categoryId },
            orderBy: { name: 'asc' },
        });
    } catch (error) {
        console.error('Error fetching sizes:', error);
        return [];
    }
}

export async function getCatalogsBySize(sizeId: string) {
    try {
        return await prisma.catalog.findMany({
            where: { sizeId },
            orderBy: { title: 'asc' },
        });
    } catch (error) {
        console.error('Error fetching catalogs:', error);
        return [];
    }
}

export async function getCatalogById(id: string) {
    try {
        return await prisma.catalog.findUnique({
            where: { id },
            include: {
                size: {
                    include: {
                        category: true,
                    },
                },
            },
        });
    } catch (error) {
        console.error('Error fetching catalog:', error);
        return null;
    }
}
