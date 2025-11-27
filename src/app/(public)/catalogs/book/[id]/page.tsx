import { notFound } from "next/navigation";
import { getCatalogById } from "@/app/actions/get-catalog-data";
import { FlipBookViewer } from "@/components/flip-book-viewer";
import { getGoogleDrivePdfLink, getGoogleDriveDownloadLink } from "@/lib/google-drive";

export const metadata = {
    title: "Catalog Viewer | Porcelain Tiles AI",
};

export default async function CatalogBookPage({
    params,
}: {
    params: { id: string };
}) {
    const resolvedParams = await params;
    const catalog = await getCatalogById(resolvedParams.id);

    if (!catalog) {
        notFound();
    }

    // Use the direct PDF link logic
    // We use the download link for the proxy target to ensure we get the binary
    const googleDriveDownloadUrl = getGoogleDriveDownloadLink(catalog.pdfUrl) || catalog.pdfUrl;

    // Construct the proxy URL
    // We must use the full URL if possible, or relative if on same domain. 
    // Since this is a server component, we can just return the relative path for the client to use.
    const pdfUrl = `/api/proxy-pdf?url=${encodeURIComponent(googleDriveDownloadUrl)}`;

    const downloadUrl = googleDriveDownloadUrl;

    return <FlipBookViewer pdfUrl={pdfUrl} title={catalog.title} downloadUrl={downloadUrl} />;
}
