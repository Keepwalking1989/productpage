import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
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

        // Create the Product with nested ProductImage records
        const product = await prisma.product.create({
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

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        );
    }
}
