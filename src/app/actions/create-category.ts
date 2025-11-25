"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCategory(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name || name.trim() === "") {
        throw new Error("Category name is required");
    }

    await prisma.category.create({
        data: {
            name: name.trim(),
            description: description?.trim() || null,
        },
    });

    revalidatePath("/admin/categories");
    redirect("/admin/categories");
}
