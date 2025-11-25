/**
 * Extracts the File ID from a Google Drive URL.
 * Supports various formats:
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 */
export function getGoogleDriveFileId(url: string): string | null {
    const patterns = [
        /\/file\/d\/([a-zA-Z0-9_-]+)/, // Standard view link
        /id=([a-zA-Z0-9_-]+)/,         // ID parameter
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

/**
 * Converts a Google Drive shareable link into a direct download/view URL
 * suitable for use in <img> tags.
 */
export function getGoogleDriveDirectLink(url: string): string | null {
    const fileId = getGoogleDriveFileId(url);
    if (!fileId) return null;

    // Using the thumbnail format which is more reliable for previews
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
}

/**
 * Validates if a string is a potential Google Drive link
 */
export function isGoogleDriveLink(url: string): boolean {
    return url.includes("drive.google.com");
}
