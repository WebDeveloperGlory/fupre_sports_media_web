// app/admin/page.tsx
export default function AdminDashboardPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card rounded-xl p-6 lg:p-8 shadow-sm border border-border">
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-card-foreground mb-2">
              Welcome to Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Select a section from the sidebar to get started
            </p>
          </div>
          
          <div className="py-16 px-8 bg-secondary/30 rounded-lg text-center border-2 border-dashed border-border">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-lg font-semibold text-card-foreground mb-2">
              Admin Dashboard
            </h2>
            <p className="text-muted-foreground text-sm">
              Select a section from the sidebar to manage your sports platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}