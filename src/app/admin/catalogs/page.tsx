import { Book, Plus } from "lucide-react";
import Link from "next/link";

export default function AdminCatalogsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Catalogs</h2>
                    <p className="text-muted-foreground">Manage your digital catalogs and flipbooks.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                    <Plus className="w-4 h-4" /> Add Catalog
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Mock Data */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                        <div className="aspect-[3/4] bg-muted flex items-center justify-center relative">
                            <Book className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold">Catalog {i}</h3>
                            <p className="text-sm text-muted-foreground">Updated 2 days ago</p>
                            <div className="mt-4 flex gap-2">
                                <button className="text-sm border border-input px-3 py-1 rounded-md hover:bg-accent">Edit</button>
                                <Link href={`/catalogs/cat-${i}`} className="text-sm border border-input px-3 py-1 rounded-md hover:bg-accent">View</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
