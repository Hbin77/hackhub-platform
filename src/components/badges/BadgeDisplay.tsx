'use client';

import { useBadges } from './BadgeProvider';

export default function BadgeDisplay() {
  const { badges } = useBadges();
  const earnedBadges = badges.filter((b) => b.earned);
  const lockedBadges = badges.filter((b) => !b.earned);

  return (
    <div className="space-y-4">
      {earnedBadges.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {earnedBadges.map((badge) => (
            <div
              key={badge.id}
              className="group relative flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-bg-elevated transition-colors hover:border-border-hover"
              title={`${badge.name} — ${badge.description}`}
            >
              <span className="text-2xl">{badge.icon}</span>
              <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-bg-overlay px-2.5 py-1 text-xs text-text opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                {badge.name} — {badge.description}
              </div>
            </div>
          ))}
        </div>
      )}
      {lockedBadges.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {lockedBadges.map((badge) => (
            <div
              key={badge.id}
              className="group relative flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-bg-elevated/50 opacity-40 transition-colors"
              title="???"
            >
              <svg className="h-5 w-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-bg-overlay px-2.5 py-1 text-xs text-text opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                ???
              </div>
            </div>
          ))}
        </div>
      )}
      {earnedBadges.length === 0 && (
        <p className="text-sm text-text-tertiary">아직 획득한 뱃지가 없습니다. 해커톤에 참여해 보세요!</p>
      )}
    </div>
  );
}
