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
 * Fetch all products with images and group them by aspect ratio
 * This is optimized for the Home 2 image grid layout
 */
export async function getHome2Products() {
    try {
        // Fetch all products with their images
        const products = await prisma.product.findMany({
            include: {
                images: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        // Extract all images with their aspect ratios
        const allImages: ImageWithAspectRatio[] = [];

        for (const product of products) {
            for (const image of product.images) {
                // For now, we'll calculate aspect ratio on the client side
                // or use a default. In production, you might want to store
                // width/height in the database
                allImages.push({
                    id: image.id,
                    url: image.url,
                    aspectRatio: 1, // Will be calculated on client
                    productId: product.id,
                    productName: product.name,
                });
            }
        }

        // Group images by aspect ratio
        // This will be done on the client side after images load
        // to get accurate dimensions
        return allImages;
    } catch (error) {
        console.error('Error fetching home2 products:', error);
        throw new Error('Failed to fetch products for home2');
    }
}
