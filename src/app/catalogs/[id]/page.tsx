import Flipbook from "@/components/flipbook";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function CatalogViewerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // Mock Pages - In real app, fetch from DB/Drive
    const pages = [
        "https://placehold.co/600x800/1a1a1a/white?text=Cover",
        "https://placehold.co/600x800/white/black?text=Page+1",
        "https://placehold.co/600x800/white/black?text=Page+2",
        "https://placehold.co/600x800/white/black?text=Page+3",
        "https://placehold.co/600x800/white/black?text=Page+4",
        "https://placehold.co/600x800/1a1a1a/white?text=Back",
    ];

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            <div className="p-4">
                <Link
                    href="/catalogs"
                    className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Catalogs
                </Link>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
                <Flipbook pages={pages} />
            </div>
        </div>
    );
}
