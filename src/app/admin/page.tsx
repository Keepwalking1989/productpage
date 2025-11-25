export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Welcome back to the admin panel.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Stats Cards */}
                {[
                    { title: "Total Products", value: "1,204" },
                    { title: "Active Designs", value: "3,450" },
                    { title: "Catalogs", value: "12" },
                    { title: "Total Views", value: "45.2k" },
                ].map((stat, i) => (
                    <div key={i} className="p-6 bg-card rounded-xl border border-border shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                        <div className="mt-2 text-2xl font-bold">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Placeholder for Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 bg-card rounded-xl border border-border shadow-sm p-6">
                    <h3 className="font-semibold mb-4">Recent Activity</h3>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground border border-dashed rounded-md">
                        Chart Placeholder
                    </div>
                </div>
                <div className="col-span-3 bg-card rounded-xl border border-border shadow-sm p-6">
                    <h3 className="font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <button className="w-full text-left px-4 py-2 rounded-md hover:bg-accent text-sm transition-colors">
                            + Add New Product
                        </button>
                        <button className="w-full text-left px-4 py-2 rounded-md hover:bg-accent text-sm transition-colors">
                            + Upload Catalog
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
