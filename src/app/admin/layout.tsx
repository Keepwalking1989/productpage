import Link from "next/link";
import { LayoutDashboard, Package, BookOpen, Settings, Layers, Maximize2 } from "lucide-react";
import { getSession } from "@/lib/session";
import { LogoutButton } from "./logout-button";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    const userName = session.name || 'Admin User';
    const userEmail = session.email || 'admin@example.com';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
                <div className="p-6 border-b border-border">
                    <h1 className="text-xl font-bold tracking-tight">Admin Panel</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/products"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <Package className="w-5 h-5" />
                        Products
                    </Link>
                    <Link
                        href="/admin/categories"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <Layers className="w-5 h-5" />
                        Categories
                    </Link>
                    <Link
                        href="/admin/sizes"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <Maximize2 className="w-5 h-5" />
                        Sizes
                    </Link>
                    <Link
                        href="/admin/catalogs"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <BookOpen className="w-5 h-5" />
                        Catalogs
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <Settings className="w-5 h-5" />
                        Settings
                    </Link>
                </nav>
                <div className="p-4 border-t border-border space-y-4">
                    <div className="px-4">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Theme</p>
                        <ThemeToggle />
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {userInitials}
                        </div>
                        <div className="text-sm flex-1 min-w-0">
                            <p className="font-medium truncate">{userName}</p>
                            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                        </div>
                    </div>
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
