import { Save } from "lucide-react";
import { updateSize } from "@/app/actions/update-size";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function EditSizePage({ params }: { params: { id: string } }) {
    const size = await prisma.size.findUnique({
        where: { id: params.id },
        include: { category: true },
    });

    if (!size) {
        notFound();
    }

    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
    });

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Edit Size</h2>
                <p className="text-muted-foreground">Update size information.</p>
            </div>

            <form action={updateSize} className="space-y-6 bg-card p-6 rounded-xl border border-border">
                <input type="hidden" name="id" value={size.id} />

                <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                        name="categoryId"
                        defaultValue={size.categoryId}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Size Name</label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={size.name}
                        placeholder="e.g. 600x1200 mm"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        defaultValue={size.description || ""}
                        placeholder="Optional description..."
                        className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[100px]"
                    />
                </div>

                <div className="pt-4 border-t border-border">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <Save className="w-4 h-4" /> Update Size
                    </button>
                </div>
            </form>
        </div>
    );
}
