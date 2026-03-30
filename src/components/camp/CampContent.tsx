'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { HackathonListItem } from '@/types/hackathon';
import { Team } from '@/types/team';
import { getHackathons, getTeams } from '@/lib/storage';
import { useStorageReady } from '@/components/layout/StorageInitializer';
import CampFilter from '@/components/camp/CampFilter';
import TeamCard from '@/components/camp/TeamCard';
import TeamCreateModal from '@/components/camp/TeamCreateModal';
import EmptyState from '@/components/common/EmptyState';

export default function CampContent() {
  const ready = useStorageReady();
  const searchParams = useSearchParams();
  const [hackathons, setHackathons] = useState<HackathonListItem[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!ready) return;
    setHackathons(getHackathons());
    const initial = searchParams.get('hackathon') ?? '';
    setSelectedSlug(initial);
  }, [searchParams, ready]);

  useEffect(() => {
    if (ready) loadTeams();
  }, [selectedSlug, ready]);

  function loadTeams() {
    setTeams(getTeams(selectedSlug || undefined));
  }

  function handleCreated() {
    setShowModal(false);
    loadTeams();
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold gradient-text">팀 모집</h1>
            <p className="mt-1 text-sm text-text-secondary">
              함께할 팀원을 찾거나, 새로운 팀을 만들어보세요.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-lg gradient-bg px-5 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(108,92,231,0.3)]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            팀 만들기
          </button>
        </div>

        <div className="mb-6">
          <CampFilter
            hackathons={hackathons}
            selected={selectedSlug}
            onChange={setSelectedSlug}
          />
        </div>

        {teams.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map(team => (
              <TeamCard key={team.teamCode} team={team} />
            ))}
          </div>
        ) : (
          <EmptyState message="등록된 팀이 없습니다." />
        )}

        {showModal && (
          <TeamCreateModal
            hackathons={hackathons}
            onClose={() => setShowModal(false)}
            onCreated={handleCreated}
          />
        )}
      </div>
    </div>
  );
}
