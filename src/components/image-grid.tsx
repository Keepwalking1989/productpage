'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getGoogleDriveDirectLink } from '@/lib/google-drive';
import { categorizeAspectRatio } from '@/lib/size-utils';

type ImageData = {
    id: string;
    url: string;
    aspectRatio: number;
    productId: string;
    productName: string;
    sizeName: string;
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
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Group images by aspect ratio from size (not from actual image dimensions)
    useEffect(() => {
        const grouped: GroupedImages = {
            square: [],
            rectangleHorizontal: [],
            rectangleVertical: [],
        };

        images.forEach((img) => {
            // Use the aspect ratio from the size name, not from the actual image
            const category = categorizeAspectRatio(img.aspectRatio);
            grouped[category].push(img);
        });

        setGroupedImages(grouped);
        setImagesLoaded(true);
    }, [images]);

    const handleImageLoad = (imageId: string, event: React.SyntheticEvent<HTMLImageElement>) => {
        // No need to recalculate aspect ratio - we use size-based ratio
    };

    const handleImageClick = (productId: string) => {
        router.push(`/products/${productId}`);
    };

    const renderImageRow = (rowImages: ImageData[], rowType: string) => {
        if (rowImages.length === 0) return null;

        // Calculate row height based on aspect ratios
        const avgAspectRatio = rowImages.reduce((sum, img) => sum + img.aspectRatio, 0) / rowImages.length;
        const rowHeight = avgAspectRatio > 1 ? '300px' : '400px';

        return (
            <div key={rowType} className="flex w-full" style={{ height: rowHeight }}>
                {rowImages.map((img) => {
                    const imageUrl = getGoogleDriveDirectLink(img.url) || img.url;

                    return (
                        <div
                            key={img.id}
                            className="relative group cursor-pointer"
                            style={{
                                flex: `${img.aspectRatio} 1 0%`,
                            }}
                            onClick={() => handleImageClick(img.productId)}
                        >
                            <div className="absolute inset-0 transition-all duration-300 group-hover:z-50 group-hover:scale-130 overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imageUrl}
                                    alt=""
                                    className="w-full h-full object-cover transition-shadow duration-300 group-hover:shadow-2xl"
                                    onLoad={(e) => handleImageLoad(img.id, e)}
                                    loading="lazy"
                                />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Create rows by grouping consecutive images of the same type
    const createRows = (): React.ReactNode[] => {
        const rows: React.ReactNode[] = [];

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
            {/* Loading state - only show if no images at all */}
            {images.length === 0 && (
                <div className="flex items-center justify-center py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            )}

            {/* Image Grid */}
            {images.length > 0 && (
                <div className="flex flex-col">
                    {createRows()}
                </div>
            )}
        </div>
    );
}

