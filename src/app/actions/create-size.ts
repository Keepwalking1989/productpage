"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSize(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;

    if (!name || name.trim() === "") {
        throw new Error("Size name is required");
    }

    if (!categoryId) {
        throw new Error("Category is required");
    }

    await prisma.size.create({
        data: {
            name: name.trim(),
            description: description?.trim() || null,
            categoryId,
        },
    });

    revalidatePath("/admin/sizes");
    redirect("/admin/sizes");
}
