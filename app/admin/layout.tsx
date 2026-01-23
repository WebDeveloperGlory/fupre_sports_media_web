// app/admin/layout.tsx
"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserRole } from "@/types/v1.user.types";
import AdminNavigation from "@/components/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/new-auth/login");
      return;
    }

    if (user) {
      const adminRoles: UserRole[] = [
        UserRole.SUPER_ADMIN,
        UserRole.TENANT_ADMIN,
        UserRole.LIVE_ADMIN,
      ];

      const isAdmin = adminRoles.includes(user.role);
      if (!isAdmin) {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Admin Navigation Sidebar */}
      <AdminNavigation />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Desktop Header */}
        {!isMobile && (
          <header className="bg-card border-b border-border px-8 py-4 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">📊</div>
                <div>
                  <h1 className="text-lg font-bold text-card-foreground">
                    Admin Dashboard
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Manage your sports platform
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-semibold border border-primary/20">
                  {user.name}
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Page Content with proper padding for mobile */}
        <main className={`flex-1 overflow-y-auto ${isMobile ? "pt-16" : ""}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
