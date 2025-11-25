"use client";

import { useState, useMemo, useEffect } from "react";
import { Save, Sparkles, Plus, X } from "lucide-react";
import { generateProductInfo } from "@/app/actions/generate-product-info";
import { getGoogleDriveDirectLink } from "@/lib/google-drive";
import { useRouter } from "next/navigation";

type Category = {
    id: string;
    name: string;
};

type Size = {
    id: string;
    name: string;
    categoryId: string;
};

type ProductData = {
    id: string;
    name: string;
    description: string;
    finish: string;
    color: string;
    size: string;
    category: string;
    images: string[];
};

export default function EditProductForm({ productId }: { productId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [allSizes, setAllSizes] = useState<Size[]>([]);
    const [formData, setFormData] = useState<ProductData>({
        id: "",
        name: "",
        description: "",
        finish: "",
        color: "",
        size: "",
        category: "",
        images: [""],
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Fetch Categories and Sizes
                const [catsRes, sizesRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/sizes')
                ]);

                const catsData = await catsRes.json();
                const sizesData = await sizesRes.json();

                setCategories(catsData.map((cat: any) => ({ id: cat.id, name: cat.name })));
                setAllSizes(sizesData.map((size: any) => ({
                    id: size.id,
                    name: size.name,
                    categoryId: size.category.id
                })));

                // 2. Fetch Product Data (we need a way to fetch a single product via API or pass it from server component)
                // Since this is a client component, we can't use prisma directly.
                // Let's create a GET endpoint for a single product or pass data via props if we convert to server component wrapper.
                // For now, let's fetch via a new GET endpoint in the same route file we just created.
                const productRes = await fetch(`/api/products/${productId}`);
                if (!productRes.ok) throw new Error("Product not found");

                const product = await productRes.json();

                setFormData({
                    id: product.id,
                    name: product.name,
                    description: product.description || "",
                    finish: product.finish || "",
                    color: product.color || "",
                    size: product.size.name,
                    category: product.size.category.name,
                    images: product.images.length > 0 ? product.images.map((img: any) => img.url) : [""],
                });

            } catch (error) {
                console.error("Error loading data:", error);
                alert("Failed to load product data");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [productId]);

    // Filter sizes based on selected category
    const availableSizes = useMemo(() => {
        if (!formData.category) return [];
        const selectedCategory = categories.find(c => c.name === formData.category);
        if (!selectedCategory) return [];
        return allSizes.filter(size => size.categoryId === selectedCategory.id);
    }, [formData.category, categories, allSizes]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.category || !formData.size) {
            alert('Please fill in all required fields: Name, Category, and Size');
            return;
        }

        setSaving(true);
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            router.push('/admin/products');
            router.refresh();
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleAddImage = () => {
        setFormData({ ...formData, images: [...formData.images, ""] });
    };

    const handleRemoveImage = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages.length ? newImages : [""] });
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const handleGenerateInfo = async () => {
        const mainImage = formData.images[0];
        if (!mainImage) {
            alert("Please add at least one image URL first");
            return;
        }

        setLoading(true);
        try {
            const data = await generateProductInfo(mainImage);
            setFormData(prev => ({
                ...prev,
                name: data.name || prev.name,
                description: data.description || prev.description,
                finish: data.finish || prev.finish,
                color: data.color || prev.color,
            }));
        } catch (error) {
            console.error("Error generating info:", error);
            alert("Failed to generate info. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading product data...</div>;
    }

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
                <p className="text-muted-foreground">Update product information.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-[1fr_300px]">
                <div className="space-y-6 bg-card p-6 rounded-xl border border-border">

                    {/* Category & Size Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <select
                                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value, size: "" })}
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Size</label>
                            <select
                                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                value={formData.size}
                                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                disabled={!formData.category}
                            >
                                <option value="">Select Size</option>
                                {availableSizes.map((size) => (
                                    <option key={size.id} value={size.name}>
                                        {size.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Product Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Product Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                            placeholder="e.g. Statuario Marble"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* Images */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Product Images</label>
                            <button
                                type="button"
                                onClick={handleAddImage}
                                className="text-sm text-primary flex items-center gap-1 hover:underline"
                            >
                                <Plus className="w-4 h-4" /> Add Image
                            </button>
                        </div>
                        {formData.images.map((url, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
                                    placeholder="Image URL (Google Drive or Direct Link)"
                                    value={url}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                />
                                {formData.images.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <p className="text-xs text-muted-foreground">
                            Paste Google Drive links directly. They will be automatically converted.
                        </p>
                    </div>

                    {/* AI Generator */}
                    <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg border border-purple-100 dark:border-purple-900/20 flex items-center justify-between">
                        <div>
                            <h4 className="font-medium flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-500" />
                                AI Content Generator
                            </h4>
                            <p className="text-sm text-muted-foreground">Generate description, finish, and color from image.</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleGenerateInfo}
                            disabled={loading}
                            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Generating..." : "Generate Info"}
                        </button>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Product Description</label>
                        <textarea
                            className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[150px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Finish & Color */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Finish</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                value={formData.finish}
                                onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Color</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Saving...' : 'Update Product'}
                        </button>
                    </div>
                </div>

                {/* Preview Sidebar */}
                <div className="space-y-6">
                    <div className="bg-card p-6 rounded-xl border border-border sticky top-6">
                        <h3 className="font-medium mb-4">Preview</h3>
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden relative group">
                            {formData.images[0] ? (
                                <img
                                    src={getGoogleDriveDirectLink(formData.images[0]) || ""}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                                    No Image
                                </div>
                            )}
                        </div>
                        <div className="space-y-2 mt-4">
                            <p className="font-medium">{formData.name || "Product Name"}</p>
                            <p className="text-sm text-muted-foreground">{formData.size} • {formData.category}</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
