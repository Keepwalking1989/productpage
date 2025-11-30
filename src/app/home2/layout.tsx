import { PublicHeader } from "@/components/public-header";

export default function Home2Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <PublicHeader />
            <main className="flex-1 pt-0">
                {children}
            </main>
            {/* No footer for Home 2 - full screen image grid */}
        </div>
    );
}
