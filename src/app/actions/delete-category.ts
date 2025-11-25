"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteCategory(id: string) {
    // Check if category has sizes
    const category = await prisma.category.findUnique({
        where: { id },
        include: {
            _count: {
                select: { sizes: true },
            },
        },
    });

    if (!category) {
        throw new Error("Category not found");
    }

    if (category._count.sizes > 0) {
        throw new Error(`Cannot delete category with ${category._count.sizes} sizes`);
    }

    await prisma.category.delete({
        where: { id },
    });

    revalidatePath("/admin/categories");
}
