'use client';

import { useEffect, useState } from 'react';
import { getTeams } from '@/lib/storage';
import { Team } from '@/types/team';
import EmptyState from '@/components/common/EmptyState';
import TeamCard from '@/components/camp/TeamCard';
import Link from 'next/link';

interface TeamsTabProps {
  slug: string;
  campEnabled: boolean;
}

export default function TeamsTab({ slug, campEnabled }: TeamsTabProps) {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    setTeams(getTeams(slug));
  }, [slug]);

  return (
    <div className="space-y-4">
      {campEnabled && (
        <div className="flex justify-end">
          <Link
            href={`/camp?hackathon=${slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-all hover:bg-accent/20 hover:border-accent/50"
          >
            팀 모집 캠프로 이동
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      )}

      {teams.length === 0 ? (
        <EmptyState message="등록된 팀이 없습니다." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {teams.map(team => (
            <TeamCard key={team.teamCode} team={team} showContact={false} />
          ))}
        </div>
      )}
    </div>
  );
}
