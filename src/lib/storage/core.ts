export const KEYS = {
  hackathons: 'hp_hackathons',
  details: 'hp_details',
  leaderboards: 'hp_leaderboards',
  teams: 'hp_teams',
  submissions: 'hp_submissions',
  seeded: 'hp_seeded',
  badges: 'hp_badges',
  visitedHackathons: 'hp_visited_hackathons',
  visitedPages: 'hp_visited_pages',
} as const;

export const SEED_TEAM_COUNT = 4;

export function get<T>(key: string): T | null {
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

export function set<T>(key: string, value: T): void {
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

export function resetStorage(): void {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}
