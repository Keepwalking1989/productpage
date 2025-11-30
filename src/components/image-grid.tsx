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
    const [imageAspectRatios, setImageAspectRatios] = useState<Map<string, number>>(new Map());
    const [needsImageCalculation, setNeedsImageCalculation] = useState(false);

    // Check if we need to calculate aspect ratios from images
    // (when size name doesn't have numbers, aspectRatio will be 1 as default)
    useEffect(() => {
        // If all images have the same aspectRatio of 1, it might be a fallback
        // We'll need to calculate from actual images
        const allSameDefault = images.length > 0 && images.every(img => img.aspectRatio === 1);
        setNeedsImageCalculation(allSameDefault);
    }, [images]);

    // Group images by aspect ratio from size (or from actual image if needed)
    useEffect(() => {
        const grouped: GroupedImages = {
            square: [],
            rectangleHorizontal: [],
            rectangleVertical: [],
        };

        images.forEach((img) => {
            // Use calculated aspect ratio if available, otherwise use size-based
            const aspectRatio = imageAspectRatios.get(img.id) || img.aspectRatio;
            const category = categorizeAspectRatio(aspectRatio);
            grouped[category].push({ ...img, aspectRatio });
        });

        setGroupedImages(grouped);
        setImagesLoaded(true);
    }, [images, imageAspectRatios]);

    const handleImageLoad = (imageId: string, event: React.SyntheticEvent<HTMLImageElement>) => {
        // Only calculate aspect ratio from image if size name didn't have numbers
        if (needsImageCalculation) {
            const img = event.currentTarget;
            const aspectRatio = img.naturalWidth / img.naturalHeight;

            setImageAspectRatios((prev) => {
                const newMap = new Map(prev);
                newMap.set(imageId, aspectRatio);
                return newMap;
            });
        }
    };

    const handleImageClick = (productId: string) => {
        router.push(`/products/${productId}`);
    };

    const renderImageRow = (rowImages: ImageData[], rowType: string) => {
        if (rowImages.length === 0) return null;

        // Calculate row height based on aspect ratios
        // For vertical images (aspect < 1), we need TALLER rows
        // For horizontal images (aspect > 1), we need SHORTER rows
        const avgAspectRatio = rowImages.reduce((sum, img) => sum + img.aspectRatio, 0) / rowImages.length;

        let rowHeight: string;
        if (avgAspectRatio < 0.7) {
            // Very vertical (like 600x1200 = 0.5)
            rowHeight = '600px';
        } else if (avgAspectRatio < 1) {
            // Somewhat vertical
            rowHeight = '450px';
        } else if (avgAspectRatio > 1.5) {
            // Very horizontal
            rowHeight = '250px';
        } else {
            // Square or slightly rectangular
            rowHeight = '350px';
        }

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

