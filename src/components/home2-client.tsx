'use client';

import { useState, useEffect } from 'react';
import { ImageGrid } from '@/components/image-grid';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Loader2 } from 'lucide-react';

type SizeOption = {
    id: string;
    name: string;
    categoryName: string;
    productCount: number;
};

type ImageData = {
    id: string;
    url: string;
    aspectRatio: number;
    productId: string;
    productName: string;
};

interface Home2ClientProps {
    initialSizes: SizeOption[];
    initialImages: ImageData[];
    initialSizeId: string;
}

export function Home2Client({ initialSizes, initialImages, initialSizeId }: Home2ClientProps) {
    const [selectedSizeId, setSelectedSizeId] = useState(initialSizeId);
    const [images, setImages] = useState(initialImages);
    const [isLoading, setIsLoading] = useState(false);

    const handleSizeChange = async (sizeId: string) => {
        if (sizeId === selectedSizeId) return;

        setIsLoading(true);
        setSelectedSizeId(sizeId);

        try {
            // Fetch images for the new size
            const response = await fetch(`/api/home2/images?sizeId=${sizeId}`);
            const data = await response.json();
            setImages(data);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen">
            {/* Collapsible Sidebar with Size Filter */}
            <CollapsibleSidebar
                sizes={initialSizes}
                selectedSizeId={selectedSizeId}
                onSizeChange={handleSizeChange}
            />

            {/* Main Content Area */}
            <div className="ml-12 transition-all duration-300">
                {isLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : images.length === 0 ? (
                    <div className="flex items-center justify-center py-24">
                        <p className="text-muted-foreground">No products found for this size</p>
                    </div>
                ) : (
                    <ImageGrid images={images} />
                )}
            </div>
        </div>
    );
}
