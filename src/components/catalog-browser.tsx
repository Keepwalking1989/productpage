'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category, Size, Catalog } from '@prisma/client';
import { getSizesByCategory, getCatalogsBySize } from '@/app/actions/get-catalog-data';
import { getGoogleDriveDirectLink, getGoogleDriveDownloadLink } from '@/lib/google-drive';
import { ArrowLeft, BookOpen, Download, Layers, Maximize2, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CatalogBrowserProps {
    initialCategories: Category[];
}

type Step = 'categories' | 'sizes' | 'catalogs';

export function CatalogBrowser({ initialCategories }: CatalogBrowserProps) {
    const [step, setStep] = useState<Step>('categories');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedSize, setSelectedSize] = useState<Size | null>(null);

    const [sizes, setSizes] = useState<Size[]>([]);
    const [catalogs, setCatalogs] = useState<Catalog[]>([]);
    const [loading, setLoading] = useState(false);

    const handleCategoryClick = async (category: Category) => {
        setLoading(true);
        setSelectedCategory(category);
        try {
            const fetchedSizes = await getSizesByCategory(category.id);
            setSizes(fetchedSizes);
            setStep('sizes');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSizeClick = async (size: Size) => {
        setLoading(true);
        setSelectedSize(size);
        try {
            const fetchedCatalogs = await getCatalogsBySize(size.id);
            setCatalogs(fetchedCatalogs);
            setStep('catalogs');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (step === 'catalogs') {
            setStep('sizes');
            setSelectedSize(null);
        } else if (step === 'sizes') {
            setStep('categories');
            setSelectedCategory(null);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    return (
        <div className="w-full max-w-6xl mx-auto min-h-[600px] relative overflow-hidden bg-muted/20 rounded-3xl border border-border p-8">
            {/* Header / Breadcrumbs */}
            <div className="mb-8 flex items-center gap-4">
                {step !== 'categories' && (
                    <button
                        onClick={handleBack}
                        className="p-2 rounded-full hover:bg-accent transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                )}
                <div className="flex items-center gap-2 text-lg font-medium">
                    <span className={cn(step === 'categories' ? "text-primary font-bold" : "text-muted-foreground")}>
                        Categories
                    </span>
                    {selectedCategory && (
                        <>
                            <span className="text-muted-foreground">/</span>
                            <span className={cn(step === 'sizes' ? "text-primary font-bold" : "text-muted-foreground")}>
                                {selectedCategory.name}
                            </span>
                        </>
                    )}
                    {selectedSize && (
                        <>
                            <span className="text-muted-foreground">/</span>
                            <span className={cn(step === 'catalogs' ? "text-primary font-bold" : "text-muted-foreground")}>
                                {selectedSize.name}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
            ) : null}

            <AnimatePresence mode="wait">
                {step === 'categories' && (
                    <motion.div
                        key="categories"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {initialCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category)}
                                className="group relative aspect-video bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 text-left p-6 flex flex-col justify-between"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Layers className="w-10 h-10 text-primary mb-4" />
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                                    <p className="text-muted-foreground text-sm">{category.description || "Explore collection"}</p>
                                </div>
                            </button>
                        ))}
                    </motion.div>
                )}

                {step === 'sizes' && (
                    <motion.div
                        key="sizes"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {sizes.length > 0 ? sizes.map((size) => (
                            <button
                                key={size.id}
                                onClick={() => handleSizeClick(size)}
                                className="group relative aspect-video bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 text-left p-6 flex flex-col justify-between"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Maximize2 className="w-10 h-10 text-primary mb-4" />
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">{size.name}</h3>
                                    <p className="text-muted-foreground text-sm">{size.description || "View catalogs"}</p>
                                </div>
                            </button>
                        )) : (
                            <div className="col-span-full text-center py-12 text-muted-foreground">
                                No sizes found for this category.
                            </div>
                        )}
                    </motion.div>
                )}

                {step === 'catalogs' && (
                    <motion.div
                        key="catalogs"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {catalogs.length > 0 ? catalogs.map((catalog) => {
                            const thumbUrl = catalog.thumbnailUrl ? (getGoogleDriveDirectLink(catalog.thumbnailUrl) || catalog.thumbnailUrl) : null;
                            const pdfDownloadUrl = getGoogleDriveDownloadLink(catalog.pdfUrl) || catalog.pdfUrl;

                            return (
                                <div key={catalog.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all">
                                    <div className="aspect-[3/4] bg-muted relative group overflow-hidden">
                                        {thumbUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={thumbUrl}
                                                alt={catalog.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                                                <FileText className="w-16 h-16 opacity-20" />
                                            </div>
                                        )}

                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 p-4">
                                            <Link
                                                href={`/catalogs/book/${catalog.id}`}
                                                className="w-full bg-white text-black py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                                            >
                                                <BookOpen className="w-4 h-4" /> See as Book
                                            </Link>
                                            <a
                                                href={pdfDownloadUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                                            >
                                                <Download className="w-4 h-4" /> Download PDF
                                            </a>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold truncate" title={catalog.title}>{catalog.title}</h3>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="col-span-full text-center py-12 text-muted-foreground">
                                No catalogs found for this size.
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
