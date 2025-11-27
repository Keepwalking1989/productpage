import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
        return new NextResponse('Missing url parameter', { status: 400 });
    }

    try {
        // Fetch the PDF from the target URL (Google Drive)
        const response = await fetch(targetUrl, {
            method: 'GET',
            // Google Drive might require specific headers or just standard fetch
        });

        if (!response.ok) {
            console.error(`Proxy failed to fetch: ${response.status} ${response.statusText}`);
            return new NextResponse(`Failed to fetch PDF`, { status: response.status });
        }

        // Get the response body as an ArrayBuffer
        const arrayBuffer = await response.arrayBuffer();

        // Create a new response with the PDF data and appropriate headers
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        // Cache for performance
        headers.set('Cache-Control', 'public, max-age=3600');
        // Allow CORS for this resource so the client-side PDF viewer can read it
        headers.set('Access-Control-Allow-Origin', '*');

        return new NextResponse(arrayBuffer, { headers });
    } catch (error) {
        console.error('Proxy error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
