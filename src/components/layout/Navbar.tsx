'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/', label: '홈' },
  { href: '/hackathons', label: '해커톤' },
  { href: '/rankings', label: '랭킹' },
  { href: '/camp', label: '팀 모집' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          HackHub
        </Link>

        {/* Desktop */}
        <ul className="hidden gap-1 md:flex">
          {NAV_ITEMS.map(({ href, label }) => {
            const active =
              href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary-light text-primary'
                      : 'text-text-secondary hover:bg-surface-elevated'
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden rounded-lg p-2 hover:bg-surface-elevated"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="메뉴 열기"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <ul className="border-t border-border bg-surface px-4 pb-4 md:hidden">
          {NAV_ITEMS.map(({ href, label }) => {
            const active =
              href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-lg px-4 py-3 text-sm font-medium ${
                    active ? 'text-primary bg-primary-light' : 'text-text-secondary'
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </header>
  );
}
