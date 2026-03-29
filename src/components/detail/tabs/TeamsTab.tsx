'use client';

import { useEffect, useState } from 'react';
import { getTeams } from '@/lib/storage';
import { Team } from '@/types/team';
import EmptyState from '@/components/common/EmptyState';
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
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
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
            <div
              key={team.teamCode}
              className="rounded-xl border border-border bg-surface p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-text">{team.name}</h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    team.isOpen ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {team.isOpen ? '모집중' : '모집완료'}
                </span>
              </div>

              <div className="mb-2 flex items-center gap-3 text-xs text-text-secondary">
                <span>{team.memberCount}명</span>
              </div>

              {team.lookingFor.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {team.lookingFor.map(role => (
                    <span
                      key={role}
                      className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-medium text-primary"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-sm leading-relaxed text-text-secondary line-clamp-2">
                {team.intro}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
