'use client';

import { useState, useEffect } from 'react';
import { Book, Plus, Search, Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

interface Category {
    id: string;
    name: string;
}

interface Size {
    id: string;
    name: string;
    categoryId: string;
    category: Category;
}

interface Catalog {
    id: string;
    title: string;
    pdfUrl: string;
    thumbnailUrl?: string;
    sizeId: string;
    createdAt: string;
    size: Size;
}

export default function AdminCatalogsPage() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [catalogs, setCatalogs] = useState<Catalog[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [validatingUrl, setValidatingUrl] = useState(false);
    const [urlValidation, setUrlValidation] = useState<{
        valid: boolean;
        message?: string;
        warning?: string;
    } | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        sizeId: '',
        pdfUrl: '',
    });

    // Filter state
    const [filters, setFilters] = useState({
        search: '',
        sizeId: '',
    });

    // Fetch initial data
    useEffect(() => {
        fetchSizes();
        fetchCatalogs();
    }, []);

    // Fetch catalogs with filters
    useEffect(() => {
        fetchCatalogs();
    }, [filters.sizeId]);

    const fetchSizes = async () => {
        try {
            const response = await fetch('/api/sizes');
            if (response.ok) {
                const data = await response.json();
                setSizes(data);
            }
        } catch (error) {
            console.error('Error fetching sizes:', error);
        }
    };

    const fetchCatalogs = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.sizeId) params.append('sizeId', filters.sizeId);
            if (filters.search) params.append('search', filters.search);

            const response = await fetch(`/api/catalogs?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setCatalogs(data);
            }
        } catch (error) {
            console.error('Error fetching catalogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const validatePdfUrl = async () => {
        if (!formData.pdfUrl) {
            setUrlValidation({ valid: false, message: 'Please enter a URL' });
            return;
        }

        setValidatingUrl(true);
        setUrlValidation(null);

        try {
            const response = await fetch('/api/catalogs/validate-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: formData.pdfUrl }),
            });

            const data = await response.json();
            setUrlValidation(data);
        } catch (error) {
            console.error('Error validating URL:', error);
            setUrlValidation({
                valid: false,
                message: 'Failed to validate URL',
            });
        } finally {
            setValidatingUrl(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!urlValidation?.valid) {
            alert('Please validate the PDF URL first');
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch('/api/catalogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Reset form
                setFormData({
                    title: '',
                    sizeId: '',
                    pdfUrl: '',
                });
                setUrlValidation(null);
                setShowAddForm(false);

                // Refresh catalogs
                fetchCatalogs();
                alert('Catalog added successfully!');
            } else {
                const error = await response.json();
                alert(`Error: ${error.error || 'Failed to create catalog'}`);
            }
        } catch (error) {
            console.error('Error creating catalog:', error);
            alert('Failed to create catalog');
        } finally {
            setSubmitting(false);
        }
    };

    // Filter catalogs by search
    const filteredCatalogs = catalogs.filter((catalog) =>
        catalog.title.toLowerCase().includes(filters.search.toLowerCase())
    );

    // Get selected size details
    const selectedSize = sizes.find((s) => s.id === formData.sizeId);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Catalogs</h2>
                    <p className="text-muted-foreground">
                        Manage your digital catalogs and flipbooks.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    {showAddForm ? 'Cancel' : 'Add Catalog'}
                </button>
            </div>

            {/* Add Catalog Form */}
            {showAddForm && (
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Add New Catalog</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Catalog Title
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                placeholder="Enter catalog title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Select Size
                            </label>
                            <select
                                value={formData.sizeId}
                                onChange={(e) =>
                                    setFormData({ ...formData, sizeId: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                required
                            >
                                <option value="">-- Select Size --</option>
                                {sizes.map((size) => (
                                    <option key={size.id} value={size.id}>
                                        {size.name} ({size.category.name})
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-muted-foreground mt-1">
                                Click on the dropdown and start typing to search
                            </p>
                        </div>

                        {selectedSize && (
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Category
                                </label>
                                <input
                                    type="text"
                                    value={selectedSize.category.name}
                                    className="w-full px-3 py-2 border border-input rounded-md bg-muted"
                                    disabled
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Category is automatically selected based on the size
                                </p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Google Drive PDF URL
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    value={formData.pdfUrl}
                                    onChange={(e) => {
                                        setFormData({ ...formData, pdfUrl: e.target.value });
                                        setUrlValidation(null);
                                    }}
                                    className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
                                    placeholder="https://drive.google.com/file/d/..."
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={validatePdfUrl}
                                    disabled={validatingUrl || !formData.pdfUrl}
                                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {validatingUrl ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Validating...
                                        </>
                                    ) : (
                                        'Validate'
                                    )}
                                </button>
                            </div>

                            {urlValidation && (
                                <div
                                    className={`mt-2 p-3 rounded-md flex items-start gap-2 ${urlValidation.valid
                                            ? 'bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200'
                                            : 'bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200'
                                        }`}
                                >
                                    {urlValidation.valid ? (
                                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    )}
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            {urlValidation.message}
                                        </p>
                                        {urlValidation.warning && (
                                            <p className="text-xs mt-1 opacity-80">
                                                ⚠️ {urlValidation.warning}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={submitting || !urlValidation?.valid}
                                className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Catalog'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddForm(false);
                                    setFormData({
                                        title: '',
                                        sizeId: '',
                                        pdfUrl: '',
                                    });
                                    setUrlValidation(null);
                                }}
                                className="px-4 py-2 border border-input rounded-md hover:bg-accent"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filters */}
            <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        placeholder="Search catalogs..."
                        className="w-full pl-9 pr-4 py-2 border border-input rounded-md bg-background"
                    />
                </div>
                <select
                    value={filters.sizeId}
                    onChange={(e) => setFilters({ ...filters, sizeId: e.target.value })}
                    className="px-3 py-2 border border-input rounded-md bg-background min-w-[200px]"
                >
                    <option value="">All Sizes</option>
                    {sizes.map((size) => (
                        <option key={size.id} value={size.id}>
                            {size.name} ({size.category.name})
                        </option>
                    ))}
                </select>
            </div>

            {/* Catalogs Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                        <tr>
                            <th className="px-6 py-4">Catalog Title</th>
                            <th className="px-6 py-4">Size</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Created</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto" />
                                </td>
                            </tr>
                        ) : filteredCatalogs.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-8 text-center text-muted-foreground"
                                >
                                    <Book className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p className="font-medium">No catalogs found</p>
                                    <p className="text-xs mt-1">
                                        {filters.search || filters.sizeId
                                            ? 'Try adjusting your filters'
                                            : 'Start by adding your first catalog'}
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            filteredCatalogs.map((catalog) => (
                                <tr
                                    key={catalog.id}
                                    className="hover:bg-accent/50 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-muted overflow-hidden flex-shrink-0 border border-border flex items-center justify-center">
                                                <Book className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <span>{catalog.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {catalog.size.name}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {catalog.size.category.name}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {new Date(catalog.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a
                                            href={catalog.pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            View PDF
                                        </a>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
