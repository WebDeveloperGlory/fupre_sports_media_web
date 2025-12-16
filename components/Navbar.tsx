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
  Bell,
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

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActiveRoute = (path: string, parentPath?: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    // If a parentPath is specified, check if pathname starts with it
    if (parentPath) {
      return pathname.startsWith(parentPath);
    }
    return pathname.startsWith(path);
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/matches", label: "Matches", icon: Trophy },
    { href: "/highlights", label: "Highlights", icon: Trophy },
    { href: "/news", label: "News", icon: Newspaper },
  ];

  const mobileBottomNavLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/sports/competitions", label: "Scores", icon: Trophy, parentPath: "/sports" },
    { href: "/highlights", label: "Highlights", icon: Play },
    { href: "/news", label: "News", icon: Newspaper },
  ];

  const getAdminLinks = () => {
    if (!user) return [];

    // Check if user has admin role (either locally or from Appwrite)
    // Adjust this check based on your actual user object structure
    const isAdmin = user.labels?.includes('admin') || user.email === 'admin@fupre.edu.ng'; // fallback for dev

    if (isAdmin) {
      return [
        { href: "/admin", label: "Admin", icon: LayoutDashboard },
      ];
    }
    return [];
  };

  const adminLinks = getAdminLinks();

  return (
    <>
      {/* Desktop Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none hidden md:flex">
        <nav
          className={cn(
            "pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
            "relative flex items-center rounded-full",
            "bg-background/70 backdrop-blur-2xl backdrop-saturate-150 border border-white/20 dark:border-white/10 shadow-lg shadow-black/5",
            scrolled
              ? "justify-center gap-1 px-3 py-2"
              : "justify-between w-full max-w-4xl px-4 py-3"
          )}
        >
          {/* Logo Section - Hidden when scrolled */}
          <div className={cn(
            "flex items-center z-10 transition-all duration-300",
            scrolled ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
          )}>
            <Link
              href="/"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 text-gold font-bold text-lg shrink-0 transition-transform hover:scale-105 border border-gold/10"
            >
              FSM
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className={cn(
            "flex items-center gap-1",
            !scrolled && "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          )}>
            {navLinks.map((link) => {
              const isActive = isActiveRoute(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors rounded-full z-10",
                    isActive
                      ? "text-gold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-pill"
                      className="absolute inset-0 bg-gold/10 dark:bg-gold/20 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
            {/* Admin Links */}
            {adminLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium transition-colors rounded-full z-10 text-rose-500 hover:bg-rose-500/10"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth & Theme Section - Hidden when scrolled */}
          <div className={cn(
            "flex items-center gap-2 z-10 transition-all duration-300",
            scrolled ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
          )}>
            <button
              onClick={toggleTheme}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gold/30"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" />
              <Moon className="h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute" />
            </button>

            <Link
              href={isLoggedIn ? "/profile" : "/auth/login"}
              className="p-1 rounded-full border border-border/50 bg-background/50 hover:bg-accent transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold to-yellow-300 flex items-center justify-center text-black font-medium text-xs">
                {isLoggedIn && user?.name ? user.name[0].toUpperCase() : <User size={14} />}
              </div>
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <nav className="rounded-2xl border border-white/20 bg-background/80 backdrop-blur-2xl backdrop-saturate-150 shadow-2xl shadow-black/10">
          <div className="grid grid-cols-5 h-16 items-center px-2">
            {mobileBottomNavLinks.map((link) => {
              const isActive = isActiveRoute(link.href, link.parentPath);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative flex flex-col items-center justify-center space-y-1 h-full w-full rounded-xl transition-all duration-200",
                    isActive ? "text-gold" : "text-muted-foreground hover:text-foreground active:scale-95"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobile-navbar-pill"
                      className="absolute inset-1 bg-gold/10 dark:bg-gold/20 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <link.icon className={cn("w-5 h-5", isActive && "fill-current")} />
                </Link>
              )
            })}
            <button
              onClick={() => setOpenMobileMenu(true)}
              className="flex flex-col items-center justify-center space-y-1 h-full w-full rounded-xl text-muted-foreground hover:text-foreground active:scale-95 transition-all"
            >
              <Menu className="w-5 h-5" />
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
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-3xl md:hidden flex flex-col"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/10">
              <span className="text-xl font-bold tracking-tight">Menu</span>
              <button
                onClick={() => setOpenMobileMenu(false)}
                className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search news, teams..."
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/30 border border-border/10 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-all placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Navigation</h3>
                <div className="grid gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setOpenMobileMenu(false)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-card/30 hover:bg-card hover:border-gold/20 transition-all",
                        isActiveRoute(link.href) && "border-gold/20 bg-gold/5"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("p-2 rounded-lg bg-background", isActiveRoute(link.href) ? "text-gold" : "text-muted-foreground")}>
                          <link.icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium">{link.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                    </Link>
                  ))}
                  {adminLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setOpenMobileMenu(false)}
                      className="flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-background text-red-500">
                          <link.icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-red-600 dark:text-red-400">{link.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-red-500/50" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Auth Actions */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Account</h3>
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      onClick={() => setOpenMobileMenu(false)}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gold to-yellow-300 flex items-center justify-center text-black font-bold">
                        {user?.name?.[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </Link>
                    <button className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-red-500/20 text-red-500 font-medium hover:bg-red-500/5 transition-colors">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      href="/auth/login"
                      onClick={() => setOpenMobileMenu(false)}
                      className="flex items-center justify-center p-4 rounded-xl border border-border/50 font-medium hover:bg-muted transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setOpenMobileMenu(false)}
                      className="flex items-center justify-center p-4 rounded-xl bg-gold text-black font-bold hover:bg-gold/90 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* Theme Toggle in Menu */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20">
                <span className="font-medium">Appearance</span>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border/50 text-sm font-medium"
                >
                  {theme === 'dark' ? (
                    <>
                      <Moon className="w-4 h-4" /> Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4" /> Light Mode
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