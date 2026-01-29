'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';

interface HeaderProps {
  showAuth?: boolean;
}

export default function Header({ showAuth = false }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/mentor/projects', label: 'Projects' },
    { href: '/team', label: 'Team' },
    { href: '/settings', label: 'Settings' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-xl font-bold text-white">Vanguard</span>
          </Link>

          {/* Desktop Navigation */}
          {showAuth && (
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-4">
            {showAuth ? (
              <>
                {/* Profile Dropdown */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[#1a1a1a] border border-gray-800 shadow-xl overflow-hidden">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors duration-200"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">Profile</span>
                      </Link>
                      <button
                        onClick={() => {/* Add sign out logic */}}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="hidden md:block px-6 py-2 rounded-lg bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-medium hover:shadow-lg hover:shadow-[#10b981]/50 transition-all duration-300"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-[#0a0a0a]">
          <nav className="px-4 py-4 space-y-3">
            {showAuth ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-gray-800 pt-3 mt-3">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {/* Add sign out logic */}}
                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="block px-4 py-2 text-center rounded-lg bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
