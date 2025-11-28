"use client";

import { useState, useMemo, useEffect } from "react";
import { FilePlus, Save, Sparkles, Plus, X } from "lucide-react";
import { generateProductInfo } from "@/app/actions/generate-product-info";
import { getGoogleDriveDirectLink } from "@/lib/google-drive";

type Category = {
    id: string;
    name: string;
};

type Size = {
    id: string;
    name: string;
    categoryId: string;
};

export default function NewProductPage() {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [allSizes, setAllSizes] = useState<Size[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        finish: "",
        color: "",
        size: "",
        category: "",
        images: [""] as string[],
    });

    useEffect(() => {
        fetchCategories();
        fetchSizes();
    }, []);

    const fetchCategories = async () => {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data.map((cat: any) => ({ id: cat.id, name: cat.name })));
    };

    const fetchSizes = async () => {
        const response = await fetch('/api/sizes');
        const data = await response.json();
        setAllSizes(data.map((size: any) => ({
            id: size.id,
            name: size.name,
            categoryId: size.category.id
        })));
    };

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

        setLoading(true);
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to create product');
            }

            // Redirect to products list
            window.location.href = '/admin/products';
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Failed to create product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddImage = () => {
        setFormData({ ...formData, images: [...formData.images, ""] });
    };

    const handleRemoveImage = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const handleGenerateInfo = async () => {
        const mainImage = formData.images[0];
        if (!mainImage) {
            alert("Please enter at least one image URL to generate info.");
            return;
        }

        setLoading(true);
        try {
            const data = await generateProductInfo({
                imageUrl: mainImage,
                category: formData.category || undefined,
                size: formData.size || undefined,
                name: formData.name || undefined,
                finish: formData.finish || undefined,
            });
            setFormData(prev => ({
                ...prev,
                name: data.name || prev.name,
                description: data.description || prev.description,
                finish: data.finish || prev.finish,
                color: data.color || prev.color,
                // Keep existing category/size selections
            }));
        } catch (error) {
            console.error(error);
            alert("Failed to generate product info. Please check the API key and try again.");
        } finally {
            setLoading(false);
        }
    };

    // Memoize the preview URL to prevent infinite re-renders
    const previewImageUrl = useMemo(() => {
        const firstImage = formData.images[0];
        if (!firstImage) return null;
        return getGoogleDriveDirectLink(firstImage) || firstImage;
    }, [formData.images]);

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
                <p className="text-muted-foreground">Create a new product page with AI-powered content.</p>
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
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Statuario Premium"
                        />
                    </div>

                    {/* Image URLs (Google Drive) */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium">Image URLs (Google Drive)</label>
                        {formData.images.map((url, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                    value={url}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                    placeholder="Paste Google Drive Link..."
                                />
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="p-2 text-destructive hover:bg-destructive/10 rounded-md"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddImage}
                            className="text-sm text-primary flex items-center gap-1 hover:underline"
                        >
                            <Plus className="w-4 h-4" /> Add Another Image
                        </button>
                    </div>

                    {/* AI Generation Button */}
                    <div className="p-4 bg-accent/50 rounded-lg border border-accent flex items-center justify-between">
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
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Saving...' : 'Save Product Page'}
                        </button>
                    </div>
                </div>

                {/* Preview Sidebar */}
                <div className="space-y-6">
                    <div className="bg-card p-4 rounded-xl border border-border sticky top-6">
                        <h3 className="font-semibold mb-4">Image Previews</h3>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {formData.images.map((imageUrl, index) => {
                                const directUrl = imageUrl ? (getGoogleDriveDirectLink(imageUrl) || imageUrl) : null;
                                return (
                                    <div key={index} className="space-y-2">
                                        <p className="text-xs text-muted-foreground font-medium">
                                            Image {index + 1}
                                        </p>
                                        <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                                            {directUrl ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={directUrl}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">{formData.name || "Product Name"}</p>
                            <p className="text-sm text-muted-foreground">{formData.size} • {formData.category}</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
