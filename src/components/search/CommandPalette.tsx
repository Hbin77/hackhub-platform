'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { getHackathons, getTeams } from '@/lib/storage';

interface SearchResult {
  id: string;
  category: '페이지' | '해커톤' | '팀';
  title: string;
  subtitle?: string;
  href: string;
}

const PAGES: SearchResult[] = [
  { id: 'page-home', category: '페이지', title: '홈', href: '/' },
  { id: 'page-hackathons', category: '페이지', title: '해커톤', href: '/hackathons' },
  { id: 'page-rankings', category: '페이지', title: '랭킹', href: '/rankings' },
  { id: 'page-camp', category: '페이지', title: '팀 모집', href: '/camp' },
  { id: 'page-dashboard', category: '페이지', title: '대시보드', href: '/dashboard' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Keyboard shortcut to open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [cachedData, setCachedData] = useState<{ hackathons: ReturnType<typeof getHackathons>; teams: ReturnType<typeof getTeams> } | null>(null);

  // Focus input and cache data on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setCachedData({
        hackathons: getHackathons(),
        teams: getTeams(),
      });
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setCachedData(null);
    }
  }, [open]);

  const results = useMemo((): SearchResult[] => {
    const q = query.toLowerCase().trim();
    if (!q) return PAGES;

    const items: SearchResult[] = [];

    // Pages
    PAGES.forEach((page) => {
      if (page.title.toLowerCase().includes(q)) {
        items.push(page);
      }
    });

    // Hackathons
    const hackathons = cachedData?.hackathons ?? [];
    hackathons.forEach((h) => {
      const matchTitle = h.title.toLowerCase().includes(q);
      const matchTags = h.tags.some((t) => t.toLowerCase().includes(q));
      const matchStatus = h.status.toLowerCase().includes(q);
      if (matchTitle || matchTags || matchStatus) {
        items.push({
          id: `hackathon-${h.slug}`,
          category: '해커톤',
          title: h.title,
          subtitle: `${h.status} · ${h.tags.join(', ')}`,
          href: `/hackathons/${h.slug}`,
        });
      }
    });

    // Teams
    const teams = cachedData?.teams ?? [];
    teams.forEach((t) => {
      const matchName = t.name.toLowerCase().includes(q);
      const matchSlug = t.hackathonSlug.toLowerCase().includes(q);
      if (matchName || matchSlug) {
        items.push({
          id: `team-${t.teamCode}`,
          category: '팀',
          title: t.name,
          subtitle: t.hackathonSlug,
          href: `/camp?hackathon=${t.hackathonSlug}`,
        });
      }
    });

    return items;
  }, [query, cachedData]);

  // Group results by category
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  const flatResults = results;

  const navigate = useCallback((href: string) => {
    setOpen(false);
    router.push(href);
  }, [router]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % flatResults.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + flatResults.length) % flatResults.length);
      } else if (e.key === 'Enter' && flatResults[selectedIndex]) {
        e.preventDefault();
        navigate(flatResults[selectedIndex].href);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, selectedIndex, flatResults, navigate]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector('[data-selected="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  // Reset selection on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="bg-bg-surface border border-border rounded-2xl max-w-xl mx-auto mt-[20vh] overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-border px-4">
              <svg
                className="h-5 w-5 text-text-tertiary shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="페이지, 해커톤, 팀 검색..."
                className="flex-1 bg-transparent border-none text-text placeholder-text-tertiary text-lg p-4 outline-none"
              />
              <kbd className="hidden sm:inline-flex text-text-tertiary bg-bg-elevated rounded px-1.5 py-0.5 text-xs font-mono">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
              {flatResults.length === 0 ? (
                <div className="px-4 py-8 text-center text-text-tertiary text-sm">
                  검색 결과가 없습니다
                </div>
              ) : (
                Object.entries(grouped).map(([category, items]) => {
                  return (
                    <div key={category} className="mb-2">
                      <div className="px-3 py-2 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                        {category}
                      </div>
                      {items.map((item) => {
                        const idx = flatResults.indexOf(item);
                        const isSelected = idx === selectedIndex;
                        return (
                          <button
                            key={item.id}
                            data-selected={isSelected}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                              isSelected
                                ? 'bg-primary/10 border-l-2 border-primary'
                                : 'hover:bg-bg-elevated border-l-2 border-transparent'
                            }`}
                            onClick={() => navigate(item.href)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-text truncate">
                                {item.title}
                              </div>
                              {item.subtitle && (
                                <div className="text-xs text-text-tertiary truncate mt-0.5">
                                  {item.subtitle}
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <kbd className="text-text-tertiary bg-bg-elevated rounded px-1.5 py-0.5 text-xs font-mono shrink-0">
                                Enter
                              </kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 border-t border-border px-4 py-2.5 text-xs text-text-tertiary">
              <span className="flex items-center gap-1">
                <kbd className="bg-bg-elevated rounded px-1 py-0.5 font-mono">↑↓</kbd>
                이동
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-bg-elevated rounded px-1 py-0.5 font-mono">Enter</kbd>
                선택
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-bg-elevated rounded px-1 py-0.5 font-mono">ESC</kbd>
                닫기
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
