'use client';

import { useEffect, useState } from 'react';

export default function SearchTrigger() {
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes('mac'));
  }, []);

  function handleClick() {
    // Dispatch the same keyboard shortcut that CommandPalette listens for
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true }),
    );
  }

  return (
    <button
      onClick={handleClick}
      className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-bg-elevated/50 px-3 py-1.5 text-sm text-text-secondary hover:text-text hover:border-border-hover transition-colors"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <span>검색</span>
      <kbd className="text-text-tertiary bg-bg-elevated rounded px-1.5 py-0.5 text-xs font-mono">
        {isMac ? '⌘' : 'Ctrl+'}K
      </kbd>
    </button>
  );
}
