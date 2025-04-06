// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '@/providers/theme-provider';
import { motion } from 'framer-motion';
import { Home, Trophy, Newspaper, Play, Menu, X, LayoutDashboard, Award } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import useAuthStore from '@/stores/authStore';
import { User } from 'lucide-react';

const menuVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: "0%", opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
  exit: { x: "100%", opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } },
}

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const { jwt, userProfile } = useAuthStore();
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

  const isActiveRoute = (path: string) => {
    if (path === '/') return pathname === '/home';
    if (path === '/football') {
      return pathname === '/football' ||
        pathname.startsWith('/competitions') ||
        pathname.startsWith('/fixtures') ||
        pathname.startsWith('/live') ||
        pathname.startsWith('/football/tots');
    }
    if (path === '/football/tots') {
      return pathname.startsWith('/football/tots');
    }
    if (path === '/news') {
      return pathname === '/news' || pathname.startsWith('/news/');
    }
    return pathname === path;
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/football', label: 'Football', icon: Trophy },
    { href: '/football/tots', label: 'TOTS', icon: Award },
    { href: '/news', label: 'News', icon: Newspaper },
    { href: '/highlights', label: 'Highlights', icon: Play },
  ];

  // Mobile bottom navigation links (excluding TOTS)
  const mobileBottomNavLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/football', label: 'Football', icon: Trophy },
    { href: '/news', label: 'News', icon: Newspaper },
    { href: '/highlights', label: 'Highlights', icon: Play },
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }
  ]

  // Add these inside the desktop navbar's right section
  return (
    <>
      {/* Desktop Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 md:block hidden">
        <nav className="mx-auto max-w-2xl rounded-full bg-navbar">
          <div className="relative h-12 flex items-center justify-between px-4">
          {/* Logo */}
            <Link
              href="/"
              className={cn(
                "text-lg font-semibold transition-colors",
                isActiveRoute('/')
                  ? "text-emerald-500"
                  : "text-navbar-foreground hover:text-navbar-foreground/80"
              )}
            >
              FSM
            </Link>

          {/* Desktop Navigation */}
            <div className="flex items-center justify-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                  className={cn(
                    "text-[15px] font-medium transition-colors",
                    isActiveRoute(link.href)
                      ? "text-emerald-500"
                      : "text-navbar-muted hover:text-navbar-foreground"
                  )}
              >
                {link.label}
              </Link>
            ))}
            {
              jwt && userProfile && userProfile.role !== 'user' && adminLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                    className={cn(
                      "text-[15px] font-medium transition-colors",
                      isActiveRoute(link.href)
                        ? "text-emerald-500"
                        : "text-navbar-muted hover:text-navbar-foreground"
                    )}
                >
                  {link.label}
                </Link>
              ))
            }
          </div>

            {/* Modified auth section */}
            <div className="flex items-center gap-4">
              <Link
                href={jwt ? "/profile" : "/auth/login"}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-navbar-muted hover:text-navbar-foreground transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-navbar border-t border-navbar-muted/10">
        <nav className="h-16">
          <div className="grid grid-cols-5 h-full">
            {mobileBottomNavLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "flex flex-col items-center justify-center space-y-1 transition-colors",
                    isActiveRoute(link.href)
                      ? "text-emerald-500"
                      : "text-navbar-muted hover:text-navbar-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{link.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => setOpenMobileMenu(true)}
              className="flex flex-col items-center justify-center space-y-1 text-navbar-muted hover:text-navbar-foreground transition-colors"
            >
              <Menu className="w-5 h-5" />
              <span className="text-xs font-medium">Menu</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Display */}
      {openMobileMenu && (
        <motion.div
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-navbar text-navbar-foreground z-50 lg:hidden"
        >
          <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-border p-5">
              {/* Logo */}
              <Link
                href="/"
                className={cn(
                  "text-lg font-semibold transition-colors",
                  isActiveRoute('/')
                    ? "text-emerald-500"
                    : "text-navbar-foreground hover:text-navbar-foreground/80"
                )}
              >
                FSM
              </Link>
              <div className="flex items-center gap-4">
                {/* Profile Link */}
                <Link
                  href={jwt ? "/profile" : "/auth/login"}
                  onClick={() => setOpenMobileMenu(false)}
                  className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-all"
                >
                  <User className="w-5 h-5" />
                </Link>

                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-all"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </button>

                {/* Close Menu Button */}
                <X
                  onClick={() => setOpenMobileMenu(false)}
                  className="w-6 h-6 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Main Navigation
              </h3>
              <div className="space-y-2 mt-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpenMobileMenu(false)}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 rounded-lg transition-all",
                          isActiveRoute(link.href)
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <Icon className={cn(
                          "w-5 h-5",
                          isActiveRoute(link.href)
                            ? "text-emerald-500"
                            : "text-muted-foreground"
                        )} />
                        <h3 className="font-medium">{link.label}</h3>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* TOTS Promotional Banner */}
              <div className="mt-6 mb-4">
                <Link
                  href="/football/tots"
                  onClick={() => setOpenMobileMenu(false)}
                >
                  <motion.div
                    className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-800 p-4 shadow-lg"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/20 blur-xl"></div>
                    <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-emerald-500/20 blur-xl"></div>

                    <div className="relative flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Team of the Season</h3>
                        <p className="text-xs text-emerald-100">Vote for the best players now!</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </div>

              {
                jwt && userProfile && userProfile.role !== 'user' && (
                  <>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-4">
                      Admin Navigation
                    </h3>
                    <div className="space-y-2 mt-2">
                      {
                        adminLinks.map((link) => {
                          const Icon = link.icon;
                          return (
                            <motion.div
                              key={link.label}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Link
                                href={link.href}
                                onClick={() => setOpenMobileMenu(false)}
                                className={cn(
                                  "flex items-center gap-4 px-4 py-3 rounded-lg transition-all",
                                  isActiveRoute(link.href)
                                    ? "bg-emerald-500/10 text-emerald-500"
                                    : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                              >
                                <Icon className={cn(
                                  "w-5 h-5",
                                  isActiveRoute(link.href)
                                    ? "text-emerald-500"
                                    : "text-muted-foreground"
                                )} />
                                <h3 className="font-medium">{link.label}</h3>
                              </Link>
                            </motion.div>
                          );
                        })
                      }
                    </div>
                  </>
                )
              }
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Navbar;