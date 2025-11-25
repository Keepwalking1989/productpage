"use client";

import { useState, useMemo } from "react";
import { FilePlus, Save, Sparkles, Plus, X } from "lucide-react";
import { generateProductInfo } from "@/app/actions/generate-product-info";
import { getGoogleDriveDirectLink } from "@/lib/google-drive";

export default function NewProductPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        finish: "",
        color: "",
        size: "",
        category: "",
        images: [""] as string[],
    });

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
            const data = await generateProductInfo(mainImage);
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

            <div className="grid gap-8 md:grid-cols-[1fr_300px]">
                <div className="space-y-6 bg-card p-6 rounded-xl border border-border">

                    {/* Category & Size Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <select
                                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                <option value="Porcelain Tiles">Porcelain Tiles</option>
                                <option value="Ceramic Tiles">Ceramic Tiles</option>
                                <option value="Slab Tiles">Slab Tiles</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Size</label>
                            <select
                                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                value={formData.size}
                                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                            >
                                <option value="">Select Size</option>
                                <option value="600x1200">600x1200 mm</option>
                                <option value="600x600">600x600 mm</option>
                                <option value="800x800">800x800 mm</option>
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
                                        onClick={() => handleRemoveImage(index)}
                                        className="p-2 text-destructive hover:bg-destructive/10 rounded-md"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
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
                        <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 transition-colors">
                            <Save className="w-5 h-5" />
                            Save Product Page
                        </button>
                    </div>
                </div>

                {/* Preview Sidebar */}
                <div className="space-y-6">
                    <div className="bg-card p-4 rounded-xl border border-border sticky top-6">
                        <h3 className="font-semibold mb-4">Preview</h3>
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden relative mb-4">
                            {previewImageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={previewImageUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    No Image
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">{formData.name || "Product Name"}</p>
                            <p className="text-sm text-muted-foreground">{formData.size} • {formData.category}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
