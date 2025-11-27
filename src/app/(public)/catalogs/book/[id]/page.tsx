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
    const pdfUrl = getGoogleDrivePdfLink(catalog.pdfUrl) || catalog.pdfUrl;
    const downloadUrl = getGoogleDriveDownloadLink(catalog.pdfUrl) || catalog.pdfUrl;

    return <FlipBookViewer pdfUrl={pdfUrl} title={catalog.title} downloadUrl={downloadUrl} />;
}
