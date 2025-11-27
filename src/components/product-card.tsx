import Link from "next/link";
import { ProductWithDetails } from "@/app/actions/get-products";
import { getGoogleDriveDirectLink } from "@/lib/google-drive";

interface ProductCardProps {
    product: ProductWithDetails;
}

export function ProductCard({ product }: ProductCardProps) {
    const mainImage = product.images[0]?.url;
    const imageUrl = mainImage ? (getGoogleDriveDirectLink(mainImage) || mainImage) : null;

    return (
        <Link href={`/products/${product.id}`} className="group block h-full">
            <div className="bg-card border border-border rounded-xl overflow-hidden h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Image */}
                <div className="aspect-square bg-muted relative overflow-hidden">
                    {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                            No Image
                        </div>
                    )}

                    {/* Overlay Badge */}
                    <div className="absolute top-2 right-2">
                        <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            {product.size.category.name}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>

                    <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                            <span>Size:</span>
                            <span className="font-medium text-foreground">{product.size.name}</span>
                        </div>
                        {product.finish && (
                            <div className="flex justify-between">
                                <span>Finish:</span>
                                <span className="font-medium text-foreground">{product.finish}</span>
                            </div>
                        )}
                        {product.color && (
                            <div className="flex justify-between">
                                <span>Color:</span>
                                <span className="font-medium text-foreground">{product.color}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
