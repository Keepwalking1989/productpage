import { Suspense } from 'react';
import { getHome2Products } from '@/app/actions/get-home2-products';
import { ImageGrid } from '@/components/image-grid';
import { CollapsibleSidebar } from '@/components/collapsible-sidebar';
import { Loader2 } from 'lucide-react';

export const metadata = {
    title: 'Home 2 - Image Gallery | Porcelain Tiles AI',
    description: 'Explore our complete collection of porcelain tiles in an immersive image gallery',
};

async function ImageGridWrapper() {
    const images = await getHome2Products();

    if (images.length === 0) {
        return (
            <div className="flex items-center justify-center py-24">
                <p className="text-muted-foreground">No products found</p>
            </div>
        );
    }

    return <ImageGrid images={images} />;
}

export default function Home2Page() {
    return (
        <div className="relative min-h-screen">
            {/* Collapsible Sidebar */}
            <CollapsibleSidebar />

            {/* Main Content Area */}
            <div className="ml-12 transition-all duration-300">
                <Suspense
                    fallback={
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    }
                >
                    <ImageGridWrapper />
                </Suspense>
            </div>
        </div>
    );
}
