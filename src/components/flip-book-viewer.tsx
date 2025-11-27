'use client';

import { useState, useRef, useEffect, forwardRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X, Download, AlertCircle, Camera, Mail, Heart, List, MessageCircle, Trash2, Share2 } from 'lucide-react';
import Link from 'next/link';
import { toPng } from 'html-to-image';

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
    const [isCapturing, setIsCapturing] = useState(false);

    // Favorites State
    const [favorites, setFavorites] = useState<number[]>([]);
    const [showFavorites, setShowFavorites] = useState(false);

    // Load favorites from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem(`favorites_${title}`);
        if (saved) {
            setFavorites(JSON.parse(saved));
        }
    }, [title]);

    // Save favorites to local storage
    useEffect(() => {
        localStorage.setItem(`favorites_${title}`, JSON.stringify(favorites));
    }, [favorites, title]);

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
        setError('We value your time, And We request you to Click on Download button Below.');
    }

    const handleScreenshot = async () => {
        if (!book.current || isCapturing) return;

        setIsCapturing(true);
        try {
            // Find the flipbook container element
            // We target the HTMLFlipBook component's internal container if possible, or our wrapper
            const element = document.querySelector('.react-pageflip-wrapper') as HTMLElement || containerRef.current;

            if (element) {
                // html-to-image is often more robust with modern CSS
                const dataUrl = await toPng(element, {
                    backgroundColor: '#18181b', // Match zinc-900
                    pixelRatio: 2, // Higher quality
                });

                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `${title.replace(/\s+/g, '_')}_Page_${pageNumber + 1}.png`;
                link.click();
            }
        } catch (err) {
            console.error('Screenshot failed:', err);
        } finally {
            setIsCapturing(false);
        }
    };

    const toggleFavorite = () => {
        const currentPage = pageNumber + 1;
        setFavorites(prev => {
            if (prev.includes(currentPage)) {
                return prev.filter(p => p !== currentPage);
            } else {
                return [...prev, currentPage].sort((a, b) => a - b);
            }
        });
    };

    const handleWhatsApp = (pages?: number[]) => {
        const pageList = pages || [pageNumber + 1];
        const text = `Hello, I am interested in the designs shown on ${pageList.length > 1 ? 'pages' : 'page'} ${pageList.join(', ')} of the catalog "${title}".`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleInquiry = (pages?: number[]) => {
        const pageList = pages || [pageNumber + 1];
        const subject = encodeURIComponent(`Inquiry: ${title}`);
        const body = encodeURIComponent(`Hello,\n\nI am interested in the designs shown on ${pageList.length > 1 ? 'pages' : 'page'} ${pageList.join(', ')} of the catalog "${title}".\n\nPlease provide more details.\n\nBest regards,`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
    };

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
        <div className="flex flex-col h-screen bg-zinc-900 text-white overflow-hidden relative">
            {/* Favorites Modal */}
            {showFavorites && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-zinc-800 rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col border border-zinc-700">
                        <div className="p-4 border-b border-zinc-700 flex items-center justify-between">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                                Favorite Pages
                            </h3>
                            <button onClick={() => setShowFavorites(false)} className="p-1 hover:bg-zinc-700 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            {favorites.length === 0 ? (
                                <div className="text-center text-zinc-400 py-8">
                                    <Heart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No favorite pages yet.</p>
                                    <p className="text-sm mt-1">Click the heart icon while browsing to add pages.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {favorites.map(page => (
                                        <div key={page} className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg border border-zinc-700/50">
                                            <span className="font-medium">Page {page}</span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        book.current?.pageFlip().flip(page - 1);
                                                        setShowFavorites(false);
                                                    }}
                                                    className="text-xs bg-zinc-700 hover:bg-zinc-600 px-2 py-1 rounded transition-colors"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => setFavorites(prev => prev.filter(p => p !== page))}
                                                    className="text-zinc-400 hover:text-red-400 p-1 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-zinc-700 bg-zinc-800/50 rounded-b-xl space-y-2">
                            <button
                                onClick={() => handleWhatsApp(favorites)}
                                disabled={favorites.length === 0}
                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <MessageCircle className="w-5 h-5" /> Share List on WhatsApp
                            </button>
                            <button
                                onClick={() => handleInquiry(favorites)}
                                disabled={favorites.length === 0}
                                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Mail className="w-5 h-5" /> Email List
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                    <button
                        onClick={toggleFavorite}
                        className={`p-2 rounded-full transition-colors ${favorites.includes(pageNumber + 1) ? 'bg-red-500/10 text-red-500' : 'hover:bg-zinc-700 text-zinc-400'}`}
                        title={favorites.includes(pageNumber + 1) ? "Remove from Favorites" : "Add to Favorites"}
                    >
                        <Heart className={`w-5 h-5 ${favorites.includes(pageNumber + 1) ? 'fill-current' : ''}`} />
                    </button>

                    <button
                        onClick={() => setShowFavorites(true)}
                        className="p-2 hover:bg-zinc-700 rounded-full transition-colors relative"
                        title="View Favorites"
                    >
                        <List className="w-5 h-5" />
                        {favorites.length > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-zinc-800" />
                        )}
                    </button>

                    <div className="w-px h-6 bg-zinc-700 mx-1 hidden sm:block" />

                    <button
                        onClick={() => handleWhatsApp()}
                        className="p-2 hover:bg-zinc-700 rounded-full transition-colors hidden sm:block"
                        title="Share on WhatsApp"
                    >
                        <MessageCircle className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => handleInquiry()}
                        className="p-2 hover:bg-zinc-700 rounded-full transition-colors hidden sm:block"
                        title="Ask about this page"
                    >
                        <Mail className="w-5 h-5" />
                    </button>

                    <button
                        onClick={handleScreenshot}
                        disabled={isCapturing}
                        className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
                        title="Save Screenshot"
                    >
                        <Camera className="w-5 h-5" />
                    </button>

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
                            <div className="react-pageflip-wrapper flex justify-center items-center">
                                {/* @ts-ignore */}
                                <HTMLFlipBook
                                    width={Math.floor(bookWidth)}
                                    height={Math.floor(bookHeight)}
                                    size="fixed"
                                    style={{}}
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
                            </div>
                        )}
                    </Document>
                )}
            </div>
        </div>
    );
}
