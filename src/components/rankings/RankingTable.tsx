import { RankingEntry } from '@/types/ranking';
import EmptyState from '@/components/common/EmptyState';

function getRankDisplay(rank: number) {
  if (rank === 1) return { emoji: '🥇', badgeClass: 'bg-gold/15 text-gold', scoreClass: 'text-gold' };
  if (rank === 2) return { emoji: '🥈', badgeClass: 'bg-silver/15 text-silver', scoreClass: 'text-silver' };
  if (rank === 3) return { emoji: '🥉', badgeClass: 'bg-bronze/15 text-bronze', scoreClass: 'text-bronze' };
  return { emoji: '', badgeClass: '', scoreClass: 'text-primary' };
}

export default function RankingTable({ rankings }: { rankings: RankingEntry[] }) {
  if (rankings.length === 0) {
    return <EmptyState message="아직 랭킹 데이터가 없습니다." />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-bg-surface">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-bg-elevated">
            <th className="whitespace-nowrap px-6 py-3.5 font-medium text-text-secondary">순위</th>
            <th className="whitespace-nowrap px-6 py-3.5 font-medium text-text-secondary">팀명</th>
            <th className="whitespace-nowrap px-6 py-3.5 text-right font-medium text-text-secondary">총점</th>
            <th className="whitespace-nowrap px-6 py-3.5 text-right font-medium text-text-secondary">참여 횟수</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((entry, idx) => {
            const display = getRankDisplay(entry.rank);
            return (
              <tr
                key={entry.teamName}
                className={`border-b border-border last:border-b-0 transition-colors hover:bg-bg-elevated/50 ${
                  idx % 2 === 0 ? 'bg-bg-surface' : 'bg-bg-base'
                }`}
              >
                <td className="whitespace-nowrap px-6 py-4">
                  {entry.rank <= 3 ? (
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg font-display text-xs font-bold ${display.badgeClass}`}>
                      {entry.rank}
                    </span>
                  ) : (
                    <span className="font-display text-sm text-text-secondary pl-1.5">{entry.rank}</span>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-text">
                  <span className="flex items-center gap-2">
                    {display.emoji && <span className="text-lg">{display.emoji}</span>}
                    {entry.teamName}
                  </span>
                </td>
                <td className={`whitespace-nowrap px-6 py-4 text-right font-display font-bold ${display.scoreClass}`}>
                  {entry.totalPoints.toLocaleString()}점
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-text-secondary">
                  {entry.hackathonCount}회
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
