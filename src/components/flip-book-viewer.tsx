'use client';

import { useState, useRef, useEffect, forwardRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X, Download, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Styles for react-pdf
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker with explicit protocol
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FlipBookViewerProps {
    pdfUrl: string;
    title: string;
    downloadUrl?: string;
}

// Wrapper for page content to ensure ref forwarding works correctly with react-pageflip if needed
const PageCover = forwardRef<HTMLDivElement, any>((props, ref) => {
    return (
        <div ref={ref} className="bg-white overflow-hidden shadow-sm h-full w-full" data-density="hard">
            {props.children}
        </div>
    );
});
PageCover.displayName = 'PageCover';

const PageContent = forwardRef<HTMLDivElement, any>((props, ref) => {
    return (
        <div ref={ref} className="bg-white overflow-hidden shadow-sm h-full w-full">
            {props.children}
        </div>
    );
});
PageContent.displayName = 'PageContent';

export function FlipBookViewer({ pdfUrl, title, downloadUrl }: FlipBookViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(0);
    const book = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(800);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
            }
        };

        window.addEventListener('resize', updateWidth);
        // Small delay to ensure container is rendered
        setTimeout(updateWidth, 100);

        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setError(null);
    }

    function onDocumentLoadError(err: Error) {
        console.error('PDF Load Error:', err);
        setError('Failed to load PDF. Please try downloading it instead.');
    }

    // Calculate optimal dimensions
    // Use a max width to prevent it from being too large on huge screens
    const width = Math.min(550, (containerWidth / 2) - 20);
    const height = width * 1.414; // A4 aspect ratio

    return (
        <div className="flex flex-col h-screen bg-zinc-900 text-white overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 bg-zinc-800 border-b border-zinc-700 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/catalogs" className="p-2 hover:bg-zinc-700 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </Link>
                    <h1 className="font-semibold truncate max-w-md hidden sm:block">{title}</h1>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => book.current?.pageFlip().flipPrev()}
                        className="p-2 hover:bg-zinc-700 rounded-full transition-colors disabled:opacity-50"
                        title="Previous Page"
                        disabled={!numPages}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-mono min-w-[100px] text-center">
                        {numPages > 0 ? `Page ${pageNumber + 1} of ${numPages}` : 'Loading...'}
                    </span>
                    <button
                        onClick={() => book.current?.pageFlip().flipNext()}
                        className="p-2 hover:bg-zinc-700 rounded-full transition-colors disabled:opacity-50"
                        title="Next Page"
                        disabled={!numPages}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {downloadUrl && (
                        <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                            title="Download PDF"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Download</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Viewer Area */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-zinc-900/50 relative" ref={containerRef}>
                {error ? (
                    <div className="text-center p-6 bg-zinc-800 rounded-xl max-w-md">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Error Loading Catalog</h3>
                        <p className="text-zinc-400 mb-6">{error}</p>
                        {downloadUrl && (
                            <a
                                href={downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                            >
                                <Download className="w-4 h-4" /> Download PDF Instead
                            </a>
                        )}
                    </div>
                ) : (
                    <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={
                            <div className="flex flex-col items-center gap-4 text-zinc-400">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                <p>Loading Catalog...</p>
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
                                startPage={0}
                                drawShadow={true}
                                flippingTime={1000}
                                usePortrait={false}
                                startZIndex={0}
                                autoSize={true}
                                clickEventForward={true}
                                useMouseEvents={true}
                                swipeDistance={30}
                                showPageCorners={true}
                                disableFlipByClick={false}
                            >
                                {Array.from(new Array(numPages), (el, index) => {
                                    const PageComponent = index === 0 || index === numPages - 1 ? PageCover : PageContent;
                                    return (
                                        <PageComponent key={index} number={index + 1}>
                                            <Page
                                                pageNumber={index + 1}
                                                width={width}
                                                renderAnnotationLayer={false}
                                                renderTextLayer={false}
                                                className="w-full h-full"
                                                loading={
                                                    <div className="w-full h-full flex items-center justify-center bg-white text-zinc-300">
                                                        <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    </div>
                                                }
                                            />
                                            <div className="absolute bottom-4 right-4 text-xs text-gray-400 font-mono">
                                                {index + 1}
                                            </div>
                                        </PageComponent>
                                    );
                                })}
                            </HTMLFlipBook>
                        )}
                    </Document>
                )}
            </div>
        </div>
    );
}
