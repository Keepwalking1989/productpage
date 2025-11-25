import { Plus, Layers } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
    const categories = await prisma.category.findMany({
        include: {
            sizes: {
                include: {
                    _count: {
                        select: { products: true },
                    },
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    // Calculate total products for each category
    const categoriesWithCounts = categories.map(category => ({
        ...category,
        productCount: category.sizes.reduce((sum, size) => sum + size._count.products, 0),
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                    <p className="text-muted-foreground">Manage product categories.</p>
                </div>
                <Link
                    href="/admin/categories/new"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Category
                </Link>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Products</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {categoriesWithCounts.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                                    No categories found. Add your first category!
                                </td>
                            </tr>
                        ) : (
                            categoriesWithCounts.map((cat) => (
                                <tr key={cat.id} className="hover:bg-accent/50 transition-colors">
                                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                            <Layers className="w-4 h-4" />
                                        </div>
                                        {cat.name}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{cat.productCount} products</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-primary hover:underline">Edit</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
