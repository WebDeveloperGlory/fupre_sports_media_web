// components/AdminNavbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Users,
  Trophy,
  Calendar,
  Bell,
  Award,
  BookOpen,
  Settings,
  BarChart3,
  Menu,
  X,
  ChevronDown,
  Shield,
  Activity,
  FileText,
  Image,
  Video,
  Layout,
  LogOut,
  Zap,
  Users2,
  Home,
  LucideIcon,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";
import { UserRole, UserPermissions, SportType } from "@/types/v1.user.types";

// Types
interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

interface NavSection {
  label: string;
  icon: string;
  items: NavItem[];
}

interface SportConfig {
  label: string;
  icon: string;
  color: string;
}

// Sport configuration
const sportConfig: Record<string, SportConfig> = {
  football: { label: "Football", icon: "⚽", color: "text-emerald-500" },
  basketball: { label: "Basketball", icon: "🏀", color: "text-amber-500" },
  volleyball: { label: "Volleyball", icon: "🏐", color: "text-pink-500" },
  all: { label: "All Sports", icon: "🏆", color: "text-blue-500" },
};

// Navigation configuration based on permissions
const getNavigationBySport = (
  sport: string,
  permissions: UserPermissions[],
  role: UserRole,
): Record<string, NavSection> => {
  const isSuperAdmin = role === UserRole.SUPER_ADMIN;

  const sections: Record<string, NavSection> = {
    general: {
      label: "General",
      icon: "🏛️",
      items: [],
    },
    management: {
      label: "Management",
      icon: "⚙️",
      items: [],
    },
    media: {
      label: "Media",
      icon: "📸",
      items: [],
    },
    live: {
      label: "Live",
      icon: "⚡",
      items: [],
    },
  };

  // Super admin general items
  if (isSuperAdmin) {
    sections.general.items.push(
      {
        href: "/admin/super/general/users",
        label: "Users",
        icon: Users,
        description: "Manage all users",
      },
      {
        href: "/admin/super/general/notifications",
        label: "Notifications",
        icon: Bell,
        description: "System notifications",
      },
      {
        href: "/admin/super/general/settings",
        label: "Settings",
        icon: Settings,
        description: "App settings",
      },
    );
  }

  // Management items based on permissions
  if (permissions.includes(UserPermissions.LEAGUE_MANAGEMENT) || isSuperAdmin) {
    sections.management.items.push(
      {
        href: `/admin/super/${sport}/competitions`,
        label: "Competitions",
        icon: Trophy,
        description: "Manage competitions",
      },
      {
        href: `/admin/super/${sport}/standings`,
        label: "Standings",
        icon: BarChart3,
        description: "League tables",
      },
    );
  }

  if (permissions.includes(UserPermissions.TEAM_MANAGEMENT) || isSuperAdmin) {
    sections.management.items.push({
      href: `/admin/super/${sport}/teams`,
      label: "Teams",
      icon: Users2,
      description: "Team management",
    });
  }

  if (permissions.includes(UserPermissions.PLAYER_MANAGEMENT) || isSuperAdmin) {
    sections.management.items.push({
      href: `/admin/super/${sport}/players`,
      label: "Players",
      icon: Users,
      description: "Manage players",
    });
  }

  if (
    permissions.includes(UserPermissions.FIXTURE_MANAGEMENT) ||
    isSuperAdmin
  ) {
    sections.management.items.push(
      {
        href: `/admin/super/${sport}/fixtures`,
        label: "Fixtures",
        icon: Calendar,
        description: "Match schedules",
      },
      {
        href: `/admin/super/${sport}/team-of-season`,
        label: "Team of Season",
        icon: Award,
        description: "Awards & honors",
      },
    );
  }

  // Media items
  if (permissions.includes(UserPermissions.MEDIA_PUBLICATION) || isSuperAdmin) {
    sections.media.items.push(
      {
        href: `/admin/super/${sport}/gallery`,
        label: "Gallery",
        icon: Image,
        description: "Photo management",
      },
      {
        href: `/admin/super/${sport}/videos`,
        label: "Videos",
        icon: Video,
        description: "Video content",
      },
      {
        href: `/admin/super/${sport}/articles`,
        label: "Articles",
        icon: FileText,
        description: "Write articles",
      },
      {
        href: `/admin/super/${sport}/blog`,
        label: "Blog",
        icon: BookOpen,
        description: "Blog posts",
      },
    );
  }

  // Live items
  if (permissions.includes(UserPermissions.LIVE_MANAGEMENT) || isSuperAdmin) {
    sections.live.items.push(
      {
        href: `/admin/live/${sport}/formation`,
        label: "Formation & Lineups",
        icon: Layout,
        description: "Set formations",
      },
      {
        href: `/admin/live/${sport}/live-games`,
        label: "Live Games",
        icon: Zap,
        description: "Manage live matches",
      },
      {
        href: `/admin/live/${sport}/match-events`,
        label: "Match Events",
        icon: Activity,
        description: "Log events",
      },
    );
  }

  // Filter out empty sections
  return Object.entries(sections).reduce<Record<string, NavSection>>(
    (acc, [key, section]) => {
      if (section.items.length > 0) {
        acc[key] = section;
      }
      return acc;
    },
    {},
  );
};

