// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '@/providers/theme-provider';
import { motion } from 'framer-motion';
import { Home, Trophy, Newspaper, Play } from 'lucide-react';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/football', label: 'Football', icon: Trophy },
    { href: '/news', label: 'News', icon: Newspaper },
    { href: '/highlights', label: 'Highlights', icon: Play },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 md:block hidden">
        <nav className="mx-auto max-w-2xl rounded-full bg-navbar">
          <div className="relative h-12 flex items-center justify-between px-4">
            {/* Logo */}
            <Link 
              href="/" 
              className="text-lg font-semibold text-navbar-foreground"
            >
              FSM
            </Link>

            {/* Desktop Navigation */}
            <div className="flex items-center justify-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[15px] font-medium text-navbar-muted hover:text-navbar-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-navbar-muted hover:text-navbar-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        </nav>
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-navbar border-t border-navbar-muted/10">
        <nav className="h-16">
          <div className="grid grid-cols-4 h-full">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex flex-col items-center justify-center space-y-1 text-navbar-muted hover:text-navbar-foreground transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}

export default Navbar;