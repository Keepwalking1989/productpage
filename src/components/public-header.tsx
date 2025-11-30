import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function PublicHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                        <LayoutGrid className="w-5 h-5" />
                    </div>
                    <span>Porcelain Tiles AI</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/" className="hover:text-primary transition-colors">
                        Home
                    </Link>
                    <Link href="/home2" className="hover:text-primary transition-colors">
                        Home 2
                    </Link>
                    <Link href="/catalogs" className="hover:text-primary transition-colors">
                        Catalogs
                    </Link>
                    <Link href="/contact" className="hover:text-primary transition-colors">
                        Contact
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link
                        href="/admin"
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        Admin Login
                    </Link>
                </div>
            </div>
        </header>
    );
}
