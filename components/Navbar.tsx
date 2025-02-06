// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from '@/providers/theme-provider';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/football', label: 'Football' },
    { href: '/news', label: 'News' },
    { href: '/highlights', label: 'Highlights' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
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
          <div className="hidden md:flex items-center justify-center space-x-8">
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-navbar-muted hover:text-navbar-foreground transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-navbar-muted/10">
            <div className="py-3 px-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block py-2 text-base font-medium text-navbar-muted hover:text-navbar-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;