'use client';

import { useMemo, useState } from 'react';
import { HackathonListItem } from '@/types/hackathon';
import { getHackathons } from '@/lib/storage';
import { useStorageReady } from '@/components/layout/StorageInitializer';
import HackathonFilter, { type FilterValue } from '@/components/hackathons/HackathonFilter';
import HackathonGrid from '@/components/hackathons/HackathonGrid';

interface HackathonsPageClientProps {
  serverHackathons: HackathonListItem[];
}

export default function HackathonsPageClient({ serverHackathons }: HackathonsPageClientProps) {
  const ready = useStorageReady();
  const [filter, setFilter] = useState<FilterValue>('all');
  const hackathons = useMemo(
    () => (ready ? getHackathons() : serverHackathons),
    [ready, serverHackathons],
  );

  const filtered =
    filter === 'all'
      ? hackathons
      : hackathons.filter(h => h.status === filter);

  return (
    <>
      <div className="mb-8">
        <HackathonFilter activeFilter={filter} onChange={setFilter} />
      </div>
      <HackathonGrid hackathons={filtered} />
    </>
  );
}
