"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateSize(formData: FormData) {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;

    if (!id || !name || name.trim() === "" || !categoryId) {
        throw new Error("Size ID, name, and category are required");
    }

    await prisma.size.update({
        where: { id },
        data: {
            name: name.trim(),
            description: description?.trim() || null,
            categoryId,
        },
    });

    revalidatePath("/admin/sizes");
    redirect("/admin/sizes");
}
