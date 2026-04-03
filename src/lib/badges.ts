import { get, set, KEYS, SEED_TEAM_COUNT } from '@/lib/storage/core';
import { getSubmissions } from '@/lib/storage/submissions';
import { getTeams } from '@/lib/storage/teams';
import { getAllLeaderboards } from '@/lib/storage/leaderboards';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

const BADGE_DEFINITIONS: Omit<Badge, 'earned' | 'earnedAt'>[] = [
  { id: 'first-visit', name: '탐험가', description: '첫 방문', icon: '🧭' },
  { id: 'first-submit', name: '도전자', description: '첫 제출 완료', icon: '🚀' },
  { id: 'team-creator', name: '리더', description: '팀 생성', icon: '👑' },
  { id: 'three-hackathons', name: '해커톤 매니아', description: '3개 해커톤 참여', icon: '🔥' },
  { id: 'top-ranker', name: '엘리트', description: '랭킹 Top 3 진입', icon: '⭐' },
  { id: 'explorer', name: '올라운더', description: '모든 페이지 방문', icon: '🌍' },
];

function getEarnedMap(): Record<string, string> {
  return get<Record<string, string>>(KEYS.badges) ?? {};
}

function saveEarnedMap(map: Record<string, string>): void {
  set(KEYS.badges, map);
}

export function getBadges(): Badge[] {
  const earned = getEarnedMap();
  return BADGE_DEFINITIONS.map((def) => ({
    ...def,
    earned: !!earned[def.id],
    earnedAt: earned[def.id] || undefined,
  }));
}

export function earnBadge(id: string): void {
  const earned = getEarnedMap();
  if (!earned[id]) {
    earned[id] = new Date().toISOString();
    saveEarnedMap(earned);
  }
}

export function checkAndEarnBadges(): Badge[] {
  const before = getEarnedMap();

  // first-visit is always earned
  if (!before['first-visit']) {
    before['first-visit'] = new Date().toISOString();
  }

  // first-submit: check if user has made any submissions
  const submissions = getSubmissions();
  if (submissions.length > 0 && !before['first-submit']) {
    before['first-submit'] = new Date().toISOString();
  }

  // team-creator: check if user has created teams (more than seed data)
  const teams = getTeams();
  if (teams.length > SEED_TEAM_COUNT && !before['team-creator']) {
    before['team-creator'] = new Date().toISOString();
  }

  // three-hackathons: check visited hackathon detail pages
  const visitedHackathons = get<string[]>(KEYS.visitedHackathons) ?? [];
  if (visitedHackathons.length >= 3 && !before['three-hackathons']) {
    before['three-hackathons'] = new Date().toISOString();
  }

  // top-ranker: check if user has submitted and their entry is in top 3
  const leaderboards = getAllLeaderboards();
  if (submissions.length > 0) {
    const userTeams = new Set(submissions.map(s => s.teamName));
    for (const board of leaderboards) {
      if (board.entries && Array.isArray(board.entries)) {
        const userInTop3 = board.entries
          .filter(e => e.rank <= 3)
          .some(e => userTeams.has(e.teamName));
        if (userInTop3 && !before['top-ranker']) {
          before['top-ranker'] = new Date().toISOString();
        }
      }
    }
  }

  // explorer: check visited pages
  const visitedPages = get<string[]>(KEYS.visitedPages) ?? [];
  const requiredPages = ['/', '/hackathons', '/rankings', '/camp', '/dashboard'];
  const allVisited = requiredPages.every(p => visitedPages.includes(p));
  if (allVisited && !before['explorer']) {
    before['explorer'] = new Date().toISOString();
  }

  saveEarnedMap(before);

  return BADGE_DEFINITIONS.map((def) => ({
    ...def,
    earned: !!before[def.id],
    earnedAt: before[def.id] || undefined,
  }));
}
