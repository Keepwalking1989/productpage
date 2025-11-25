"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateProductInfo(imageUrl: string) {
    if (!process.env.GEMINI_API_KEY) {
        // Return empty data instead of throwing error
        return {
            name: "",
            description: "",
            finish: "",
            texture: "",
            colors: [],
            tags: [],
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

        const prompt = `
      Analyze this porcelain tile design image. 
      Generate a JSON response with the following fields:
      - name: A catchy, premium marketing name for this tile design.
      - description: A 100-word SEO-friendly description highlighting its texture, color, and suitable applications.
      - finish: The likely finish (e.g., High Gloss, Matt, Satin, Polished).
      - texture: The look/texture (e.g., Marble, Wood, Concrete, Stone).
      - colors: An array of dominant colors.
      - tags: An array of 5-10 SEO tags.

      Return ONLY the JSON. Do not include markdown formatting.
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

        return JSON.parse(cleanText);
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Failed to generate product info. Please check the image URL and try again.");
    }
}
