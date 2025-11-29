"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle, XCircle, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ParsedProduct {
    rowNumber: number;
    designName: string;
    size: string;
    collection: string;
    image1: string;
    image2?: string;
    image3?: string;
    image4?: string;
    image5?: string;
    description?: string;
    category?: string;
    color?: string;
    errors: string[];
    warnings: string[];
    status: "ready" | "warning" | "error";
}

interface PreviewData {
    products: ParsedProduct[];
    stats: {
        total: number;
        ready: number;
        warnings: number;
        errors: number;
    };
    defaultCategory?: string;
    defaultSize?: string;
}

export default function BulkUploadPreviewPage() {
    const router = useRouter();
    const [previewData, setPreviewData] = useState<PreviewData | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const [filterStatus, setFilterStatus] = useState<"all" | "ready" | "warning" | "error">("all");

    useEffect(() => {
        const data = sessionStorage.getItem("bulkUploadPreview");
        if (data) {
            setPreviewData(JSON.parse(data));
        } else {
            router.push("/admin/products/bulk-upload");
        }
    }, [router]);

    const handleImport = async () => {
        if (!previewData) return;

        setIsImporting(true);
        setImportProgress(0);

        try {
            // Get only valid products (ready or warning status)
            const validProducts = previewData.products.filter(
                p => p.status === "ready" || p.status === "warning"
            );

            const response = await fetch("/api/products/bulk-upload/import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    products: validProducts,
                    defaultCategory: previewData.defaultCategory,
                    defaultSize: previewData.defaultSize,
                }),
            });

            if (!response.ok) {
                throw new Error("Import failed");
            }

            const result = await response.json();

            // Clear session storage
            sessionStorage.removeItem("bulkUploadPreview");

            // Redirect to products page
            alert(`Successfully imported ${result.imported} products!`);
            router.push("/admin/products");
        } catch (error) {
            console.error("Import error:", error);
            alert("Failed to import products. Please try again.");
        } finally {
            setIsImporting(false);
        }
    };

    const handleDownloadErrors = () => {
        if (!previewData) return;

        const errorProducts = previewData.products.filter(p => p.status === "error" || p.status === "warning");

        const csvContent = [
            ["Row", "Product Name", "Status", "Issues"],
            ...errorProducts.map(p => [
                p.rowNumber,
                p.designName,
                p.status.toUpperCase(),
                [...p.errors, ...p.warnings].join("; ")
            ])
        ].map(row => row.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "bulk-upload-errors.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!previewData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-muted-foreground">Loading preview...</p>
                </div>
            </div>
        );
    }

    const filteredProducts = previewData.products.filter(p => {
        if (filterStatus === "all") return true;
        return p.status === filterStatus;
    });

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/products/bulk-upload"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Upload
                </Link>
                <h1 className="text-3xl font-bold mb-2">Import Preview</h1>
                <p className="text-muted-foreground">
                    Review the products before importing
                </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-card border border-border rounded-xl p-6">
                    <div className="text-2xl font-bold">{previewData.stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total Products</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div className="text-2xl font-bold">{previewData.stats.ready}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">Ready to Import</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                        <div className="text-2xl font-bold">{previewData.stats.warnings}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">Warnings</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-500" />
                        <div className="text-2xl font-bold">{previewData.stats.errors}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">Errors</div>
                </div>
            </div>

            {/* Default Values */}
            {(previewData.defaultCategory || previewData.defaultSize) && (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                    <p className="text-sm font-medium mb-2">Default Values Applied:</p>
                    <div className="flex gap-4 text-sm">
                        {previewData.defaultCategory && (
                            <div>
                                <span className="text-muted-foreground">Category:</span>{" "}
                                <span className="font-medium">{previewData.defaultCategory}</span>
                            </div>
                        )}
                        {previewData.defaultSize && (
                            <div>
                                <span className="text-muted-foreground">Size:</span>{" "}
                                <span className="font-medium">{previewData.defaultSize}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterStatus("all")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === "all"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                    >
                        All ({previewData.stats.total})
                    </button>
                    <button
                        onClick={() => setFilterStatus("ready")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === "ready"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                    >
                        Ready ({previewData.stats.ready})
                    </button>
                    <button
                        onClick={() => setFilterStatus("warning")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === "warning"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                    >
                        Warnings ({previewData.stats.warnings})
                    </button>
                    <button
                        onClick={() => setFilterStatus("error")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === "error"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                    >
                        Errors ({previewData.stats.errors})
                    </button>
                </div>

                {(previewData.stats.errors > 0 || previewData.stats.warnings > 0) && (
                    <button
                        onClick={handleDownloadErrors}
                        className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Download Error Report
                    </button>
                )}
            </div>

            {/* Products Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground font-medium">
                            <tr>
                                <th className="px-4 py-3 text-left">Row</th>
                                <th className="px-4 py-3 text-left">Product Name</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-left">Size</th>
                                <th className="px-4 py-3 text-left">Images</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Issues</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredProducts.map((product) => (
                                <tr key={product.rowNumber} className="hover:bg-accent/50">
                                    <td className="px-4 py-3 text-muted-foreground">{product.rowNumber}</td>
                                    <td className="px-4 py-3 font-medium">{product.designName || "-"}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{product.category || "-"}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{product.size || "-"}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {[product.image1, product.image2, product.image3, product.image4, product.image5]
                                            .filter(Boolean).length}
                                    </td>
                                    <td className="px-4 py-3">
                                        {product.status === "ready" && (
                                            <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                                                <CheckCircle className="w-4 h-4" /> Ready
                                            </span>
                                        )}
                                        {product.status === "warning" && (
                                            <span className="inline-flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                                                <AlertCircle className="w-4 h-4" /> Warning
                                            </span>
                                        )}
                                        {product.status === "error" && (
                                            <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
                                                <XCircle className="w-4 h-4" /> Error
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {[...product.errors, ...product.warnings].length > 0 ? (
                                            <div className="text-xs space-y-1">
                                                {product.errors.map((err, idx) => (
                                                    <div key={idx} className="text-red-600 dark:text-red-400">
                                                        • {err}
                                                    </div>
                                                ))}
                                                {product.warnings.map((warn, idx) => (
                                                    <div key={idx} className="text-yellow-600 dark:text-yellow-400">
                                                        • {warn}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
                <Link
                    href="/admin/products/bulk-upload"
                    className="px-6 py-3 border border-input rounded-lg font-medium hover:bg-accent transition-colors"
                >
                    Cancel
                </Link>
                <button
                    onClick={handleImport}
                    disabled={isImporting || previewData.stats.ready + previewData.stats.warnings === 0}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isImporting ? (
                        <>Importing...</>
                    ) : (
                        <>Import {previewData.stats.ready + previewData.stats.warnings} Products</>
                    )}
                </button>
            </div>
        </div>
    );
}
