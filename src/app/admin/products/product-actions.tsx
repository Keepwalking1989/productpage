"use client";

import { Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { deleteProduct } from "@/app/actions/delete-product";
import { useState } from "react";

type Product = {
    id: string;
    name: string;
    images: { url: string }[];
    size: {
        name: string;
        category: { name: string };
    };
    finish: string | null;
};

export function ProductActions({ product }: { product: Product }) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
            return;
        }

        setDeleting(true);
        try {
            await deleteProduct(product.id);
            window.location.reload(); // Refresh the page
        } catch (error) {
            alert('Failed to delete product');
            setDeleting(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Link
                href={`/admin/products/${product.id}/edit`}
                className="text-primary hover:underline inline-flex items-center gap-1"
            >
                <Edit className="w-3 h-3" />
                Edit
            </Link>
            <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-destructive hover:underline inline-flex items-center gap-1 disabled:opacity-50"
            >
                <Trash2 className="w-3 h-3" />
                {deleting ? "Deleting..." : "Delete"}
            </button>
        </div>
    );
}
