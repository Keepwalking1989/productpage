import { Save } from "lucide-react";
import { createSize } from "@/app/actions/create-size";
import { prisma } from "@/lib/prisma";

export default async function NewSizePage() {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
    });

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Add New Size</h2>
                <p className="text-muted-foreground">Define a new size for a category.</p>
            </div>

            <form action={createSize} className="space-y-6 bg-card p-6 rounded-xl border border-border">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                        name="categoryId"
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
                        placeholder="e.g. 600x1200 mm"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        placeholder="Optional description..."
                        className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[100px]"
                    />
                </div>

                <div className="pt-4 border-t border-border">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <Save className="w-4 h-4" /> Save Size
                    </button>
                </div>
            </form>
        </div>
    );
}
