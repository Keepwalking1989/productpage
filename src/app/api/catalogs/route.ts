import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all catalogs with optional filtering
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sizeId = searchParams.get('sizeId');
        const search = searchParams.get('search');

        const where: any = {};

        if (sizeId) {
            where.sizeId = sizeId;
        }

        if (search) {
            where.title = {
                contains: search,
            };
        }

        const catalogs = await prisma.catalog.findMany({
            where,
            include: {
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

        return NextResponse.json(catalogs);
    } catch (error) {
        console.error('Error fetching catalogs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch catalogs' },
            { status: 500 }
        );
    }
}

// POST create a new catalog
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, pdfUrl, sizeId, thumbnailUrl } = body;

        // Validate required fields
        if (!title || !pdfUrl || !sizeId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Verify the size exists
        const size = await prisma.size.findUnique({
            where: { id: sizeId },
            include: { category: true },
        });

        if (!size) {
            return NextResponse.json(
                { error: 'Size not found' },
                { status: 404 }
            );
        }

        // Create the catalog
        const catalog = await prisma.catalog.create({
            data: {
                title,
                pdfUrl,
                sizeId,
                thumbnailUrl,
            },
            include: {
                size: {
                    include: {
                        category: true,
                    },
                },
            },
        });

        return NextResponse.json(catalog, { status: 201 });
    } catch (error) {
        console.error('Error creating catalog:', error);
        return NextResponse.json(
            { error: 'Failed to create catalog' },
            { status: 500 }
        );
    }
}
