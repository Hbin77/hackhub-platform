import { Leaderboard, LeaderboardEntry } from '@/types/leaderboard';
import { get, set, KEYS } from './core';

export function getLeaderboard(slug: string): Leaderboard | null {
  const all = get<Leaderboard[]>(KEYS.leaderboards) ?? [];
  return all.find(l => l.hackathonSlug === slug) ?? null;
}

export function getAllLeaderboards(): Leaderboard[] {
  return get<Leaderboard[]>(KEYS.leaderboards) ?? [];
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
