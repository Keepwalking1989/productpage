'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

/**
 * Calculate aspect ratio category
 */
function categorizeAspectRatio(ratio: number): 'square' | 'rectangleHorizontal' | 'rectangleVertical' {
    if (ratio >= 0.9 && ratio <= 1.1) {
        return 'square';
    } else if (ratio < 0.9) {
        return 'rectangleVertical';
    } else {
        return 'rectangleHorizontal';
    }
}

type ImageData = {
    id: string;
    url: string;
    aspectRatio: number;
    productId: string;
    productName: string;
};

type GroupedImages = {
    square: ImageData[];
    rectangleHorizontal: ImageData[];
    rectangleVertical: ImageData[];
};

interface ImageGridProps {
    images: ImageData[];
}

export function ImageGrid({ images }: ImageGridProps) {
    const router = useRouter();
    const [groupedImages, setGroupedImages] = useState<GroupedImages>({
        square: [],
        rectangleHorizontal: [],
        rectangleVertical: [],
    });
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const imageRefs = useRef<Map<string, HTMLImageElement>>(new Map());

    // Group images by aspect ratio after they load
    useEffect(() => {
        const grouped: GroupedImages = {
            square: [],
            rectangleHorizontal: [],
            rectangleVertical: [],
        };

        images.forEach((img) => {
            if (loadedImages.has(img.id)) {
                const category = categorizeAspectRatio(img.aspectRatio);
                grouped[category].push(img);
            }
        });

        setGroupedImages(grouped);
    }, [images, loadedImages]);

    const handleImageLoad = (imageId: string, event: React.SyntheticEvent<HTMLImageElement>) => {
        const img = event.currentTarget;
        const aspectRatio = img.naturalWidth / img.naturalHeight;

        // Update the image with its actual aspect ratio
        const imageIndex = images.findIndex((i) => i.id === imageId);
        if (imageIndex !== -1) {
            images[imageIndex].aspectRatio = aspectRatio;
        }

        setLoadedImages((prev) => new Set(prev).add(imageId));
    };

    const handleImageClick = (productId: string) => {
        router.push(`/products/${productId}`);
    };

    const renderImageRow = (rowImages: ImageData[], rowType: string) => {
        if (rowImages.length === 0) return null;

        return (
            <div key={rowType} className="flex w-full">
                {rowImages.map((img) => (
                    <div
                        key={img.id}
                        className="relative group cursor-pointer overflow-visible"
                        style={{
                            flex: `${img.aspectRatio} 1 0%`,
                        }}
                        onClick={() => handleImageClick(img.productId)}
                    >
                        <div className="relative w-full h-full transition-all duration-300 group-hover:z-50 group-hover:scale-130">
                            <Image
                                src={img.url}
                                alt={img.productName}
                                fill
                                sizes="(max-width: 768px) 50vw, 33vw"
                                className="object-cover transition-shadow duration-300 group-hover:shadow-2xl"
                                onLoad={(e) => handleImageLoad(img.id, e)}
                                loading="lazy"
                            />
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Create rows by grouping consecutive images of the same type
    const createRows = (): React.ReactNode[] => {
        const rows: React.ReactNode[] = [];
        let currentRow: ImageData[] = [];
        let currentType: string | null = null;

        type ImageWithType = ImageData & { type: string };

        const allSortedImages: ImageWithType[] = [
            ...groupedImages.square.map((img) => ({ ...img, type: 'square' as const })),
            ...groupedImages.rectangleHorizontal.map((img) => ({ ...img, type: 'rectangleHorizontal' as const })),
            ...groupedImages.rectangleVertical.map((img) => ({ ...img, type: 'rectangleVertical' as const })),
        ];

        // Group by type to create rows
        const imagesByType: { [key: string]: ImageData[] } = {};
        allSortedImages.forEach((img) => {
            if (!imagesByType[img.type]) {
                imagesByType[img.type] = [];
            }
            imagesByType[img.type].push(img);
        });

        // Render rows for each type
        Object.entries(imagesByType).forEach(([type, imgs]) => {
            // Split into rows of reasonable size (e.g., 4-6 images per row)
            const imagesPerRow = type === 'square' ? 5 : 4;
            for (let i = 0; i < imgs.length; i += imagesPerRow) {
                const rowImages = imgs.slice(i, i + imagesPerRow);
                rows.push(renderImageRow(rowImages, `${type}-${i}`));
            }
        });

        return rows;
    };

    return (
        <div className="w-full">
            {/* Loading state */}
            {loadedImages.size === 0 && (
                <div className="flex items-center justify-center py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            )}

            {/* Image Grid */}
            <div className="flex flex-col">
                {createRows()}
            </div>
        </div>
    );
}
