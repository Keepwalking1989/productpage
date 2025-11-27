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
    const [containerDimensions, setContainerDimensions] = useState({ width: 800, height: 600 });
    const [pdfDimensions, setPdfDimensions] = useState<{ width: number; height: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setContainerDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        window.addEventListener('resize', updateDimensions);
        setTimeout(updateDimensions, 100);

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    async function onDocumentLoadSuccess(pdf: any) {
        setNumPages(pdf.numPages);
        setError(null);

        try {
            // Get dimensions of the first page to determine aspect ratio
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1 });
            setPdfDimensions({ width: viewport.width, height: viewport.height });
        } catch (e) {
            console.error("Failed to get page dimensions", e);
            // Fallback to standard A4 if failed
            setPdfDimensions({ width: 595, height: 842 });
        }
    }

    function onDocumentLoadError(err: Error) {
        console.error('PDF Load Error:', err);
        setError('Failed to load PDF. Please try downloading it instead.');
    }

    // Calculate optimal dimensions
    const availableWidth = containerDimensions.width;
    const availableHeight = containerDimensions.height;

    // Default to A4 portrait if not loaded yet
    let bookWidth = 400;
    let bookHeight = 600;

    if (pdfDimensions) {
        const pdfAspectRatio = pdfDimensions.width / pdfDimensions.height;

        // In 2-page view, the book aspect ratio (width/height) is effectively double the page aspect ratio
        // But here 'width' is for a SINGLE page.

        // We want to fit a single page into (availableWidth / 2) x availableHeight
        const maxPageWidth = (availableWidth / 2) - 10; // margin
        const maxPageHeight = availableHeight - 20; // margin

        // Try fitting by height first
        bookHeight = maxPageHeight;
        bookWidth = bookHeight * pdfAspectRatio;

        // If width is too big, fit by width
        if (bookWidth > maxPageWidth) {
            bookWidth = maxPageWidth;
            bookHeight = bookWidth / pdfAspectRatio;
        }
    }

    return (
        <div className="flex flex-col h-screen bg-zinc-900 text-white overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 bg-zinc-800 border-b border-zinc-700 z-10 shrink-0">
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
            <div className="flex-1 flex items-center justify-center overflow-hidden bg-zinc-900/50 relative" ref={containerRef}>
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
                        className="flex justify-center items-center"
                    >
                        {numPages > 0 && pdfDimensions && (
                            // @ts-ignore - Types for react-pageflip are sometimes loose
                            <HTMLFlipBook
                                width={Math.floor(bookWidth)}
                                height={Math.floor(bookHeight)}
                                size="fixed"
                                minWidth={200}
                                maxWidth={1500}
                                minHeight={300}
                                maxHeight={2000}
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
                                            <div className="w-full h-full flex items-center justify-center bg-white">
                                                <Page
                                                    pageNumber={index + 1}
                                                    width={Math.floor(bookWidth)}
                                                    renderAnnotationLayer={false}
                                                    renderTextLayer={false}
                                                    className="w-full h-full"
                                                />
                                            </div>
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
