'use server';

import prisma from '@/lib/prisma';

export type ImageWithAspectRatio = {
    id: string;
    url: string;
    aspectRatio: number;
    productId: string;
    productName: string;
};

export type GroupedImages = {
    square: ImageWithAspectRatio[];
    rectangleHorizontal: ImageWithAspectRatio[];
    rectangleVertical: ImageWithAspectRatio[];
};

/**
 * Fetch all available sizes for the size filter
 */
export async function getAvailableSizes() {
    try {
        const sizes = await prisma.size.findMany({
            include: {
                category: true,
                _count: {
                    select: { products: true },
                },
            },
            orderBy: { name: 'asc' },
        });

        // Only return sizes that have products
        return sizes
            .filter((size) => size._count.products > 0)
            .map((size) => ({
                id: size.id,
                name: size.name,
                categoryName: size.category.name,
                productCount: size._count.products,
            }));
    } catch (error) {
        console.error('Error fetching available sizes:', error);
        return [];
    }
}

/**
 * Fetch all products with images for a specific size
 * If no sizeId is provided, fetch products from the first available size
 */
export async function getHome2Products(sizeId?: string) {
    try {
        // If no sizeId provided, get the first available size
        let targetSizeId = sizeId;
        if (!targetSizeId) {
            const sizes = await getAvailableSizes();
            if (sizes.length === 0) {
                return [];
            }
            targetSizeId = sizes[0].id;
        }

        // Fetch all products with their images for the selected size
        const products = await prisma.product.findMany({
            where: {
                sizeId: targetSizeId,
            },
            include: {
                images: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        // Extract all images with their aspect ratios
        const allImages: ImageWithAspectRatio[] = [];

        for (const product of products) {
            for (const image of product.images) {
                allImages.push({
                    id: image.id,
                    url: image.url,
                    aspectRatio: 1, // Will be calculated on client
                    productId: product.id,
                    productName: product.name,
                });
            }
        }

        return allImages;
    } catch (error) {
        console.error('Error fetching home2 products:', error);
        throw new Error('Failed to fetch products for home2');
    }
}
