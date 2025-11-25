import { Save } from "lucide-react";

export default function NewSizePage() {
    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Add New Size</h2>
                <p className="text-muted-foreground">Define a new size for a category.</p>
            </div>

            <div className="space-y-6 bg-card p-6 rounded-xl border border-border">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                        <option value="">Select Category</option>
                        <option value="Porcelain Tiles">Porcelain Tiles</option>
                        <option value="Ceramic Tiles">Ceramic Tiles</option>
                        <option value="Slab Tiles">Slab Tiles</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Size Name</label>
                    <input
                        type="text"
                        placeholder="e.g. 600x1200 mm"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        placeholder="Optional description..."
                        className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[100px]"
                    />
                </div>

                <div className="pt-4 border-t border-border">
                    <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                        <Save className="w-4 h-4" /> Save Size
                    </button>
                </div>
            </div>
        </div>
    );
}
