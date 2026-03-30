'use client';

import { useEffect, useState } from 'react';
import { RankingEntry } from '@/types/ranking';
import { getAllLeaderboards } from '@/lib/storage';
import { useStorageReady } from '@/components/layout/StorageInitializer';
import { computeRankings } from '@/lib/rankings';
import RankingTable from '@/components/rankings/RankingTable';

export default function RankingsPage() {
  const ready = useStorageReady();
  const [rankings, setRankings] = useState<RankingEntry[]>([]);

  useEffect(() => {
    if (!ready) return;
    const leaderboards = getAllLeaderboards();
    setRankings(computeRankings(leaderboards));
  }, [ready]);

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">랭킹</h1>
          <p className="text-sm text-text-secondary">
            모든 해커톤의 성적을 종합한 팀별 순위입니다.
          </p>
        </div>
        <RankingTable rankings={rankings} />
      </div>
    </div>
  );
}
