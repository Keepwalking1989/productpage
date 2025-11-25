"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: {
    name: string;
    description: string;
    finish: string;
    color: string;
    size: string; // This is the size name, e.g., "600x1200"
    category: string; // This is the category name
    images: string[];
}) {
    const { name, description, finish, color, size, category, images } = formData;

    if (!name || !size || !category) {
        throw new Error("Missing required fields");
    }

    // 1. Find the Category
    const categoryRecord = await prisma.category.findFirst({
        where: { name: category },
    });

    if (!categoryRecord) {
        throw new Error(`Category '${category}' not found`);
    }

    // 2. Find the Size within that Category
    const sizeRecord = await prisma.size.findFirst({
        where: {
            name: size,
            categoryId: categoryRecord.id,
        },
    });

    if (!sizeRecord) {
        throw new Error(`Size '${size}' not found in category '${category}'`);
    }

    // 3. Create the Product
    await prisma.product.create({
        data: {
            name,
            description,
            finish,
            color, // Note: Schema might not have color yet, checking schema next
            images,
            sizeId: sizeRecord.id,
        },
    });

    revalidatePath("/admin/products");
    redirect("/admin/products");
}
