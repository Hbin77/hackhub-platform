'use client';

import { useEffect, useState } from 'react';
import { HackathonListItem } from '@/types/hackathon';
import { getHackathons } from '@/lib/storage';
import { useStorageReady } from '@/components/layout/StorageInitializer';
import HackathonFilter, { type FilterValue } from '@/components/hackathons/HackathonFilter';
import HackathonGrid from '@/components/hackathons/HackathonGrid';

export default function HackathonsPage() {
  const ready = useStorageReady();
  const [hackathons, setHackathons] = useState<HackathonListItem[]>([]);
  const [filter, setFilter] = useState<FilterValue>('all');

  useEffect(() => {
    if (ready) setHackathons(getHackathons());
  }, [ready]);

  const filtered =
    filter === 'all'
      ? hackathons
      : hackathons.filter(h => h.status === filter);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-text mb-2">해커톤</h1>
        <p className="text-text-secondary">최신 해커톤을 확인하고 참가해보세요</p>
      </div>

      <div className="mb-8">
        <HackathonFilter activeFilter={filter} onChange={setFilter} />
      </div>

      <HackathonGrid hackathons={filtered} />
    </div>
  );
}
