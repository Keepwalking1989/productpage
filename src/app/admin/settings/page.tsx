import { Save } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage application configuration.</p>
            </div>

            <div className="space-y-6 bg-card p-6 rounded-xl border border-border">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Site Name</label>
                    <input
                        type="text"
                        defaultValue="Porcelain Tiles AI"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Email</label>
                    <input
                        type="email"
                        defaultValue="admin@example.com"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    />
                </div>

                <div className="pt-4">
                    <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
