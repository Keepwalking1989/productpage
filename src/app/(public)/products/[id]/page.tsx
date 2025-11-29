import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getGoogleDriveDirectLink } from "@/lib/google-drive";
import { getSimilarProducts } from "@/app/actions/get-products";
import { ProductCard } from "@/components/product-card";
import { ProductDetailClient } from "@/components/product-detail-client";
import { ArrowLeft } from "lucide-react";

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

    // Prepare all images with direct URLs
    const allImages = product.images.map(img => ({
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

            <ProductDetailClient
                product={product}
                allImages={allImages}
                similarProducts={similarProducts}
            />
        </div>
    );
}
