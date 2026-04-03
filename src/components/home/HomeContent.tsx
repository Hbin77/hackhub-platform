'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { HackathonListItem } from '@/types/hackathon';
import { getHackathons } from '@/lib/storage';
import { useStorageReady } from '@/components/layout/StorageInitializer';
import HackathonCard from '@/components/common/HackathonCard';
import EmptyState from '@/components/common/EmptyState';
import RecommendButton from '@/components/recommend/RecommendButton';

interface HomeContentProps {
  serverHackathons: HackathonListItem[];
}

export default function HomeContent({ serverHackathons }: HomeContentProps) {
  const ready = useStorageReady();
  const hackathons = useMemo(
    () => (ready ? getHackathons() : serverHackathons),
    [ready, serverHackathons],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-text">진행중인 해커톤</h2>
        <Link
          href="/hackathons"
          className="text-sm font-medium text-primary hover:text-accent transition-colors"
        >
          전체보기 &rarr;
        </Link>
      </div>

      {hackathons.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hackathons.slice(0, 6).map(hackathon => (
            <HackathonCard key={hackathon.slug} hackathon={hackathon} />
          ))}
        </div>
      ) : (
        <EmptyState message="등록된 해커톤이 없습니다." />
      )}

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link
          href="/rankings"
          className="glass glass-hover flex items-center gap-4 rounded-xl p-6 transition-all duration-300"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15">
            <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-display font-semibold text-text">랭킹</h3>
            <p className="text-sm text-text-secondary">팀별 종합 순위를 확인하세요</p>
          </div>
        </Link>

        <Link
          href="/camp"
          className="glass glass-hover flex items-center gap-4 rounded-xl p-6 transition-all duration-300"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15">
            <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-display font-semibold text-text">팀 모집</h3>
            <p className="text-sm text-text-secondary">함께할 팀원을 찾아보세요</p>
          </div>
        </Link>
      </div>
      <RecommendButton />
    </div>
  );
}
