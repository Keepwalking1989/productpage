"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Heart, MessageCircle } from "lucide-react";

interface ImageModalProps {
    images: { url: string; directUrl: string }[];
    productName: string;
    productSize: string;
    productFinish?: string;
    initialIndex?: number;
    isOpen: boolean;
    onClose: () => void;
}

export function ImageModal({
    images,
    productName,
    productSize,
    productFinish,
    initialIndex = 0,
    isOpen,
    onClose,
}: ImageModalProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "ArrowLeft") {
                handlePrevious();
            } else if (e.key === "ArrowRight") {
                handleNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, currentIndex]);

    if (!isOpen) return null;

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };

    const handleWhatsApp = () => {
        const message = encodeURIComponent(
            `Hi, I'm interested in ${productName} (Size: ${productSize}${productFinish ? `, Finish: ${productFinish}` : ""})`
        );
        window.open(`https://wa.me/?text=${message}`, "_blank");
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        // TODO: Implement actual favorite functionality (save to localStorage or backend)
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                            <h2 className="text-2xl font-bold text-white">{productName}</h2>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">Size:</span>
                                    <span className="font-medium text-white">{productSize}</span>
                                </div>
                                {productFinish && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">Surface:</span>
                                        <span className="font-medium text-white">{productFinish}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Favorite Button */}
                            <button
                                onClick={toggleFavorite}
                                className={`p-3 rounded-full transition-all ${isFavorite
                                        ? "bg-red-500 text-white hover:bg-red-600"
                                        : "bg-white/10 text-white hover:bg-white/20"
                                    }`}
                                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                                <Heart
                                    className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                                />
                            </button>

                            {/* WhatsApp Button */}
                            <button
                                onClick={handleWhatsApp}
                                className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all"
                                title="Contact via WhatsApp"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </button>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"
                                title="Close (Esc)"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Image Area */}
            <div className="absolute inset-0 flex items-center justify-center p-4 pt-24 pb-20">
                <div className="relative w-full h-full flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={images[currentIndex].directUrl}
                        alt={`${productName} - Image ${currentIndex + 1}`}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            </div>

            {/* Navigation Buttons */}
            {images.length > 1 && (
                <>
                    {/* Previous Button */}
                    <button
                        onClick={handlePrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Previous (←)"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Next (→)"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </>
            )}

            {/* Bottom Image Counter & Thumbnails */}
            {images.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col items-center gap-3">
                            {/* Counter */}
                            <div className="text-white text-sm font-medium">
                                {currentIndex + 1} / {images.length}
                            </div>

                            {/* Thumbnail Navigation */}
                            <div className="flex gap-2 overflow-x-auto max-w-full pb-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === currentIndex
                                                ? "border-white scale-110"
                                                : "border-white/30 hover:border-white/60"
                                            }`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={img.directUrl}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
