import { NextResponse } from 'next/server';

// Verify if a Google Drive URL contains a valid PDF
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json(
                { error: 'URL is required', valid: false },
                { status: 400 }
            );
        }

        // Check if it's a Google Drive URL
        const driveRegex = /drive\.google\.com\/(file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/;
        const match = url.match(driveRegex);

        if (!match) {
            return NextResponse.json({
                valid: false,
                error: 'Not a valid Google Drive URL',
            });
        }

        const fileId = match[2];

        // Try to fetch the file metadata using Google Drive API
        // For now, we'll do a basic check by trying to access the file
        const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

        try {
            const response = await fetch(directUrl, {
                method: 'HEAD',
                redirect: 'follow',
            });

            // Check if the response is successful
            if (response.ok || response.status === 302) {
                // Try to get content type
                const contentType = response.headers.get('content-type');

                if (contentType && contentType.includes('pdf')) {
                    return NextResponse.json({
                        valid: true,
                        fileId,
                        directUrl,
                        message: 'Valid PDF file detected',
                    });
                } else {
                    // Even if we can't confirm content type, if the URL is accessible, consider it valid
                    // Google Drive sometimes doesn't return proper headers for HEAD requests
                    return NextResponse.json({
                        valid: true,
                        fileId,
                        directUrl,
                        message: 'Google Drive file accessible (please ensure it is a PDF)',
                        warning: 'Could not verify file type automatically',
                    });
                }
            } else {
                return NextResponse.json({
                    valid: false,
                    error: 'File not accessible. Please check sharing permissions.',
                });
            }
        } catch (fetchError) {
            console.error('Error fetching file:', fetchError);

            // If fetch fails, still return the fileId if we extracted it
            // The URL format is valid even if we can't verify the file
            return NextResponse.json({
                valid: true,
                fileId,
                directUrl,
                message: 'Google Drive URL format is valid',
                warning: 'Could not verify file accessibility. Please ensure the file is shared publicly or with appropriate permissions.',
            });
        }
    } catch (error) {
        console.error('Error validating URL:', error);
        return NextResponse.json(
            { error: 'Failed to validate URL', valid: false },
            { status: 500 }
        );
    }
}
