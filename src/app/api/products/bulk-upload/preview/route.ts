import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import prisma from "@/lib/prisma";

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

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const googleSheetUrl = formData.get("googleSheetUrl") as string | null;
        const categoryId = formData.get("categoryId") as string;
        const sizeId = formData.get("sizeId") as string;

        let workbook: XLSX.WorkBook;

        // Parse file or Google Sheets
        if (file) {
            const buffer = await file.arrayBuffer();
            workbook = XLSX.read(buffer, { type: "array" });
        } else if (googleSheetUrl) {
            // For Google Sheets, we need to convert the URL to CSV export URL
            const sheetId = extractGoogleSheetId(googleSheetUrl);
            if (!sheetId) {
                return NextResponse.json(
                    { error: "Invalid Google Sheets URL" },
                    { status: 400 }
                );
            }

            const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
            const response = await fetch(csvUrl);
            if (!response.ok) {
                return NextResponse.json(
                    { error: "Failed to fetch Google Sheet. Make sure it's publicly accessible." },
                    { status: 400 }
                );
            }

            const csvText = await response.text();
            workbook = XLSX.read(csvText, { type: "string" });
        } else {
            return NextResponse.json(
                { error: "No file or Google Sheets URL provided" },
                { status: 400 }
            );
        }

        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        if (data.length === 0) {
            return NextResponse.json(
                { error: "No data found in the file" },
                { status: 400 }
            );
        }

        // Fetch categories and sizes for validation
        const [categories, sizes] = await Promise.all([
            prisma.category.findMany({ select: { id: true, name: true } }),
            prisma.size.findMany({ select: { id: true, name: true } }),
        ]);

        // Get default category and size if provided
        let defaultCategory: { id: string; name: string } | null = null;
        let defaultSize: { id: string; name: string } | null = null;

        if (categoryId) {
            defaultCategory = categories.find(c => c.id === categoryId) || null;
        }
        if (sizeId) {
            defaultSize = sizes.find(s => s.id === sizeId) || null;
        }

        // Parse and validate each row
        const parsedProducts: ParsedProduct[] = [];

        for (let i = 0; i < data.length; i++) {
            const row: any = data[i];
            const rowNumber = i + 2; // +2 because Excel starts at 1 and we have header row

            const product = parseProductRow(
                row,
                rowNumber,
                defaultCategory,
                defaultSize,
                categories,
                sizes
            );

            parsedProducts.push(product);
        }

        // Calculate statistics
        const stats = {
            total: parsedProducts.length,
            ready: parsedProducts.filter(p => p.status === "ready").length,
            warnings: parsedProducts.filter(p => p.status === "warning").length,
            errors: parsedProducts.filter(p => p.status === "error").length,
        };

        return NextResponse.json({
            products: parsedProducts,
            stats,
            defaultCategory: defaultCategory?.name,
            defaultSize: defaultSize?.name,
        });
    } catch (error) {
        console.error("Preview error:", error);
        return NextResponse.json(
            { error: "Failed to process file" },
            { status: 500 }
        );
    }
}

function extractGoogleSheetId(url: string): string | null {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
}

function parseProductRow(
    row: any,
    rowNumber: number,
    defaultCategory: { id: string; name: string } | null,
    defaultSize: { id: string; name: string } | null,
    categories: { id: string; name: string }[],
    sizes: { id: string; name: string }[]
): ParsedProduct {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Map column names (flexible matching)
    const designName = getColumnValue(row, ["Design Name", "Product Name", "Name", "Product"]);
    const size = getColumnValue(row, ["Size"]);
    const collection = getColumnValue(row, ["Collection", "Finish", "Surface"]);
    const image1 = getColumnValue(row, ["Image1", "Image 1", "Image1 URL"]);
    const image2 = getColumnValue(row, ["Image2", "Image 2", "Image2 URL"]);
    const image3 = getColumnValue(row, ["Image3", "Image 3", "Image3 URL"]);
    const image4 = getColumnValue(row, ["Image4", "Image 4", "Image4 URL"]);
    const image5 = getColumnValue(row, ["Image5", "Image 5", "Image5 URL"]);
    const description = getColumnValue(row, ["Description", "Desc"]);
    const category = getColumnValue(row, ["Category", "Cat"]);
    const color = getColumnValue(row, ["Color", "Colour"]);

    // Validate required fields
    if (!designName) {
        errors.push("Design Name is required");
    }

    if (!image1) {
        errors.push("At least one image (Image1) is required");
    } else if (!isValidUrl(image1)) {
        warnings.push("Image1 URL appears invalid");
    }

    // Validate additional images
    [image2, image3, image4, image5].forEach((img, idx) => {
        if (img && !isValidUrl(img)) {
            warnings.push(`Image${idx + 2} URL appears invalid`);
        }
    });

    // Determine category to use
    let finalCategory = defaultCategory?.name;
    let categoryValid = true;

    if (!defaultCategory && category) {
        // Use category from Excel
        const foundCategory = categories.find(c =>
            c.name.toLowerCase() === category.toLowerCase()
        );
        if (foundCategory) {
            finalCategory = foundCategory.name;
        } else {
            errors.push(`Category "${category}" not found in database`);
            categoryValid = false;
        }
    } else if (!defaultCategory && !category) {
        errors.push("Category is required (select default or provide in file)");
        categoryValid = false;
    }

    // Determine size to use
    let finalSize = defaultSize?.name;
    let sizeValid = true;

    if (!defaultSize && size) {
        // Use size from Excel
        const foundSize = sizes.find(s =>
            s.name.toLowerCase() === size.toLowerCase()
        );
        if (foundSize) {
            finalSize = foundSize.name;
        } else {
            errors.push(`Size "${size}" not found in database`);
            sizeValid = false;
        }
    } else if (!defaultSize && !size) {
        errors.push("Size is required (select default or provide in file)");
        sizeValid = false;
    }

    // Determine status
    let status: "ready" | "warning" | "error" = "ready";
    if (errors.length > 0) {
        status = "error";
    } else if (warnings.length > 0) {
        status = "warning";
    }

    return {
        rowNumber,
        designName: designName || "",
        size: finalSize || size || "",
        collection: collection || "",
        image1: image1 || "",
        image2,
        image3,
        image4,
        image5,
        description,
        category: finalCategory || category,
        color,
        errors,
        warnings,
        status,
    };
}

function getColumnValue(row: any, possibleNames: string[]): string {
    for (const name of possibleNames) {
        if (row[name] !== undefined && row[name] !== null && row[name] !== "") {
            return String(row[name]).trim();
        }
    }
    return "";
}

function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}
