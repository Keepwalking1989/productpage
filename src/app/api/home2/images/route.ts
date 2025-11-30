import { NextRequest, NextResponse } from 'next/server';
import { getHome2Products } from '@/app/actions/get-home2-products';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const sizeId = searchParams.get('sizeId');

        if (!sizeId) {
            return NextResponse.json(
                { error: 'Size ID is required' },
                { status: 400 }
            );
        }

        const images = await getHome2Products(sizeId);
        return NextResponse.json(images);
    } catch (error) {
        console.error('Error fetching home2 images:', error);
        return NextResponse.json(
            { error: 'Failed to fetch images' },
            { status: 500 }
        );
    }
}
