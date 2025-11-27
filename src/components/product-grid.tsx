import { getProducts, GetProductsParams } from "@/app/actions/get-products";
import { ProductCard } from "./product-card";
import { PackageX } from "lucide-react";

export async function ProductGrid({ searchParams }: { searchParams: GetProductsParams }) {
    const { products } = await getProducts(searchParams);

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <PackageX className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground max-w-sm">
                    Try adjusting your filters or search terms to find what you're looking for.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
