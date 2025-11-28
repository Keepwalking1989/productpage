"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface GenerateProductInfoParams {
    imageUrl: string;
    category?: string;
    size?: string;
    name?: string;
    finish?: string;
}

export async function generateProductInfo(params: GenerateProductInfoParams | string) {
    // Support both old (string) and new (object) API
    const imageUrl = typeof params === 'string' ? params : params.imageUrl;
    const category = typeof params === 'object' ? params.category : undefined;
    const size = typeof params === 'object' ? params.size : undefined;
    const name = typeof params === 'object' ? params.name : undefined;
    const finish = typeof params === 'object' ? params.finish : undefined;

    if (!process.env.GEMINI_API_KEY) {
        // Return empty data instead of throwing error
        return {
            name: "",
            description: "",
            finish: "",
            color: "",
        };
    }

    try {
        // Fetch the image
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error("Failed to fetch image from URL");

        const arrayBuffer = await response.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString("base64");
        const mimeType = response.headers.get("content-type") || "image/jpeg";

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Build context information
        const contextInfo = [];
        if (category) contextInfo.push(`Category: ${category}`);
        if (size) contextInfo.push(`Size: ${size}`);
        if (name) contextInfo.push(`Product Name: ${name}`);
        if (finish) contextInfo.push(`Finish: ${finish}`);

        const contextString = contextInfo.length > 0
            ? `\n\nProduct Context:\n${contextInfo.join('\n')}`
            : '';

        const prompt = `
Analyze this porcelain tile design image${contextString ? ' with the following context:' + contextString : ''}. 

Generate a JSON response with the following fields:
- name: A catchy, premium marketing name for this tile design (if not provided in context).
- description: A comprehensive SEO-optimized description with EXACTLY 15 lines. Each line should be a complete sentence or phrase. The description MUST:
  * Include the tile size in BOTH millimeters (MM) and inches if size is provided
  * Highlight the visual characteristics, texture, and finish
  * Mention suitable applications and spaces
  * Include design style and aesthetic appeal
  * Use SEO-friendly keywords naturally
  * Be engaging and persuasive for potential buyers
  * Format as 15 separate lines/sentences
- finish: The surface finish type (e.g., High Gloss, Matt, Satin, Polished, Carving) - use context if provided, otherwise analyze the image.
- color: The dominant color or color scheme (e.g., White, Beige, Grey, Multi-tone).

IMPORTANT: The description must be EXACTLY 15 lines. Each line should be a meaningful sentence or phrase about the product.

Return ONLY valid JSON. Do not include markdown formatting or code blocks.

Example format:
{
  "name": "Premium Marble Elite",
  "description": "Line 1 about the product.\\nLine 2 with size in MM and inches.\\nLine 3 about texture.\\n... (continue to 15 lines)",
  "finish": "High Gloss",
  "color": "White with Grey Veining"
}
`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: mimeType,
                },
            },
        ]);

        const text = result.response.text();

        // Clean up potential markdown code blocks
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const parsedData = JSON.parse(cleanText);

        // Ensure we return the expected fields
        return {
            name: parsedData.name || name || "",
            description: parsedData.description || "",
            finish: parsedData.finish || finish || "",
            color: parsedData.color || "",
        };
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Failed to generate product info. Please check the image URL and try again.");
    }
}
