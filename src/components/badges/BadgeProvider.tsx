'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Badge, getBadges, checkAndEarnBadges } from '@/lib/badges';
import BadgeNotification from './BadgeNotification';

interface BadgeContextValue {
  badges: Badge[];
  refresh: () => void;
}

const BadgeContext = createContext<BadgeContextValue>({
  badges: [],
  refresh: () => {},
});

export function useBadges() {
  return useContext(BadgeContext);
}

export default function BadgeProvider({ children }: { children: ReactNode }) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [notification, setNotification] = useState<Badge | null>(null);
  const [notificationQueue, setNotificationQueue] = useState<Badge[]>([]);

  const refresh = useCallback(() => {
    const prevEarned = new Set(badges.filter((b) => b.earned).map((b) => b.id));
    const updated = checkAndEarnBadges();
    setBadges(updated);

    const newlyEarned = updated.filter((b) => b.earned && !prevEarned.has(b.id));
    if (newlyEarned.length > 0) {
      setNotificationQueue((prev) => [...prev, ...newlyEarned]);
    }
  }, [badges]);

  // Show notifications one at a time
  useEffect(() => {
    if (!notification && notificationQueue.length > 0) {
      setNotification(notificationQueue[0]);
      setNotificationQueue((prev) => prev.slice(1));
    }
  }, [notification, notificationQueue]);

  // Initial check
  useEffect(() => {
    const initial = checkAndEarnBadges();
    setBadges(initial);

    // Track page visits for explorer badge
    try {
      const visited = JSON.parse(localStorage.getItem('hp_visited_pages') || '[]');
      const path = window.location.pathname;
      if (!visited.includes(path)) {
        visited.push(path);
        localStorage.setItem('hp_visited_pages', JSON.stringify(visited));
      }
    } catch { /* ignore */ }

    // Listen for storage changes
    const handleStorage = () => {
      const updated = checkAndEarnBadges();
      const prevEarned = new Set(initial.map((b) => (b.earned ? b.id : null)).filter(Boolean));
      const newlyEarned = updated.filter((b) => b.earned && !prevEarned.has(b.id));
      setBadges(updated);
      if (newlyEarned.length > 0) {
        setNotificationQueue((prev) => [...prev, ...newlyEarned]);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleDismiss = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <BadgeContext.Provider value={{ badges, refresh }}>
      {children}
      <BadgeNotification badge={notification} onDismiss={handleDismiss} />
    </BadgeContext.Provider>
  );
}
