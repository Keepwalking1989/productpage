'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type ProductWithDetails = Prisma.ProductGetPayload<{
    include: {
        size: {
            include: {
                category: true;
            };
        };
        images: true;
    };
}>;

export type GetProductsParams = {
    search?: string;
    category?: string; // Category Name
    size?: string;     // Size Name
    finish?: string;
    color?: string;
    page?: number;
    limit?: number;
};

export async function getProducts({
    search,
    category,
    size,
    finish,
    color,
    page = 1,
    limit = 12,
}: GetProductsParams = {}) {
    try {
        let where: any = {};

        // Search
        if (search) {
            where.OR = [
                { name: { contains: search } }, // Case-insensitive by default in some DBs, but Prisma handles it well usually. For MySQL, default collation is usually CI.
                { description: { contains: search } },
            ];
        }

        // Filters
        if (category) {
            where.size = {
                category: {
                    name: category,
                },
            };
        }

        if (size) {
            // Preserve existing filters and apply name equals filter
            where.size = {
                ...(where.size ?? {}),
                name: { equals: size },
            };
        }

        if (finish) {
            where.finish = finish;
        }

        if (color) {
            where.color = color;
        }

        // Pagination
        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    size: {
                        include: {
                            category: true,
                        },
                    },
                    images: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.product.count({ where }),
        ]);

        return {
            products,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit,
            },
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
    }
}

export async function getSimilarProducts(productId: string) {
    try {
        const currentProduct = await prisma.product.findUnique({
            where: { id: productId },
            select: { sizeId: true, finish: true, color: true },
        });

        if (!currentProduct) return [];

        // 1. Try strict match: Size + Finish + Color
        let similar = await prisma.product.findMany({
            where: {
                id: { not: productId },
                sizeId: currentProduct.sizeId,
                finish: currentProduct.finish,
                color: currentProduct.color,
            },
            include: {
                size: { include: { category: true } },
                images: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });

        // 2. If not enough, relax Color constraint (Size + Finish)
        if (similar.length < 5) {
            const excludeIds = [productId, ...similar.map((p) => p.id)];
            const moreProducts = await prisma.product.findMany({
                where: {
                    id: { notIn: excludeIds },
                    sizeId: currentProduct.sizeId,
                    finish: currentProduct.finish,
                },
                include: {
                    size: { include: { category: true } },
                    images: true,
                },
                orderBy: { createdAt: 'desc' },
                take: 5 - similar.length,
            });
            similar = [...similar, ...moreProducts];
        }

        // 3. If still not enough, relax Finish constraint (Size only)
        if (similar.length < 5) {
            const excludeIds = [productId, ...similar.map((p) => p.id)];
            const moreProducts = await prisma.product.findMany({
                where: {
                    id: { notIn: excludeIds },
                    sizeId: currentProduct.sizeId,
                },
                include: {
                    size: { include: { category: true } },
                    images: true,
                },
                orderBy: { createdAt: 'desc' },
                take: 5 - similar.length,
            });
            similar = [...similar, ...moreProducts];
        }

        return similar;
    } catch (error) {
        console.error('Error fetching similar products:', error);
        return [];
    }
}
