# AI Product Description Generator - Configuration Guide

## Overview
The AI-powered product description generator uses Google's Gemini API to automatically create SEO-optimized product descriptions based on product images and context.

## API Configuration

### API Key
- **API Key**: `AIzaSyAYLgAn7GXEw3FPGlaPeFx_5GxzNwdxweI`
- **Location**: Stored in `.env` file as `GEMINI_API_KEY`
- **Model**: `gemini-1.5-flash`

## Features

### 1. Context-Aware Generation
The AI now receives comprehensive product context:
- **Category** (e.g., Floor Tiles, Wall Tiles)
- **Size** (e.g., 600x1200mm, 800x1600mm)
- **Product Name** (e.g., Statuario Premium)
- **Finish** (e.g., High Gloss, Matt, Polished)
- **Image URL** (Google Drive or direct link)

### 2. SEO-Optimized Descriptions
The AI generates **15-line descriptions** that include:
- ✅ Size in **both MM and inches** (e.g., "600x1200mm (24x48 inches)")
- ✅ Visual characteristics and texture details
- ✅ Suitable applications and spaces
- ✅ Design style and aesthetic appeal
- ✅ SEO-friendly keywords naturally integrated
- ✅ Persuasive, engaging content for buyers

### 3. Generated Fields
The AI returns:
```json
{
  "name": "Premium product name",
  "description": "15 lines of SEO-optimized content...",
  "finish": "Surface finish type",
  "color": "Dominant color scheme"
}
```

## How to Use

### In Admin Panel - Add New Product

1. **Navigate** to Admin → Products → Add New Product
2. **Fill in basic info**:
   - Select Category
   - Select Size
   - Enter Product Name (optional)
   - Enter Finish (optional)
   - Add at least one Image URL (Google Drive link)

3. **Click "Generate Info"** button
   - The AI will analyze the image with the provided context
   - It will generate a comprehensive 15-line description
   - It will suggest/confirm finish and color
   - All fields will be auto-populated

4. **Review and Edit** the generated content as needed
5. **Save** the product

### In Admin Panel - Edit Product

Same process as above - the "Generate Info" button is available on the edit page as well.

## Example Output

For a product with:
- Category: Floor Tiles
- Size: 600x1200mm
- Name: Statuario Marble
- Finish: High Gloss

The AI might generate:
```
Introducing the Statuario Marble, a premium porcelain tile in 600x1200mm (24x48 inches).
This stunning tile features classic white marble aesthetics with elegant grey veining.
The high gloss finish creates a luxurious, reflective surface that brightens any space.
Perfect for modern residential and commercial applications.
Ideal for living rooms, lobbies, and high-traffic areas.
The large format reduces grout lines for a seamless look.
Durable porcelain construction ensures long-lasting beauty.
Easy to clean and maintain with standard tile cleaners.
Resistant to stains, scratches, and moisture.
Suitable for both floor and feature wall installations.
Complements contemporary and minimalist interior designs.
Available in consistent quality with minimal shade variation.
Recommended for use with matching grout for best results.
Professional installation recommended for optimal alignment.
Transform your space with this timeless marble-inspired design.
```

## Technical Details

### File Locations
- **AI Action**: `/src/app/actions/generate-product-info.ts`
- **New Product Page**: `/src/app/admin/products/new/page.tsx`
- **Edit Product Form**: `/src/app/admin/products/[id]/edit/edit-product-form.tsx`
- **Environment**: `/.env`

### API Usage
The function supports both old and new calling patterns:
```typescript
// Old way (still works)
await generateProductInfo(imageUrl);

// New way (recommended)
await generateProductInfo({
  imageUrl: "...",
  category: "Floor Tiles",
  size: "600x1200mm",
  name: "Statuario Marble",
  finish: "High Gloss"
});
```

## Benefits

1. **Time Saving**: Generate professional descriptions in seconds
2. **SEO Optimized**: Built-in SEO best practices
3. **Consistency**: Uniform quality across all products
4. **Size Conversion**: Automatic MM to inches conversion
5. **Context-Aware**: Uses product details for accurate descriptions
6. **Editable**: All generated content can be manually refined

## Notes

- The AI requires at least one image URL to function
- Generated content is a suggestion and can be edited before saving
- The more context you provide (category, size, name, finish), the better the AI output
- Size conversions are automatically included when size information is provided
- The 15-line format ensures comprehensive, detailed descriptions for SEO

## Troubleshooting

**If generation fails:**
1. Check that the image URL is accessible
2. Verify the Gemini API key is correctly set in `.env`
3. Ensure the image is a valid format (JPEG, PNG, WebP)
4. Check browser console for detailed error messages
5. Try regenerating after a few seconds

**For best results:**
- Use high-quality product images
- Fill in category, size, and finish before generating
- Provide a descriptive product name if available
- Use Google Drive direct links or publicly accessible URLs
