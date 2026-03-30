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

const STORAGE_KEY = 'hp_badges';

function getEarnedMap(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveEarnedMap(map: Record<string, string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
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
  try {
    const subs = localStorage.getItem('hp_submissions');
    if (subs) {
      const parsed = JSON.parse(subs);
      if (Array.isArray(parsed) && parsed.length > 0 && !before['first-submit']) {
        before['first-submit'] = new Date().toISOString();
      }
    }
  } catch { /* ignore */ }

  // team-creator: check if user has created teams (more than seed data count of 4)
  try {
    const teams = localStorage.getItem('hp_teams');
    if (teams) {
      const parsed = JSON.parse(teams);
      if (Array.isArray(parsed) && parsed.length > 4 && !before['team-creator']) {
        before['team-creator'] = new Date().toISOString();
      }
    }
  } catch { /* ignore */ }

  // three-hackathons: check visited hackathon detail pages
  try {
    const visited = localStorage.getItem('hp_visited_hackathons');
    if (visited) {
      const parsed = JSON.parse(visited);
      if (Array.isArray(parsed) && parsed.length >= 3 && !before['three-hackathons']) {
        before['three-hackathons'] = new Date().toISOString();
      }
    }
  } catch { /* ignore */ }

  // top-ranker: check if user has submitted and their entry is in top 3
  try {
    const subs = localStorage.getItem('hp_submissions');
    const lb = localStorage.getItem('hp_leaderboards');
    if (subs && lb) {
      const submissions = JSON.parse(subs);
      const leaderboards = JSON.parse(lb);
      if (Array.isArray(submissions) && Array.isArray(leaderboards)) {
        const userTeams = new Set(submissions.map((s: { teamName: string }) => s.teamName));
        for (const board of leaderboards) {
          if (board.entries && Array.isArray(board.entries)) {
            const userInTop3 = board.entries
              .filter((e: { rank: number }) => e.rank <= 3)
              .some((e: { teamName: string }) => userTeams.has(e.teamName));
            if (userInTop3 && !before['top-ranker']) {
              before['top-ranker'] = new Date().toISOString();
            }
          }
        }
      }
    }
  } catch { /* ignore */ }

  // explorer: check visited pages
  try {
    const pages = localStorage.getItem('hp_visited_pages');
    if (pages) {
      const parsed = JSON.parse(pages);
      const requiredPages = ['/', '/hackathons', '/rankings', '/camp', '/dashboard'];
      const allVisited = requiredPages.every((p) =>
        Array.isArray(parsed) ? parsed.includes(p) : false
      );
      if (allVisited && !before['explorer']) {
        before['explorer'] = new Date().toISOString();
      }
    }
  } catch { /* ignore */ }

  saveEarnedMap(before);

  return BADGE_DEFINITIONS.map((def) => ({
    ...def,
    earned: !!before[def.id],
    earnedAt: before[def.id] || undefined,
  }));
}
