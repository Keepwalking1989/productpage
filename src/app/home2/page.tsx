import { getHome2Products, getAvailableSizes } from '@/app/actions/get-home2-products';
import { Home2Client } from '@/components/home2-client';

export const metadata = {
    title: 'Home 2 - Image Gallery | Porcelain Tiles AI',
    description: 'Explore our complete collection of porcelain tiles in an immersive image gallery',
};

export default async function Home2Page() {
    // Fetch available sizes
    const sizes = await getAvailableSizes();

    if (sizes.length === 0) {
        return (
            <div className="flex items-center justify-center py-24">
                <p className="text-muted-foreground">No products available</p>
            </div>
        );
    }

    // Fetch images for the first size by default
    const initialSizeId = sizes[0].id;
    const initialImages = await getHome2Products(initialSizeId);

    return (
        <Home2Client
            initialSizes={sizes}
            initialImages={initialImages}
            initialSizeId={initialSizeId}
        />
    );
}
