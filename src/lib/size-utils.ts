/**
 * Parse size name to extract dimensions and calculate aspect ratio
 * Format: "600x1200" -> { width: 600, height: 1200, aspectRatio: 0.5 }
 */
export function parseSizeName(sizeName: string): { width: number; height: number; aspectRatio: number } | null {
    // Match pattern like "600x1200" or "600 x 1200"
    const match = sizeName.match(/(\d+)\s*[xX×]\s*(\d+)/);

    if (match) {
        const width = parseInt(match[1], 10);
        const height = parseInt(match[2], 10);
        const aspectRatio = width / height;

        return { width, height, aspectRatio };
    }

    return null;
}

/**
 * Calculate aspect ratio category
 */
export function categorizeAspectRatio(ratio: number): 'square' | 'rectangleHorizontal' | 'rectangleVertical' {
    if (ratio >= 0.9 && ratio <= 1.1) {
        return 'square';
    } else if (ratio < 0.9) {
        return 'rectangleVertical';
    } else {
        return 'rectangleHorizontal';
    }
}
