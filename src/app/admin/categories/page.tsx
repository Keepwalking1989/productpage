"use client";

import { Plus, Layers, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteCategory } from "@/app/actions/delete-category";

type Category = {
    id: string;
    name: string;
    sizes: { _count: { products: number } }[];
};

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
        setLoading(false);
    };

    const handleDelete = async (id: string, sizeCount: number) => {
        if (sizeCount > 0) {
            alert(`Cannot delete this category because it has ${sizeCount} size(s). Please delete the sizes first.`);
            return;
        }

        if (!confirm('Are you sure you want to delete this category?')) {
            return;
        }

        try {
            await deleteCategory(id);
            await fetchCategories(); // Refresh the list
        } catch (error) {
            alert('Failed to delete category');
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

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
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                                    No categories found. Add your first category!
                                </td>
                            </tr>
                        ) : (
                            categories.map((cat) => {
                                const productCount = cat.sizes.reduce((sum, size) => sum + size._count.products, 0);
                                const sizeCount = cat.sizes.length;

                                return (
                                    <tr key={cat.id} className="hover:bg-accent/50 transition-colors">
                                        <td className="px-6 py-4 font-medium flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                                <Layers className="w-4 h-4" />
                                            </div>
                                            {cat.name}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{productCount} products</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button className="text-primary hover:underline">Edit</button>
                                            <button
                                                onClick={() => handleDelete(cat.id, sizeCount)}
                                                className="text-destructive hover:underline inline-flex items-center gap-1"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
