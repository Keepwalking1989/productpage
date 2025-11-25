"use client";

import HTMLFlipBook from "react-pageflip";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FlipbookProps {
    pages: string[]; // Array of image URLs
}

export default function Flipbook({ pages }: FlipbookProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [bookRef, setBookRef] = useState<any>(null);

    const nextFlip = () => {
        if (bookRef) bookRef.pageFlip().flipNext();
    };

    const prevFlip = () => {
        if (bookRef) bookRef.pageFlip().flipPrev();
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center py-10">
            <button
                onClick={prevFlip}
                className="absolute left-0 md:-left-12 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors"
            >
                <ChevronLeft className="w-8 h-8 text-white" />
            </button>

            {/* @ts-expect-error - react-pageflip types are sometimes tricky */}
            <HTMLFlipBook
                width={400}
                height={550}
                size="stretch"
                minWidth={300}
                maxWidth={500}
                minHeight={400}
                maxHeight={700}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                className="shadow-2xl"
                ref={(el) => setBookRef(el)}
            >
                {pages.map((url, index) => (
                    <div key={index} className="bg-white p-2 shadow-inner">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={url}
                            alt={`Page ${index + 1}`}
                            className="w-full h-full object-cover rounded-sm"
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                            {index + 1}
                        </div>
                    </div>
                ))}
            </HTMLFlipBook>

            <button
                onClick={nextFlip}
                className="absolute right-0 md:-right-12 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors"
            >
                <ChevronRight className="w-8 h-8 text-white" />
            </button>
        </div>
    );
}
