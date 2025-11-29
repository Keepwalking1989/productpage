import { Plus, Package, Search, Upload } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getGoogleDriveDirectLink } from "@/lib/google-drive";
import { ProductActions } from "./product-actions";

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: {
            images: true,
            size: {
                include: {
                    category: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                    <p className="text-muted-foreground">Manage your product inventory.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/products/bulk-upload"
                        className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors border border-border"
                    >
                        <Upload className="w-4 h-4" /> Bulk Upload
                    </Link>
                    <Link
                        href="/admin/products/new"
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Product
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-9 pr-4 py-2 border border-input rounded-md bg-background"
                    />
                </div>
                <select className="px-3 py-2 border border-input rounded-md bg-background min-w-[150px]">
                    <option value="">All Categories</option>
                    <option value="Porcelain Tiles">Porcelain Tiles</option>
                    <option value="Ceramic Tiles">Ceramic Tiles</option>
                </select>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Size</th>
                            <th className="px-6 py-4">Finish</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                    No products found. Add your first product!
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => {
                                const imageUrl = product.images[0]?.url
                                    ? (getGoogleDriveDirectLink(product.images[0].url) || product.images[0].url)
                                    : null;

                                return (
                                    <tr key={product.id} className="hover:bg-accent/50 transition-colors">
                                        <td className="px-6 py-4 font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-muted overflow-hidden flex-shrink-0 border border-border">
                                                    {imageUrl ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={imageUrl}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                            referrerPolicy="no-referrer"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                            <Package className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                </div>
                                                <span>{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {product.size.category.name}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {product.size.name}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {product.finish || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <ProductActions product={product} />
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
