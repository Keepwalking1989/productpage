'use client';

import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X } from 'lucide-react';
import Link from 'next/link';

// Styles for react-pdf
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FlipBookViewerProps {
    pdfUrl: string;
    title: string;
}

export function FlipBookViewer({ pdfUrl, title }: FlipBookViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(0); // 0-indexed for flipbook logic usually, but let's see
    const book = useRef<any>(null);
    const [zoom, setZoom] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(800);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
            }
        };

        window.addEventListener('resize', updateWidth);
        updateWidth();

        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const width = Math.min(600, (containerWidth / 2) - 20); // Single page width
    const height = width * 1.414; // A4 aspect ratio approx

    return (
        <div className="flex flex-col h-screen bg-zinc-900 text-white overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 bg-zinc-800 border-b border-zinc-700 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/catalogs" className="p-2 hover:bg-zinc-700 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </Link>
                    <h1 className="font-semibold truncate max-w-md">{title}</h1>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => book.current?.pageFlip().flipPrev()}
                        className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
                        title="Previous Page"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-mono">
                        {/* Page index from flipbook might be tricky to sync perfectly without events, but let's try simple UI first */}
                        Page {pageNumber + 1} of {numPages}
                    </span>
                    <button
                        onClick={() => book.current?.pageFlip().flipNext()}
                        className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
                        title="Next Page"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {/* Zoom is tricky with flipbook, skipping for now to ensure stability */}
                </div>
            </div>

            {/* Viewer Area */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-hidden bg-zinc-900/50" ref={containerRef}>
                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="flex items-center gap-2 text-zinc-400">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Loading PDF...
                        </div>
                    }
                    className="flex justify-center"
                >
                    {numPages > 0 && (
                        // @ts-ignore - Types for react-pageflip are sometimes loose
                        <HTMLFlipBook
                            width={width}
                            height={height}
                            size="stretch"
                            minWidth={300}
                            maxWidth={1000}
                            minHeight={400}
                            maxHeight={1533}
                            maxShadowOpacity={0.5}
                            showCover={true}
                            mobileScrollSupport={true}
                            ref={book}
                            onFlip={(e) => setPageNumber(e.data)}
                            className="shadow-2xl"
                        >
                            {Array.from(new Array(numPages), (el, index) => (
                                <div key={index} className="bg-white overflow-hidden shadow-sm">
                                    <Page
                                        pageNumber={index + 1}
                                        width={width}
                                        renderAnnotationLayer={false}
                                        renderTextLayer={false}
                                        className="w-full h-full"
                                    />
                                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                                        {index + 1}
                                    </div>
                                </div>
                            ))}
                        </HTMLFlipBook>
                    )}
                </Document>
            </div>
        </div>
    );
}
