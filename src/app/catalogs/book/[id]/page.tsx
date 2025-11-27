'use server';

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getGoogleDriveDirectLink } from '@/lib/google-drive';
import { Download } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Catalog Viewer',
    description: 'View catalog PDF as a book',
};

export default async function CatalogBookPage({ params }: { params: { id: string } }) {
    const catalog = await prisma.catalog.findUnique({
        where: { id: params.id },
        include: { size: { include: { category: true } } },
    });

    if (!catalog) {
        notFound();
    }

    const pdfUrl = getGoogleDriveDirectLink(catalog.pdfUrl) || catalog.pdfUrl;

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">{catalog.title}</h1>
                    <Link
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <Download className="w-4 h-4" /> Download PDF
                    </Link>
                </div>
                <div className="border border-border rounded-lg overflow-hidden">
                    {/* Simple PDF embed; browsers will render PDF with built‑in viewer */}
                    <embed src={pdfUrl} type="application/pdf" className="w-full h-[80vh]" />
                </div>
            </div>
        </div>
    );
}
