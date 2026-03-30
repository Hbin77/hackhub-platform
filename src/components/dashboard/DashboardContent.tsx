'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useStorageReady } from '@/components/layout/StorageInitializer';
import { getSubmissions, getTeams, getHackathons, getAllLeaderboards } from '@/lib/storage';
import StatCard from '@/components/dashboard/StatCard';
import ActivityTimeline, { TimelineEvent } from '@/components/dashboard/ActivityTimeline';
import BadgeDisplay from '@/components/badges/BadgeDisplay';
import SectionCard from '@/components/common/SectionCard';
import StatusBadge from '@/components/common/StatusBadge';
import type { Submission } from '@/types/submission';
import type { Team } from '@/types/team';
import type { HackathonListItem } from '@/types/hackathon';

interface DashboardData {
  totalSubmissions: number;
  teamsCreated: number;
  hackathonsParticipated: number;
  bestRank: number | null;
  events: TimelineEvent[];
  participatedHackathons: (HackathonListItem & { submissionCount: number })[];
}

function buildDashboardData(): DashboardData {
  const submissions = getSubmissions();
  const teams = getTeams();
  const hackathons = getHackathons();
  const leaderboards = getAllLeaderboards();

  const submissionSlugs = new Set(submissions.map(s => s.hackathonSlug));
  const teamSlugs = new Set(teams.map(t => t.hackathonSlug));
  const allSlugs = new Set([...submissionSlugs, ...teamSlugs]);

  const userTeamNames = new Set(submissions.map(s => s.teamName));
  const userEntries = leaderboards
    .flatMap(l => l.entries)
    .filter(e => userTeamNames.has(e.teamName));
  const bestRank = userEntries.length > 0
    ? Math.min(...userEntries.map(e => e.rank))
    : null;

  const submissionEvents: TimelineEvent[] = submissions.map((s: Submission) => {
    const hackathon = hackathons.find(h => h.slug === s.hackathonSlug);
    return {
      id: `sub-${s.id}`,
      type: 'submission' as const,
      title: `"${s.teamName}" ${s.artifactType} 제출`,
      hackathonSlug: s.hackathonSlug,
      hackathonName: hackathon?.title ?? s.hackathonSlug,
      date: s.submittedAt,
    };
  });

  const teamEvents: TimelineEvent[] = teams.map((t: Team) => {
    const hackathon = hackathons.find(h => h.slug === t.hackathonSlug);
    return {
      id: `team-${t.teamCode}`,
      type: 'team' as const,
      title: `팀 "${t.name}" 생성`,
      hackathonSlug: t.hackathonSlug,
      hackathonName: hackathon?.title ?? t.hackathonSlug,
      date: t.createdAt,
    };
  });

  const events = [...submissionEvents, ...teamEvents]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const submissionCountMap = new Map<string, number>();
  for (const s of submissions) {
    submissionCountMap.set(s.hackathonSlug, (submissionCountMap.get(s.hackathonSlug) ?? 0) + 1);
  }

  const participatedHackathons = hackathons
    .filter(h => allSlugs.has(h.slug))
    .map(h => ({
      ...h,
      submissionCount: submissionCountMap.get(h.slug) ?? 0,
    }));

  return {
    totalSubmissions: submissions.length,
    teamsCreated: teams.length,
    hackathonsParticipated: submissionSlugs.size,
    bestRank,
    events,
    participatedHackathons,
  };
}

export default function DashboardContent() {
  const ready = useStorageReady();
  const data = useMemo(() => (ready ? buildDashboardData() : null), [ready]);

  if (!ready || !data) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <p className="text-text-secondary">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">
            내 대시보드
          </h1>
          <p className="text-sm text-text-secondary">
            나의 해커톤 활동을 한눈에 확인하세요.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="총 제출"
            value={data.totalSubmissions}
            color="primary"
            icon={
              <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <StatCard
            label="팀 생성"
            value={data.teamsCreated}
            color="accent"
            icon={
              <svg className="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <StatCard
            label="참여 해커톤"
            value={data.hackathonsParticipated}
            color="success"
            icon={
              <svg className="h-5 w-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
          />
          <StatCard
            label="최고 순위"
            value={data.bestRank ? `${data.bestRank}위` : '-'}
            color="warning"
            icon={
              <svg className="h-5 w-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            }
          />
        </div>

        <SectionCard className="mb-8">
          <h2 className="font-display text-xl font-bold text-text mb-4">뱃지</h2>
          <BadgeDisplay />
        </SectionCard>

        <div className="grid gap-8 lg:grid-cols-2">
          <SectionCard>
            <h2 className="font-display text-xl font-bold text-text mb-4">최근 활동</h2>
            <ActivityTimeline events={data.events} />
          </SectionCard>

          <SectionCard>
            <h2 className="font-display text-xl font-bold text-text mb-4">참여 해커톤</h2>
            {data.participatedHackathons.length === 0 ? (
              <p className="text-sm text-text-tertiary">아직 참여한 해커톤이 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {data.participatedHackathons.map(h => (
                  <Link
                    key={h.slug}
                    href={`/hackathons/${h.slug}`}
                    className="flex items-center justify-between rounded-lg border border-border bg-bg-elevated/50 p-4 transition-colors hover:border-border-hover"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text overflow-hidden text-ellipsis whitespace-nowrap">{h.title}</p>
                      <p className="text-xs text-text-tertiary mt-0.5">
                        제출 {h.submissionCount}건
                      </p>
                    </div>
                    <StatusBadge status={h.status} />
                  </Link>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
