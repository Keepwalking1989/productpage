'use server';

import prisma from '@/lib/prisma';
import { parseSizeName } from '@/lib/size-utils';

export type ImageWithAspectRatio = {
    id: string;
    url: string;
    aspectRatio: number;
    productId: string;
    productName: string;
    sizeName: string;
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
            .map((size) => {
                const sizeInfo = parseSizeName(size.name);
                return {
                    id: size.id,
                    name: size.name,
                    categoryName: size.category.name,
                    productCount: size._count.products,
                    aspectRatio: sizeInfo?.aspectRatio || 1,
                };
            });
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

        // Fetch all products with their images and size info for the selected size
        const products = await prisma.product.findMany({
            where: {
                sizeId: targetSizeId,
            },
            include: {
                images: true,
                size: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        // Calculate aspect ratio from size name
        const sizeInfo = products[0] ? parseSizeName(products[0].size.name) : null;
        const sizeAspectRatio = sizeInfo?.aspectRatio || null; // null means calculate from image

        // Extract only the first image from each product with aspect ratio based on size
        const allImages: ImageWithAspectRatio[] = [];

        for (const product of products) {
            // Only include the first image if the product has images
            if (product.images.length > 0) {
                const firstImage = product.images[0];
                allImages.push({
                    id: firstImage.id,
                    url: firstImage.url,
                    // Use size-based aspect ratio if available, otherwise will be calculated from image
                    aspectRatio: sizeAspectRatio || 1, // 1 is temporary, will be updated on client
                    productId: product.id,
                    productName: product.name,
                    sizeName: product.size.name,
                });
            }
        }

        return allImages;
    } catch (error) {
        console.error('Error fetching home2 products:', error);
        throw new Error('Failed to fetch products for home2');
    }
}
