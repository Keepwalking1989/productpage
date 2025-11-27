import { getCategories } from "@/app/actions/get-catalog-data";
import { CatalogBrowser } from "@/components/catalog-browser";

export const metadata = {
    title: "Catalogs | Porcelain Tiles AI",
    description: "Browse and download our premium tile catalogs.",
};

export default async function CatalogsPage() {
    const categories = await getCategories();

    return (
        <div className="container mx-auto px-4 py-12 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Product Catalogs</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Explore our comprehensive collection of catalogs. Select a category and size to find the perfect design inspiration for your project.
                </p>
            </div>

            <CatalogBrowser initialCategories={categories} />
        </div>
    );
}
