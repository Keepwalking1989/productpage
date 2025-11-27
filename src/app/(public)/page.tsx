import { Suspense } from "react";
import { FilterSidebar } from "@/components/filter-sidebar";
import { ProductGrid } from "@/components/product-grid";
import { getFilters } from "@/app/actions/get-filters";
import { Loader2 } from "lucide-react";

export default async function HomePage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // Await searchParams before using properties
    const resolvedSearchParams = await searchParams;

    // Convert searchParams to GetProductsParams
    const params = {
        search: typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined,
        category: typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined,
        size: typeof resolvedSearchParams.size === 'string' ? resolvedSearchParams.size : undefined,
        finish: typeof resolvedSearchParams.finish === 'string' ? resolvedSearchParams.finish : undefined,
        color: typeof resolvedSearchParams.color === 'string' ? resolvedSearchParams.color : undefined,
    };

    const filters = await getFilters();

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero / Title Section */}
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Our Collection</h1>
                <p className="text-muted-foreground">
                    Explore our premium range of porcelain tiles designed for modern spaces.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="sticky top-24">
                        <FilterSidebar filters={filters} />
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <Suspense
                        key={JSON.stringify(params)}
                        fallback={
                            <div className="flex items-center justify-center py-24">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        }
                    >
                        <ProductGrid searchParams={params} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
