import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface ImportProduct {
    rowNumber: number;
    designName: string;
    size: string;
    collection: string;
    image1: string;
    image2?: string;
    image3?: string;
    image4?: string;
    image5?: string;
    description?: string;
    category?: string;
    color?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { products, defaultCategory, defaultSize } = body as {
            products: ImportProduct[];
            defaultCategory?: string;
            defaultSize?: string;
        };

        if (!products || products.length === 0) {
            return NextResponse.json(
                { error: "No products to import" },
                { status: 400 }
            );
        }

        // Fetch all categories and sizes for mapping
        const [categories, sizes] = await Promise.all([
            prisma.category.findMany({ select: { id: true, name: true } }),
            prisma.size.findMany({ select: { id: true, name: true } }),
        ]);

        let imported = 0;
        const errors: string[] = [];

        // Import products one by one
        for (const product of products) {
            try {
                // Determine category ID
                let categoryId: string | undefined;
                const categoryName = defaultCategory || product.category;

                if (categoryName) {
                    const category = categories.find(c =>
                        c.name.toLowerCase() === categoryName.toLowerCase()
                    );
                    if (category) {
                        categoryId = category.id;
                    }
                }

                // Determine size ID
                let sizeId: string | undefined;
                const sizeName = defaultSize || product.size;

                if (sizeName) {
                    const size = sizes.find(s =>
                        s.name.toLowerCase() === sizeName.toLowerCase()
                    );
                    if (size) {
                        sizeId = size.id;
                    }
                }

                if (!sizeId) {
                    errors.push(`Row ${product.rowNumber}: Size not found`);
                    continue;
                }

                // Collect valid image URLs
                const imageUrls = [
                    product.image1,
                    product.image2,
                    product.image3,
                    product.image4,
                    product.image5,
                ].filter((url): url is string => !!url && isValidUrl(url));

                if (imageUrls.length === 0) {
                    errors.push(`Row ${product.rowNumber}: No valid images`);
                    continue;
                }

                // Create product
                await prisma.product.create({
                    data: {
                        name: product.designName,
                        sizeId: sizeId,
                        finish: product.collection || null,
                        color: product.color || null,
                        description: product.description || null,
                        images: {
                            create: imageUrls.map(url => ({ url })),
                        },
                    },
                });

                imported++;
            } catch (error) {
                console.error(`Error importing product at row ${product.rowNumber}:`, error);
                errors.push(`Row ${product.rowNumber}: Import failed`);
            }
        }

        return NextResponse.json({
            imported,
            total: products.length,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error("Import error:", error);
        return NextResponse.json(
            { error: "Failed to import products" },
            { status: 500 }
        );
    }
}

function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}
