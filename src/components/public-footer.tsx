import Link from "next/link";
import { LayoutGrid } from "lucide-react";

export function PublicFooter() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                                <LayoutGrid className="w-5 h-5" />
                            </div>
                            <span>Porcelain Tiles AI</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Premium porcelain tiles and design catalog for modern spaces.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Products</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/?category=Porcelain" className="hover:text-primary">Porcelain Tiles</Link></li>
                            <li><Link href="/?category=Ceramic" className="hover:text-primary">Ceramic Tiles</Link></li>
                            <li><Link href="/?category=Slab" className="hover:text-primary">Slab Tiles</Link></li>
                            <li><Link href="/catalogs" className="hover:text-primary">Catalogs</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Connect</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Email: info@porcelaintiles.ai</li>
                            <li>Phone: +1 (555) 123-4567</li>
                            <li>Address: 123 Tile Street, Design City</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Porcelain Tiles AI. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
