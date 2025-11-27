import { ProductCard } from "@/components/product-card";
import { SlidersHorizontal } from "lucide-react";

export default function ProductsPage() {
    // Mock Data
    const products = Array.from({ length: 12 }).map((_, i) => ({
        id: `prod-${i}`,
        name: `Statuario Premium ${i + 1}`,
        size: {
            name: i % 2 === 0 ? "600x1200" : "800x800",
            category: { name: "Porcelain Tiles" },
        },
        images: [{ url: "" }], // Placeholder image URL
    }));

    return (
        <div className="min-h-screen bg-background pt-20 pb-12">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full md:w-64 space-y-8 shrink-0">
                        <div className="flex items-center gap-2 pb-4 border-b border-border">
                            <SlidersHorizontal className="w-5 h-5" />
                            <h2 className="font-semibold">Filters</h2>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-medium text-sm">Categories</h3>
                            <div className="space-y-2">
                                {["Porcelain", "Ceramic", "Slab", "Sanitary Ware"].map((cat) => (
                                    <label key={cat} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                                        <input type="checkbox" className="rounded border-gray-300" />
                                        {cat}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-medium text-sm">Size</h3>
                            <div className="space-y-2">
                                {["600x600", "600x1200", "800x800", "1200x1200"].map((size) => (
                                    <label key={size} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                                        <input type="checkbox" className="rounded border-gray-300" />
                                        {size} mm
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="mb-6 flex items-center justify-between">
                            <h1 className="text-2xl font-bold">All Products</h1>
                            <span className="text-sm text-muted-foreground">Showing {products.length} results</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product as any} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