export default function AdminNavigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [currentSport, setCurrentSport] = useState<string>("football");
  const [sportDropdownOpen, setSportDropdownOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!user) {
    return null;
  }

  const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;
  const userSport = user.sport || SportType.FOOTBALL;

  // Get available sports
  const getAvailableSports = (): string[] => {
    if (userSport === SportType.ALL || isSuperAdmin) {
      return ["football", "basketball", "volleyball"];
    }
    return [userSport];
  };

  const availableSports = getAvailableSports();
  const sections = getNavigationBySport(
    currentSport,
    user.permissions || [],
    user.role,
  );

  // Handle navigation
  const handleNavigation = (href: string) => {
    router.push(href);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Handle sport change
  const handleSportChange = (sport: string) => {
    setCurrentSport(sport);
    setSportDropdownOpen(false);
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Get role badge
  const getRoleBadge = (): string => {
    const roleLabels: Record<UserRole, string> = {
      [UserRole.USER]: "User",
      [UserRole.SUPER_ADMIN]: "Super Admin",
      [UserRole.TENANT_ADMIN]: "Tenant Admin",
      [UserRole.LIVE_ADMIN]: "Live Admin",
    };
    return roleLabels[user.role] || "Admin";
  };

  // Check if a link is active
  const isActive = (href: string): boolean => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar - FIXED on desktop, FIXED with full height on mobile */}
      <aside
        className={cn(
          "w-72 bg-card border-r border-border z-50 flex flex-col transition-transform duration-300",
          // Mobile: fixed position, full height, slide in/out
          "fixed inset-y-0 left-0 h-screen",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: fixed position, always visible
          "lg:translate-x-0 lg:fixed lg:h-screen"
        )}
      >
        {/* Fixed Header Area */}
        <div className="flex-shrink-0 bg-card">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-primary-foreground font-bold text-base">
                  FS
                </span>
              </div>
              <div>
                <div className="text-card-foreground font-bold text-base">
                  FUPRE Sports
                </div>
                <div className="text-muted-foreground text-xs mt-0.5">
                  {getRoleBadge()}
                </div>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Sport Selector */}
          {availableSports.length > 1 && (
            <div className="p-4 border-b border-border">
              <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-3">
                Sport
              </div>
              <div className="relative">
                <button
                  onClick={() => setSportDropdownOpen(!sportDropdownOpen)}
                  className="w-full px-3 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-input rounded-lg text-sm font-medium transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span>{sportConfig[currentSport]?.icon}</span>
                    <span>{sportConfig[currentSport]?.label}</span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${sportDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {sportDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-input rounded-lg overflow-hidden z-50 shadow-xl">
                    {availableSports.map((sport) => (
                      <button
                        key={sport}
                        onClick={() => handleSportChange(sport)}
                        className={cn(
                          "w-full px-3 py-2.5 text-sm transition-colors flex items-center gap-2 text-left",
                          currentSport === sport
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-card-foreground hover:bg-secondary",
                        )}
                      >
                        <span>{sportConfig[sport]?.icon}</span>
                        <span>{sportConfig[sport]?.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <nav className="p-4">
            {/* Back to Home */}
            <button
              onClick={() => router.push("/")}
              className="w-full px-3.5 py-3 mb-4 rounded-lg text-sm font-medium transition-all flex items-center gap-3 text-card-foreground hover:bg-secondary border border-input"
            >
              <Home size={18} />
              <span>Back to Home</span>
            </button>

            {Object.entries(sections).map(([key, section], i) => (
              <div key={key} className={`${i !== 0 ? "mt-6" : ""}`}>
                {/* Section Header */}
                <div className="flex items-center gap-2 px-2 mb-3">
                  <span className="text-lg">{section.icon}</span>
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {section.label}
                  </h3>
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <button
                        key={item.href}
                        onClick={() => handleNavigation(item.href)}
                        className={cn(
                          "w-full px-3.5 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 text-left",
                          active
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                            : "text-card-foreground hover:bg-secondary",
                        )}
                      >
                        <Icon size={18} className="flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div>{item.label}</div>
                          {item.description && (
                            <div
                              className={cn(
                                "text-xs mt-0.5",
                                active
                                  ? "text-primary-foreground/80"
                                  : "text-muted-foreground",
                              )}
                            >
                              {item.description}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 p-4 border-t border-border bg-card">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 mb-3 border border-destructive/20"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Admin Panel v2.0</span>
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-semibold border border-emerald-500/30">
              {user.status?.toUpperCase() || "ACTIVE"}
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      {isMobile && (
        <header className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border px-6 py-4 z-40 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 bg-secondary hover:bg-secondary/80 border border-input rounded-lg transition-colors"
            >
              <Menu size={20} className="text-secondary-foreground" />
            </button>

            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {sportConfig[currentSport]?.icon}
              </span>
              <div>
                <h1 className="text-lg font-bold text-card-foreground">
                  {sportConfig[currentSport]?.label} Admin
                </h1>
                <p className="text-xs text-muted-foreground">
                  {user.name} • {user.permissions?.length || 0} permissions
                </p>
              </div>
            </div>
          </div>
        </header>
      )}
    </>
  );
}