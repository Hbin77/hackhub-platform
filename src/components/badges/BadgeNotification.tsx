'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/lib/badges';

interface BadgeNotificationProps {
  badge: Badge | null;
  onDismiss: () => void;
}

export default function BadgeNotification({ badge, onDismiss }: BadgeNotificationProps) {
  useEffect(() => {
    if (badge) {
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [badge, onDismiss]);

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          className="fixed top-4 right-4 z-[60] flex items-center gap-3 rounded-xl border border-border bg-bg-surface/80 backdrop-blur-md px-5 py-3 shadow-lg"
          style={{ borderLeft: '3px solid transparent', borderImage: 'linear-gradient(135deg, #6C5CE7, #00D2FF) 1' }}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <span className="text-3xl">{badge.icon}</span>
          <div>
            <p className="text-xs font-semibold text-accent">뱃지 획득!</p>
            <p className="text-sm font-bold text-text">{badge.name}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
