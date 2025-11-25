import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const product = await prisma.product.findUnique({
            where: { id: params.id },
            include: {
                images: true,
                size: {
                    include: {
                        category: true,
                    },
                },
            },
        });

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await request.json();
        const { name, description, finish, color, size, category, images } = body;

        if (!name || !size || !category) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Find the Category
        const categoryRecord = await prisma.category.findFirst({
            where: { name: category },
        });

        if (!categoryRecord) {
            return NextResponse.json(
                { error: `Category '${category}' not found` },
                { status: 404 }
            );
        }

        // Find the Size within that Category
        const sizeRecord = await prisma.size.findFirst({
            where: {
                name: size,
                categoryId: categoryRecord.id,
            },
        });

        if (!sizeRecord) {
            return NextResponse.json(
                { error: `Size '${size}' not found in category '${category}'` },
                { status: 404 }
            );
        }

        // Update the Product
        // First, delete existing images if we are replacing them (simplest approach for now)
        // Or better, we can update the product details and handle images smartly.
        // For simplicity in this iteration: Delete all images and recreate them.

        await prisma.productImage.deleteMany({
            where: { productId: id },
        });

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                finish,
                color,
                sizeId: sizeRecord.id,
                images: {
                    create: images.filter((url: string) => url.trim()).map((url: string) => ({ url })),
                },
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        );
    }
}
