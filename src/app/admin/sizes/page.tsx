import { Plus, Maximize2 } from "lucide-react";
import Link from "next/link";

export default function AdminSizesPage() {
    // Mock Data
    const sizes = [
        { id: "size-1", name: "600x1200 mm", category: "Porcelain Tiles", products: 45 },
        { id: "size-2", name: "600x600 mm", category: "Ceramic Tiles", products: 30 },
        { id: "size-3", name: "800x800 mm", category: "Porcelain Tiles", products: 20 },
        { id: "size-4", name: "1200x2400 mm", category: "Slab Tiles", products: 10 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Sizes</h2>
                    <p className="text-muted-foreground">Manage product sizes per category.</p>
                </div>
                <Link
                    href="/admin/sizes/new"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Size
                </Link>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                        <tr>
                            <th className="px-6 py-4">Size Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Products</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {sizes.map((size) => (
                            <tr key={size.id} className="hover:bg-accent/50 transition-colors">
                                <td className="px-6 py-4 font-medium flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                        <Maximize2 className="w-4 h-4" />
                                    </div>
                                    {size.name}
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">{size.category}</td>
                                <td className="px-6 py-4 text-muted-foreground">{size.products} products</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-primary hover:underline">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
