'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ChevronRight,
    ChevronLeft,
    Home,
    BookOpen,
    Mail,
    LayoutGrid,
    Ruler,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SizeOption = {
    id: string;
    name: string;
    categoryName: string;
    productCount: number;
};

interface CollapsibleSidebarProps {
    sizes?: SizeOption[];
    selectedSizeId?: string;
    onSizeChange?: (sizeId: string) => void;
}

export function CollapsibleSidebar({ sizes, selectedSizeId, onSizeChange }: CollapsibleSidebarProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const pathname = usePathname();

    // Load saved state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('sidebar-expanded');
        if (saved !== null) {
            setIsExpanded(saved === 'true');
        }
    }, []);

    // Save state to localStorage
    const toggleSidebar = () => {
        const newState = !isExpanded;
        setIsExpanded(newState);
        localStorage.setItem('sidebar-expanded', String(newState));
    };

    const navItems = [
        { href: '/', icon: Home, label: 'Home' },
        { href: '/home2', icon: LayoutGrid, label: 'Home 2' },
        { href: '/catalogs', icon: BookOpen, label: 'Catalogs' },
        { href: '/contact', icon: Mail, label: 'Contact' },
    ];

    const isHome2 = pathname === '/home2';

    return (
        <aside
            className={cn(
                'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r transition-all duration-300 z-40 overflow-y-auto',
                isExpanded ? 'w-64' : 'w-12'
            )}
        >
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
                {isExpanded ? (
                    <ChevronLeft className="w-4 h-4" />
                ) : (
                    <ChevronRight className="w-4 h-4" />
                )}
            </button>

            {/* Navigation */}
            <nav className="p-2 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-accent hover:text-accent-foreground',
                                !isExpanded && 'justify-center'
                            )}
                            title={!isExpanded ? item.label : undefined}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {isExpanded && (
                                <span className="text-sm font-medium whitespace-nowrap">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Size Filter - Only show on Home 2 page */}
            {isHome2 && sizes && sizes.length > 0 && isExpanded && (
                <div className="p-4 border-t">
                    <div className="flex items-center gap-2 mb-3">
                        <Ruler className="w-4 h-4 text-muted-foreground" />
                        <h3 className="font-semibold text-sm">Filter by Size</h3>
                    </div>
                    <div className="space-y-1">
                        {sizes.map((size) => (
                            <button
                                key={size.id}
                                onClick={() => onSizeChange?.(size.id)}
                                className={cn(
                                    'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                                    selectedSizeId === size.id
                                        ? 'bg-primary text-primary-foreground font-medium'
                                        : 'hover:bg-accent hover:text-accent-foreground'
                                )}
                            >
                                <div className="flex justify-between items-center">
                                    <span>{size.name}</span>
                                    <span className="text-xs opacity-70">
                                        {size.productCount}
                                    </span>
                                </div>
                                <div className="text-xs opacity-70 mt-0.5">
                                    {size.categoryName}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
}
