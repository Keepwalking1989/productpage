import { Save } from "lucide-react";
import { updateCategory } from "@/app/actions/update-category";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
    const category = await prisma.category.findUnique({
        where: { id: params.id },
    });

    if (!category) {
        notFound();
    }

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Edit Category</h2>
                <p className="text-muted-foreground">Update category information.</p>
            </div>

            <form action={updateCategory} className="space-y-6 bg-card p-6 rounded-xl border border-border">
                <input type="hidden" name="id" value={category.id} />

                <div className="space-y-2">
                    <label className="text-sm font-medium">Category Name</label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={category.name}
                        placeholder="e.g. Mosaic Tiles"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        defaultValue={category.description || ""}
                        placeholder="Optional description..."
                        className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[100px]"
                    />
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                        Changes will be saved to the database.
                    </p>
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <Save className="w-4 h-4" /> Update Category
                    </button>
                </div>
            </form>
        </div>
    );
}
