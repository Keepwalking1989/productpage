import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const categories = await prisma.category.findMany({
        include: {
            sizes: {
                include: {
                    _count: {
                        select: { products: true },
                    },
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(categories);
}
