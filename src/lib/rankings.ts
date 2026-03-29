import { Leaderboard } from '@/types/leaderboard';
import { RankingEntry } from '@/types/ranking';

const POINTS_BY_RANK = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];

export function computeRankings(leaderboards: Leaderboard[]): RankingEntry[] {
  const map = new Map<string, { totalPoints: number; hackathons: Set<string> }>();

  for (const board of leaderboards) {
    for (const entry of board.entries) {
      const points = POINTS_BY_RANK[entry.rank - 1] ?? 5;
      const existing = map.get(entry.teamName);
      if (existing) {
        existing.totalPoints += points;
        existing.hackathons.add(board.hackathonSlug);
      } else {
        map.set(entry.teamName, {
          totalPoints: points,
          hackathons: new Set([board.hackathonSlug]),
        });
      }
    }
  }

  const entries: RankingEntry[] = Array.from(map.entries())
    .map(([teamName, data]) => ({
      rank: 0,
      teamName,
      totalPoints: data.totalPoints,
      hackathonCount: data.hackathons.size,
      hackathons: Array.from(data.hackathons),
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);

  entries.forEach((e, i) => (e.rank = i + 1));
  return entries;
}
