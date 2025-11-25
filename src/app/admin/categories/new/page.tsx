import { Save } from "lucide-react";
import { createCategory } from "@/app/actions/create-category";

export default function NewCategoryPage() {
    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Add New Category</h2>
                <p className="text-muted-foreground">Create a new product category.</p>
            </div>

            <form action={createCategory} className="space-y-6 bg-card p-6 rounded-xl border border-border">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Category Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="e.g. Mosaic Tiles"
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

                <div className="pt-4 border-t border-border flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                        After saving, you can add products to this category.
                    </p>
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <Save className="w-4 h-4" /> Save Category
                    </button>
                </div>
            </form>
        </div>
    );
}
