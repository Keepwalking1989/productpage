import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ProductCardProps {
    id: string;
    name: string;
    size: string;
    imageUrl: string;
    category: string;
}

export function ProductCard({ id, name, size, imageUrl, category }: ProductCardProps) {
    return (
        <Link href={`/products/${id}`} className="group block space-y-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
                {/* Image Placeholder - In real app use Next.js Image with Google Drive Direct Link */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageUrl || "https://placehold.co/600x800?text=Tile+Design"}
                    alt={name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm">
                        <ArrowUpRight className="w-4 h-4 text-black" />
                    </div>
                </div>

                <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 text-xs font-medium bg-black/60 text-white backdrop-blur-md rounded-md">
                        {size}
                    </span>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                    {name}
                </h3>
                <p className="text-sm text-muted-foreground">{category}</p>
            </div>
        </Link>
    );
}
