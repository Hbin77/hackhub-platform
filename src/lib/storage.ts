import { HackathonListItem, HackathonDetail } from '@/types/hackathon';
import { Leaderboard, LeaderboardEntry } from '@/types/leaderboard';
import { Team } from '@/types/team';
import { Submission } from '@/types/submission';

const KEYS = {
  hackathons: 'hp_hackathons',
  details: 'hp_details',
  leaderboards: 'hp_leaderboards',
  teams: 'hp_teams',
  submissions: 'hp_submissions',
  seeded: 'hp_seeded',
} as const;

function get<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

function set<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage quota exceeded - silently fail
  }
}

let seedPromise: Promise<void> | null = null;

export function seedIfNeeded(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (localStorage.getItem(KEYS.seeded)) return Promise.resolve();

  if (!seedPromise) {
    seedPromise = (async () => {
      try {
        const [hackathons, details, leaderboards, teams] = await Promise.all([
          fetch('/data/hackathons.json').then(r => { if (!r.ok) throw new Error(); return r.json(); }),
          fetch('/data/hackathon_details.json').then(r => { if (!r.ok) throw new Error(); return r.json(); }),
          fetch('/data/leaderboards.json').then(r => { if (!r.ok) throw new Error(); return r.json(); }),
          fetch('/data/teams.json').then(r => { if (!r.ok) throw new Error(); return r.json(); }),
        ]);

        set(KEYS.hackathons, hackathons);
        set(KEYS.details, details);
        set(KEYS.leaderboards, leaderboards);
        set(KEYS.teams, teams);
        set(KEYS.submissions, []);
        localStorage.setItem(KEYS.seeded, 'true');
      } catch {
        seedPromise = null;
      }
    })();
  }

  return seedPromise;
}

export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function getHackathons(): HackathonListItem[] {
  return get<HackathonListItem[]>(KEYS.hackathons) ?? [];
}

export function getHackathonDetail(slug: string): HackathonDetail | null {
  const all = get<HackathonDetail[]>(KEYS.details) ?? [];
  return all.find(d => d.slug === slug) ?? null;
}

export function getLeaderboard(slug: string): Leaderboard | null {
  const all = get<Leaderboard[]>(KEYS.leaderboards) ?? [];
  return all.find(l => l.hackathonSlug === slug) ?? null;
}

export function getAllLeaderboards(): Leaderboard[] {
  return get<Leaderboard[]>(KEYS.leaderboards) ?? [];
}

export function getTeams(hackathonSlug?: string): Team[] {
  const all = get<Team[]>(KEYS.teams) ?? [];
  if (!hackathonSlug) return all;
  return all.filter(t => t.hackathonSlug === hackathonSlug);
}

export function addTeam(team: Team): void {
  const all = getTeams();
  all.push(team);
  set(KEYS.teams, all);
}

export function getSubmissions(hackathonSlug?: string): Submission[] {
  const all = get<Submission[]>(KEYS.submissions) ?? [];
  if (!hackathonSlug) return all;
  return all.filter(s => s.hackathonSlug === hackathonSlug);
}

export function addSubmission(submission: Submission): void {
  const subs = get<Submission[]>(KEYS.submissions) ?? [];
  subs.push(submission);
  set(KEYS.submissions, subs);
}

export function addLeaderboardEntry(hackathonSlug: string, entry: LeaderboardEntry): void {
  const all = get<Leaderboard[]>(KEYS.leaderboards) ?? [];
  const board = all.find(l => l.hackathonSlug === hackathonSlug);
  if (board) {
    board.entries.push(entry);
    board.entries.sort((a, b) => b.score - a.score);
    board.entries.forEach((e, i) => (e.rank = i + 1));
    board.updatedAt = new Date().toISOString();
  } else {
    all.push({
      hackathonSlug,
      updatedAt: new Date().toISOString(),
      entries: [{ ...entry, rank: 1 }],
    });
  }
  set(KEYS.leaderboards, all);
}

export function resetStorage(): void {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}
