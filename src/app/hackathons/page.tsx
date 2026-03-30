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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-text">해커톤</h1>

      <div className="mb-8">
        <HackathonFilter activeFilter={filter} onChange={setFilter} />
      </div>

      <HackathonGrid hackathons={filtered} />
    </div>
  );
}
