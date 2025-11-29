"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, Download, FileSpreadsheet, Link as LinkIcon } from "lucide-react";

interface Category {
    id: string;
    name: string;
}

interface Size {
    id: string;
    name: string;
}

export default function BulkUploadPage() {
    const router = useRouter();
    const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [googleSheetUrl, setGoogleSheetUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);

    useEffect(() => {
        // Load categories and sizes
        const loadData = async () => {
            try {
                const [categoriesRes, sizesRes] = await Promise.all([
                    fetch("/api/categories"),
                    fetch("/api/sizes"),
                ]);

                if (categoriesRes.ok) {
                    const categoriesData = await categoriesRes.json();
                    setCategories(categoriesData);
                }

                if (sizesRes.ok) {
                    const sizesData = await sizesRes.json();
                    setSizes(sizesData);
                }
            } catch (error) {
                console.error("Failed to load data:", error);
            }
        };

        loadData();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handlePreview = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();

            if (uploadMode === "file" && file) {
                formData.append("file", file);
            } else if (uploadMode === "url" && googleSheetUrl) {
                formData.append("googleSheetUrl", googleSheetUrl);
            }

            formData.append("categoryId", selectedCategory);
            formData.append("sizeId", selectedSize);

            const response = await fetch("/api/products/bulk-upload/preview", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to preview");
            }

            const data = await response.json();
            // Store preview data and navigate to preview page
            sessionStorage.setItem("bulkUploadPreview", JSON.stringify(data));
            router.push("/admin/products/bulk-upload/preview");
        } catch (error) {
            console.error("Preview error:", error);
            alert("Failed to preview. Please check your file and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadTemplate = async () => {
        window.open("/api/products/bulk-upload/template", "_blank");
    };

    const canPreview = uploadMode === "file" ? file !== null : googleSheetUrl.trim() !== "";

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Bulk Product Upload</h1>
                <p className="text-muted-foreground">
                    Upload multiple products at once using Excel, CSV, or Google Sheets
                </p>
            </div>

            <div className="space-y-8">
                {/* Download Template */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4">Step 1: Download Template</h2>
                    <p className="text-muted-foreground mb-4">
                        Download the Excel template to see the required format and column names.
                    </p>
                    <button
                        onClick={handleDownloadTemplate}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Download Template
                    </button>
                </div>

                {/* Optional Defaults */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4">Step 2: Set Default Values (Optional)</h2>
                    <p className="text-muted-foreground mb-4">
                        If all products have the same category and size, select them here.
                        These will override any values in your file.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Default Category (Optional)
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-2 border border-input rounded-lg bg-background"
                            >
                                <option value="">-- No default (use file values) --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Default Size (Optional)
                            </label>
                            <select
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                className="w-full px-4 py-2 border border-input rounded-lg bg-background"
                            >
                                <option value="">-- No default (use file values) --</option>
                                {sizes.map((size) => (
                                    <option key={size.id} value={size.id}>
                                        {size.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Upload Method */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4">Step 3: Upload Your Data</h2>

                    {/* Toggle Upload Mode */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setUploadMode("file")}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${uploadMode === "file"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                }`}
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            Upload File
                        </button>
                        <button
                            onClick={() => setUploadMode("url")}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${uploadMode === "url"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                }`}
                        >
                            <LinkIcon className="w-4 h-4" />
                            Google Sheets URL
                        </button>
                    </div>

                    {/* File Upload */}
                    {uploadMode === "file" && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Select Excel or CSV File
                            </label>
                            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer flex flex-col items-center gap-2"
                                >
                                    <Upload className="w-12 h-12 text-muted-foreground" />
                                    <p className="text-sm font-medium">
                                        {file ? file.name : "Click to upload or drag and drop"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Excel (.xlsx, .xls) or CSV (.csv)
                                    </p>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Google Sheets URL */}
                    {uploadMode === "url" && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Google Sheets URL
                            </label>
                            <input
                                type="url"
                                value={googleSheetUrl}
                                onChange={(e) => setGoogleSheetUrl(e.target.value)}
                                placeholder="https://docs.google.com/spreadsheets/d/..."
                                className="w-full px-4 py-3 border border-input rounded-lg bg-background"
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                Make sure the sheet is set to "Anyone with the link can view"
                            </p>
                        </div>
                    )}
                </div>

                {/* Preview Button */}
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => router.push("/admin/products")}
                        className="px-6 py-3 border border-input rounded-lg font-medium hover:bg-accent transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePreview}
                        disabled={!canPreview || isLoading}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Processing..." : "Preview Import"}
                    </button>
                </div>
            </div>
        </div>
    );
}
