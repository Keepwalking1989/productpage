"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageModal } from "./image-modal";
import { ProductCard } from "./product-card";
import { Download, Mail, Ruler, Palette, Layers, Info } from "lucide-react";
import { getGoogleDriveDirectLink } from "@/lib/google-drive";
import type { ProductWithDetails } from "@/app/actions/get-products";

interface ProductDetailClientProps {
    product: {
        id: string;
        name: string;
        description: string | null;
        finish: string | null;
        color: string | null;
        size: {
            name: string;
            category: {
                name: string;
            };
            catalogs: {
                id: string;
                title: string;
                pdfUrl: string;
            }[];
        };
    };
    allImages: { url: string; directUrl: string }[];
    similarProducts: ProductWithDetails[];
}

export function ProductDetailClient({
    product,
    allImages,
    similarProducts,
}: ProductDetailClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
    };

    const mainImage = allImages[0];
    const otherImages = allImages.slice(1);

    return (
        <>
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                {/* Left: Image Gallery */}
                <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin">
                    {/* Main Image */}
                    <div
                        className="bg-muted rounded-2xl overflow-hidden border border-border relative cursor-pointer hover:opacity-90 transition-opacity h-[400px] flex items-center justify-center"
                        onClick={() => handleImageClick(0)}
                    >
                        {mainImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={mainImage.directUrl}
                                alt={product.name}
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                No Image Available
                            </div>
                        )}
                    </div>

                    {/* Other Images (if multiple images) */}
                    {otherImages.length > 0 && (
                        <>
                            {otherImages.map((img, idx) => (
                                <div
                                    key={idx}
                                    className="bg-muted rounded-2xl overflow-hidden border border-border cursor-pointer hover:ring-2 ring-primary transition-all h-[250px] flex items-center justify-center"
                                    onClick={() => handleImageClick(idx + 1)}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={img.directUrl}
                                        alt={`${product.name} view ${idx + 2}`}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Right: Product Info */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <span className="bg-secondary px-2 py-1 rounded-md text-secondary-foreground font-medium">
                                {product.size.category.name}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight mb-4">{product.name}</h1>
                        {product.description && (
                            <p className="text-muted-foreground leading-relaxed">
                                {product.description}
                            </p>
                        )}
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-card border border-border rounded-xl space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Ruler className="w-4 h-4" /> Size
                            </div>
                            <p className="font-semibold">{product.size.name}</p>
                        </div>

                        {product.finish && (
                            <div className="p-4 bg-card border border-border rounded-xl space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Layers className="w-4 h-4" /> Finish
                                </div>
                                <p className="font-semibold">{product.finish}</p>
                            </div>
                        )}

                        {product.color && (
                            <div className="p-4 bg-card border border-border rounded-xl space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Palette className="w-4 h-4" /> Color
                                </div>
                                <p className="font-semibold">{product.color}</p>
                            </div>
                        )}

                        <div className="p-4 bg-card border border-border rounded-xl space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Info className="w-4 h-4" /> ID
                            </div>
                            <p className="font-mono text-xs truncate" title={product.id}>{product.id.slice(0, 8)}...</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4 pt-4 border-t border-border">
                        <h3 className="font-semibold">Downloads & Actions</h3>
                        <div className="flex flex-col gap-3">
                            {product.size.catalogs.length > 0 ? (
                                product.size.catalogs.map(catalog => (
                                    <a
                                        key={catalog.id}
                                        href={getGoogleDriveDirectLink(catalog.pdfUrl) || catalog.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors w-full"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download Catalog ({catalog.title})
                                    </a>
                                ))
                            ) : (
                                <button disabled className="flex items-center justify-center gap-2 bg-muted text-muted-foreground px-6 py-3 rounded-lg font-medium cursor-not-allowed w-full">
                                    <Download className="w-4 h-4" />
                                    Catalog Not Available
                                </button>
                            )}

                            <Link
                                href="/contact"
                                className="flex items-center justify-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-6 py-3 rounded-lg font-medium transition-colors w-full"
                            >
                                <Mail className="w-4 h-4" />
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <div className="mt-24 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">Similar Products</h2>
                        <Link href="/" className="text-sm font-medium text-primary hover:underline">
                            View All Products
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {similarProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}

            {/* Image Modal */}
            {allImages.length > 0 && (
                <ImageModal
                    images={allImages}
                    productName={product.name}
                    productSize={product.size.name}
                    productFinish={product.finish || undefined}
                    initialIndex={selectedImageIndex}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
}
