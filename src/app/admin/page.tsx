import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Package, Layers, Ruler, Book, Plus } from 'lucide-react';

async function getDashboardStats() {
    try {
        const [productsCount, categoriesCount, sizesCount, catalogsCount] =
            await Promise.all([
                prisma.product.count(),
                prisma.category.count(),
                prisma.size.count(),
                prisma.catalog.count(),
            ]);

        return {
            products: productsCount,
            categories: categoriesCount,
            sizes: sizesCount,
            catalogs: catalogsCount,
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
            products: 0,
            categories: 0,
            sizes: 0,
            catalogs: 0,
        };
    }
}

export default async function AdminDashboard() {
    const stats = await getDashboardStats();

    const statsCards = [
        {
            title: 'Total Products',
            value: stats.products,
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-950',
        },
        {
            title: 'Categories',
            value: stats.categories,
            icon: Layers,
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-950',
        },
        {
            title: 'Sizes',
            value: stats.sizes,
            icon: Ruler,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-950',
        },
        {
            title: 'Catalogs',
            value: stats.catalogs,
            icon: Book,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50 dark:bg-orange-950',
        },
    ];

    const quickActions = [
        {
            label: 'Add Category',
            href: '/admin/categories',
            description: 'Create a new product category',
        },
        {
            label: 'Add Size',
            href: '/admin/sizes',
            description: 'Define a new size specification',
        },
        {
            label: 'Add Product',
            href: '/admin/products',
            description: 'Add a new product to inventory',
        },
        {
            label: 'Add Catalog',
            href: '/admin/catalogs',
            description: 'Upload a new digital catalog',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Welcome back to the admin panel.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statsCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={i}
                            className="p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </h3>
                                    <div className="mt-2 text-3xl font-bold">{stat.value}</div>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Activity */}
                <div className="col-span-4 bg-card rounded-xl border border-border shadow-sm p-6">
                    <h3 className="font-semibold mb-4">Recent Activity</h3>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground border border-dashed rounded-md">
                        Chart Placeholder
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="col-span-3 bg-card rounded-xl border border-border shadow-sm p-6">
                    <h3 className="font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        {quickActions.map((action, i) => (
                            <Link
                                key={i}
                                href={action.href}
                                className="block w-full text-left px-4 py-3 rounded-md hover:bg-accent transition-colors border border-transparent hover:border-border group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                        <Plus className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">{action.label}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {action.description}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* System Overview */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                <h3 className="font-semibold mb-4">System Overview</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 rounded-lg bg-muted/50">
                        <div className="text-sm text-muted-foreground mb-1">
                            Database Status
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm font-medium">Connected</span>
                        </div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                        <div className="text-sm text-muted-foreground mb-1">
                            Database Name
                        </div>
                        <div className="text-sm font-medium">productpage</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                        <div className="text-sm text-muted-foreground mb-1">
                            Total Records
                        </div>
                        <div className="text-sm font-medium">
                            {stats.products +
                                stats.categories +
                                stats.sizes +
                                stats.catalogs}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
