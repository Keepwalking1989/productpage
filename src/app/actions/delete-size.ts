"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteSize(id: string) {
    // Check if size has products
    const size = await prisma.size.findUnique({
        where: { id },
        include: {
            _count: {
                select: { products: true },
            },
        },
    });

    if (!size) {
        throw new Error("Size not found");
    }

    if (size._count.products > 0) {
        throw new Error(`Cannot delete size with ${size._count.products} products`);
    }

    await prisma.size.delete({
        where: { id },
    });

    revalidatePath("/admin/sizes");
}
