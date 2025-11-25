"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: string) {
    // Delete product and its images (cascade will handle images)
    await prisma.product.delete({
        where: { id },
    });

    revalidatePath("/admin/products");
}
