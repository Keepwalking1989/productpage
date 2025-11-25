import Link from "next/link";
import { Book } from "lucide-react";

export default function CatalogsPage() {
    // Mock Data
    const catalogs = [
        { id: "cat-1", title: "Porcelain Collection 2024", size: "600x1200", cover: "" },
        { id: "cat-2", title: "Ceramic Wall Tiles", size: "300x600", cover: "" },
        { id: "cat-3", title: "Luxury Slabs", size: "1200x2400", cover: "" },
    ];

    return (
        <div className="min-h-screen bg-background pt-20 pb-12">
            <div className="container px-4 mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold">Digital Catalogs</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Explore our complete range of designs in our interactive digital catalogs.
                        Experience the look and feel of a real book.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {catalogs.map((catalog) => (
                        <Link
                            key={catalog.id}
                            href={`/catalogs/${catalog.id}`}
                            className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300"
                        >
                            <div className="aspect-[3/4] bg-gray-200 relative">
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
                                    <Book className="w-16 h-16" />
                                </div>
                                {/* Cover Image Placeholder */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 left-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                                    <span className="font-medium">Read Catalog</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-xl mb-1">{catalog.title}</h3>
                                <p className="text-sm text-muted-foreground">{catalog.size} Series</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
