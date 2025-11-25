import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const sizes = await prisma.size.findMany({
        include: {
            category: true,
            _count: {
                select: { products: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(sizes);
}
