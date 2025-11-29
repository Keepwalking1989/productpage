import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
    try {
        // Create template data
        const templateData = [
            {
                "Design Name": "AMORA BLUE",
                "Size": "600x1200mm",
                "Collection": "GLOSSY",
                "Image1": "https://example.com/image1.jpg",
                "Image2": "https://example.com/image2.jpg",
                "Image3": "",
                "Image4": "",
                "Image5": "",
                "Description": "Elevate your space with this premium design",
                "Category": "Porcelain Tiles",
                "Color": "Blue"
            },
            {
                "Design Name": "AMORA ICE",
                "Size": "600x1200mm",
                "Collection": "MATTE",
                "Image1": "https://example.com/image1.jpg",
                "Image2": "",
                "Image3": "",
                "Image4": "",
                "Image5": "",
                "Description": "The exquisite design for modern spaces",
                "Category": "Porcelain Tiles",
                "Color": "White"
            }
        ];

        // Create workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(templateData);

        // Set column widths
        ws['!cols'] = [
            { wch: 20 }, // Design Name
            { wch: 15 }, // Size
            { wch: 15 }, // Collection
            { wch: 50 }, // Image1
            { wch: 50 }, // Image2
            { wch: 50 }, // Image3
            { wch: 50 }, // Image4
            { wch: 50 }, // Image5
            { wch: 40 }, // Description
            { wch: 20 }, // Category
            { wch: 15 }, // Color
        ];

        XLSX.utils.book_append_sheet(wb, ws, "Products");

        // Generate Excel file
        const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

        return new NextResponse(excelBuffer, {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": "attachment; filename=bulk-upload-template.xlsx",
            },
        });
    } catch (error) {
        console.error("Template generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate template" },
            { status: 500 }
        );
    }
}
