"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/providers/theme-provider";
import {
  Home,
  Trophy,
  Newspaper,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Sun,
  Moon,
  Search,
  ChevronRight,
  Play,
} from "lucide-react";
import { useAuthStore } from "@/stores/v2/authStore";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const { user, isLoggedIn } = useAuthStore();
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActiveRoute = (path: string, parentPaths?: string[]) => {
    if (path === "/") {
      return pathname === "/";
    }
    if (parentPaths && parentPaths.length > 0) {
      return parentPaths.some(p => pathname.startsWith(p));
    }
    return pathname.startsWith(path);
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/matches", label: "Matches", icon: Trophy },
    { href: "/highlights", label: "Highlights", icon: Play },
    { href: "/news", label: "News", icon: Newspaper },
  ];

  const mobileBottomNavLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/sports/competitions", label: "Scores", icon: Trophy, parentPaths: ["/sports", "/live"] },
    { href: "/highlights", label: "Highlights", icon: Play },
    { href: "/news", label: "News", icon: Newspaper },
  ];

  const getAdminLinks = () => {
    if (!user) return [];
    const adminRoles = ['super-admin', 'media-admin', 'head-media-admin', 'competition-admin', 'team-admin', 'live-fixture-admin'];
    const isAdmin = adminRoles.includes(user.role) || user.email === 'admin@fupre.edu.ng';
    if (isAdmin) {
      return [{ href: "/admin", label: "Admin", icon: LayoutDashboard }];
    }
    return [];
  };

  const adminLinks = getAdminLinks();

  return (
    <>
      {/* Desktop Navbar - Floating Rounded */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none hidden md:flex">
        <nav
          className={cn(
            "pointer-events-auto transition-all duration-300",
            "flex items-center justify-between rounded-full",
            "bg-background border border-border shadow-sm",
            "px-2 py-2",
            scrolled ? "w-auto" : "w-full max-w-3xl"
          )}
        >
          {/* Logo - Visible when not scrolled */}
          <div className={cn(
            "flex items-center transition-all duration-300 overflow-hidden",
            scrolled ? "w-0 opacity-0 pl-0" : "w-auto opacity-100 pl-4"
          )}>
            <Link href="/" className="text-lg font-bold tracking-tight whitespace-nowrap">
              <span className="text-emerald-600 dark:text-emerald-400">FUPRE</span>
              <span className="text-foreground ml-1">Sports</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = isActiveRoute(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-full transition-colors",
                    isActive
                      ? "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            {adminLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium rounded-full text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section - Visible when not scrolled */}
          <div className={cn(
            "flex items-center gap-2 transition-all duration-300 overflow-hidden",
            scrolled ? "w-0 opacity-0 pr-0" : "w-auto opacity-100 pr-2"
          )}>
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link
              href={isLoggedIn ? "/profile" : "/auth/login"}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-secondary transition-colors"
            >
              {isLoggedIn && user?.name ? (
                <span className="text-sm font-medium">{user.name[0].toUpperCase()}</span>
              ) : (
                <User className="h-4 w-4 text-muted-foreground" />
              )}
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Bottom Navigation - Anchored */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <nav className="bg-background border-t border-border">
          <div className="flex items-center justify-around h-14 px-2">
            {mobileBottomNavLinks.map((link) => {
              const isActive = isActiveRoute(link.href, link.parentPaths);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 flex-1 h-full rounded-xl transition-colors",
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground"
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{link.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => setOpenMobileMenu(true)}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full rounded-xl text-muted-foreground"
            >
              <Menu className="w-5 h-5" />
              <span className="text-[10px] font-medium">More</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {openMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-background md:hidden flex flex-col"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="text-lg font-bold">Menu</span>
              <button
                onClick={() => setOpenMobileMenu(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-secondary border-0 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">Navigation</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpenMobileMenu(false)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl transition-colors",
                      isActiveRoute(link.href)
                        ? "bg-secondary text-foreground"
                        : "hover:bg-secondary"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ))}
                {adminLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpenMobileMenu(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-rose-500/10 text-rose-500"
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ))}
              </div>

              {/* Account Section */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">Account</p>
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setOpenMobileMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                        {user?.name?.[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </Link>
                    <button className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-rose-500 hover:bg-rose-500/10 transition-colors">
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/auth/login"
                      onClick={() => setOpenMobileMenu(false)}
                      className="flex items-center justify-center py-3 rounded-xl border border-border font-medium hover:bg-secondary transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setOpenMobileMenu(false)}
                      className="flex items-center justify-center py-3 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-secondary">
                <span className="font-medium">Theme</span>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border text-sm font-medium"
                >
                  {theme === 'dark' ? (
                    <>
                      <Moon className="w-4 h-4" /> Dark
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4" /> Light
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;