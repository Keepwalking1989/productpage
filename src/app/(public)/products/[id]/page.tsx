import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getGoogleDriveDirectLink } from "@/lib/google-drive";
import { getSimilarProducts } from "@/app/actions/get-products";
import { ProductCard } from "@/components/product-card";
import { ArrowLeft, Download, Mail, Ruler, Palette, Layers, Info } from "lucide-react";

export default async function ProductDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const resolvedParams = await params;
    const product = await prisma.product.findUnique({
        where: { id: resolvedParams.id },
        include: {
            size: {
                include: {
                    category: true,
                    catalogs: true, // Fetch related catalogs
                },
            },
            images: true,
        },
    });

    if (!product) {
        notFound();
    }

    const similarProducts = await getSimilarProducts(product.id);

    const mainImage = product.images[0]?.url;
    const imageUrl = mainImage ? (getGoogleDriveDirectLink(mainImage) || mainImage) : null;

    // Get other images for gallery (if any)
    const otherImages = product.images.slice(1).map(img => ({
        ...img,
        directUrl: getGoogleDriveDirectLink(img.url) || img.url
    }));

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb / Back */}
            <div className="mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Collection
                </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                {/* Left: Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square bg-muted rounded-2xl overflow-hidden border border-border relative">
                        {imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                No Image Available
                            </div>
                        )}
                    </div>

                    {/* Thumbnails (if multiple images) */}
                    {otherImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-4">
                            {otherImages.map((img, idx) => (
                                <div key={idx} className="aspect-square bg-muted rounded-lg overflow-hidden border border-border cursor-pointer hover:ring-2 ring-primary transition-all">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={img.directUrl}
                                        alt={`${product.name} view ${idx + 2}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
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
        </div>
    );
}
