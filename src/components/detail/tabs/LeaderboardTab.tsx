'use client';

import { useEffect, useState } from 'react';
import { getLeaderboard, isSafeUrl } from '@/lib/storage';
import { Leaderboard, LeaderboardEntry } from '@/types/leaderboard';
import { formatDate } from '@/lib/date';
import EmptyState from '@/components/common/EmptyState';

interface LeaderboardTabProps {
  slug: string;
  note: string;
}

export default function LeaderboardTab({ slug, note }: LeaderboardTabProps) {
  const [board, setBoard] = useState<Leaderboard | null>(null);

  useEffect(() => {
    setBoard(getLeaderboard(slug));
  }, [slug]);

  const entries = board?.entries ?? [];
  const hasBreakdown = entries.some(e => e.scoreBreakdown);
  const hasArtifacts = entries.some(e => e.artifacts);

  if (entries.length === 0) {
    return (
      <div className="space-y-4">
        <EmptyState message="아직 리더보드 데이터가 없습니다." />
        {note && (
          <p className="text-center text-xs text-text-secondary">{note}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        {board?.updatedAt && (
          <div className="border-b border-border px-6 py-3 text-xs text-text-secondary">
            최종 업데이트: {formatDate(board.updatedAt)}
          </div>
        )}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-elevated text-left">
              <th className="px-4 py-3 font-medium text-text-secondary w-16">순위</th>
              <th className="px-4 py-3 font-medium text-text-secondary">팀</th>
              <th className="px-4 py-3 font-medium text-text-secondary text-right">점수</th>
              {hasBreakdown && (
                <>
                  <th className="px-4 py-3 font-medium text-text-secondary text-right">참가자</th>
                  <th className="px-4 py-3 font-medium text-text-secondary text-right">심사위원</th>
                </>
              )}
              {hasArtifacts && (
                <th className="px-4 py-3 font-medium text-text-secondary">산출물</th>
              )}
              <th className="px-4 py-3 font-medium text-text-secondary">제출 시간</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry: LeaderboardEntry) => (
              <tr key={`${entry.rank}-${entry.teamName}`} className="border-b border-border last:border-b-0 hover:bg-surface-elevated/50">
                <td className="px-4 py-3">
                  <RankBadge rank={entry.rank} />
                </td>
                <td className="px-4 py-3 font-medium text-text">{entry.teamName}</td>
                <td className="px-4 py-3 text-right font-semibold text-primary">
                  {entry.score.toFixed(2)}
                </td>
                {hasBreakdown && (
                  <>
                    <td className="px-4 py-3 text-right text-text-secondary">
                      {entry.scoreBreakdown?.participant?.toFixed(2) ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-text-secondary">
                      {entry.scoreBreakdown?.judge?.toFixed(2) ?? '-'}
                    </td>
                  </>
                )}
                {hasArtifacts && (
                  <td className="px-4 py-3">
                    {entry.artifacts ? (
                      <div className="flex gap-2">
                        {entry.artifacts.webUrl && isSafeUrl(entry.artifacts.webUrl) && (
                          <a
                            href={entry.artifacts.webUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            Web
                          </a>
                        )}
                        {entry.artifacts.pdfUrl && isSafeUrl(entry.artifacts.pdfUrl) && (
                          <a
                            href={entry.artifacts.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            PDF
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-text-secondary">-</span>
                    )}
                  </td>
                )}
                <td className="px-4 py-3 text-xs text-text-secondary">
                  {formatDate(entry.submittedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {note && (
        <p className="text-center text-xs text-text-secondary">{note}</p>
      )}
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-xs font-bold text-yellow-700">1</span>;
  }
  if (rank === 2) {
    return <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">2</span>;
  }
  if (rank === 3) {
    return <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">3</span>;
  }
  return <span className="text-sm text-text-secondary">{rank}</span>;
}
