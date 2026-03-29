import { RankingEntry } from '@/types/ranking';
import EmptyState from '@/components/common/EmptyState';

interface RankingTableProps {
  rankings: RankingEntry[];
}

function getRankDisplay(rank: number) {
  if (rank === 1) return { emoji: '🥇', className: 'text-yellow-500 font-bold' };
  if (rank === 2) return { emoji: '🥈', className: 'text-gray-400 font-bold' };
  if (rank === 3) return { emoji: '🥉', className: 'text-amber-600 font-bold' };
  return { emoji: '', className: 'text-text-secondary' };
}

export default function RankingTable({ rankings }: RankingTableProps) {
  if (rankings.length === 0) {
    return <EmptyState message="아직 랭킹 데이터가 없습니다." />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-elevated">
            <th className="whitespace-nowrap px-6 py-3 font-semibold text-text-secondary">순위</th>
            <th className="whitespace-nowrap px-6 py-3 font-semibold text-text-secondary">팀명</th>
            <th className="whitespace-nowrap px-6 py-3 text-right font-semibold text-text-secondary">총점</th>
            <th className="whitespace-nowrap px-6 py-3 text-right font-semibold text-text-secondary">참여 횟수</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rankings.map(entry => {
            const display = getRankDisplay(entry.rank);
            return (
              <tr key={entry.teamName} className="transition-colors hover:bg-surface-elevated">
                <td className={`whitespace-nowrap px-6 py-4 ${display.className}`}>
                  {display.emoji ? `${display.emoji} ${entry.rank}` : entry.rank}
                </td>
                <td className="px-6 py-4 font-medium text-text">{entry.teamName}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-primary">
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
