'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { Check, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
    filters: {
        categories: string[];
        sizes: string[];
        finishes: string[];
        colors: string[];
    };
}

export function FilterSidebar({ filters }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            updateFilter('search', search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const createQueryString = useCallback(
        (name: string, value: string | null) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === null || value === '') {
                params.delete(name);
            } else {
                params.set(name, value);
            }
            // Reset page when filter changes
            if (name !== 'page') {
                params.delete('page');
            }
            return params.toString();
        },
        [searchParams]
    );

    const updateFilter = (name: string, value: string | null) => {
        // Only push if value changed
        const currentVal = searchParams.get(name);
        if (currentVal === value) return;
        if (currentVal === null && value === '') return;

        router.push(`/?${createQueryString(name, value)}`, { scroll: false });
    };

    const currentCategory = searchParams.get('category');
    const currentSize = searchParams.get('size');
    const currentFinish = searchParams.get('finish');
    const currentColor = searchParams.get('color');

    const clearFilters = () => {
        router.push('/');
        setSearch('');
    };

    const hasFilters = currentCategory || currentSize || currentFinish || currentColor || searchParams.get('search');

    return (
        <div className="space-y-8">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {hasFilters && (
                <button
                    onClick={clearFilters}
                    className="text-sm text-destructive hover:underline flex items-center gap-1"
                >
                    <X className="w-3 h-3" /> Clear all filters
                </button>
            )}

            {/* Categories */}
            <div className="space-y-3">
                <h3 className="font-semibold text-sm">Categories</h3>
                <div className="space-y-2">
                    {filters.categories.map((cat) => (
                        <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer group">
                            <div
                                className={cn(
                                    "w-4 h-4 border rounded flex items-center justify-center transition-colors",
                                    currentCategory === cat
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "border-input group-hover:border-primary"
                                )}
                                onClick={() => updateFilter('category', currentCategory === cat ? null : cat)}
                            >
                                {currentCategory === cat && <Check className="w-3 h-3" />}
                            </div>
                            <span className={cn(currentCategory === cat && "font-medium")}>{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Sizes */}
            <div className="space-y-3">
                <h3 className="font-semibold text-sm">Sizes</h3>
                <div className="space-y-2">
                    {filters.sizes.map((size) => (
                        <label key={size} className="flex items-center gap-2 text-sm cursor-pointer group">
                            <div
                                className={cn(
                                    "w-4 h-4 border rounded flex items-center justify-center transition-colors",
                                    currentSize === size
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "border-input group-hover:border-primary"
                                )}
                                onClick={() => updateFilter('size', currentSize === size ? null : size)}
                            >
                                {currentSize === size && <Check className="w-3 h-3" />}
                            </div>
                            <span className={cn(currentSize === size && "font-medium")}>{size}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Finishes */}
            <div className="space-y-3">
                <h3 className="font-semibold text-sm">Finishes</h3>
                <div className="space-y-2">
                    {filters.finishes.map((finish) => (
                        <label key={finish} className="flex items-center gap-2 text-sm cursor-pointer group">
                            <div
                                className={cn(
                                    "w-4 h-4 border rounded flex items-center justify-center transition-colors",
                                    currentFinish === finish
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "border-input group-hover:border-primary"
                                )}
                                onClick={() => updateFilter('finish', currentFinish === finish ? null : finish)}
                            >
                                {currentFinish === finish && <Check className="w-3 h-3" />}
                            </div>
                            <span className={cn(currentFinish === finish && "font-medium")}>{finish}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Colors */}
            <div className="space-y-3">
                <h3 className="font-semibold text-sm">Colors</h3>
                <div className="space-y-2">
                    {filters.colors.map((color) => (
                        <label key={color} className="flex items-center gap-2 text-sm cursor-pointer group">
                            <div
                                className={cn(
                                    "w-4 h-4 border rounded flex items-center justify-center transition-colors",
                                    currentColor === color
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "border-input group-hover:border-primary"
                                )}
                                onClick={() => updateFilter('color', currentColor === color ? null : color)}
                            >
                                {currentColor === color && <Check className="w-3 h-3" />}
                            </div>
                            <span className={cn(currentColor === color && "font-medium")}>{color}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
