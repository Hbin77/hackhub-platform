'use client';

import { useMemo } from 'react';
import { Leaderboard } from '@/types/leaderboard';
import { getAllLeaderboards } from '@/lib/storage';
import { useStorageReady } from '@/components/layout/StorageInitializer';
import { computeRankings } from '@/lib/rankings';
import RankingTable from '@/components/rankings/RankingTable';

interface RankingsContentProps {
  serverLeaderboards: Leaderboard[];
}

export default function RankingsContent({ serverLeaderboards }: RankingsContentProps) {
  const ready = useStorageReady();
  const rankings = useMemo(
    () => computeRankings(ready ? getAllLeaderboards() : serverLeaderboards),
    [ready, serverLeaderboards],
  );

  return <RankingTable rankings={rankings} />;
}
