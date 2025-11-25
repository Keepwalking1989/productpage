"use client";

import { Plus, Maximize2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteSize } from "@/app/actions/delete-size";

type Size = {
    id: string;
    name: string;
    category: { name: string };
    _count: { products: number };
};

export default function AdminSizesPage() {
    const [sizes, setSizes] = useState<Size[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSizes();
    }, []);

    const fetchSizes = async () => {
        const response = await fetch('/api/sizes');
        const data = await response.json();
        setSizes(data);
        setLoading(false);
    };

    const handleDelete = async (id: string, productCount: number) => {
        if (productCount > 0) {
            alert(`Cannot delete this size because it has ${productCount} product(s). Please delete the products first.`);
            return;
        }

        if (!confirm('Are you sure you want to delete this size?')) {
            return;
        }

        try {
            await deleteSize(id);
            await fetchSizes(); // Refresh the list
        } catch (error) {
            alert('Failed to delete size');
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

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
                        {sizes.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                    No sizes found. Add your first size!
                                </td>
                            </tr>
                        ) : (
                            sizes.map((size) => (
                                <tr key={size.id} className="hover:bg-accent/50 transition-colors">
                                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                            <Maximize2 className="w-4 h-4" />
                                        </div>
                                        {size.name}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{size.category.name}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{size._count.products} products</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button className="text-primary hover:underline">Edit</button>
                                        <button
                                            onClick={() => handleDelete(size.id, size._count.products)}
                                            className="text-destructive hover:underline inline-flex items-center gap-1"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            Delete
                                        </button>
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
