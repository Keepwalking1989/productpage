"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateCategory(formData: FormData) {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!id || !name || name.trim() === "") {
        throw new Error("Category ID and name are required");
    }

    await prisma.category.update({
        where: { id },
        data: {
            name: name.trim(),
            description: description?.trim() || null,
        },
    });

    revalidatePath("/admin/categories");
    redirect("/admin/categories");
}
