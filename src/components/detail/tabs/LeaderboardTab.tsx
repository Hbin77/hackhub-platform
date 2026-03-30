'use client';

import { useEffect, useState } from 'react';
import { getLeaderboard } from '@/lib/storage';
import { isSafeUrl } from '@/lib/validation';
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

  const top3 = entries.filter(e => e.rank <= 3);
  const rest = entries.filter(e => e.rank > 3);

  return (
    <div className="space-y-6">
      {/* TOP 3 Podium */}
      {top3.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          {top3.map((entry: LeaderboardEntry) => {
            const medalConfig = getMedalConfig(entry.rank);
            return (
              <div
                key={`${entry.rank}-${entry.teamName}`}
                className={`relative rounded-xl border p-5 text-center transition-all ${medalConfig.borderClass} ${medalConfig.bgClass}`}
              >
                {entry.rank === 1 && (
                  <div className="absolute inset-0 rounded-xl shadow-[0_0_30px_rgba(255,215,0,0.15)] pointer-events-none" />
                )}
                <div className={`mb-2 text-3xl`}>{medalConfig.emoji}</div>
                <p className="font-display text-xs font-medium text-text-secondary mb-1">
                  {entry.rank === 1 ? '1st Place' : entry.rank === 2 ? '2nd Place' : '3rd Place'}
                </p>
                <h3 className="text-base font-bold text-text mb-2">{entry.teamName}</h3>
                <p className={`font-display text-xl font-bold ${medalConfig.scoreColor}`}>
                  {entry.score.toFixed(2)}
                </p>
                {entry.scoreBreakdown && (
                  <div className="mt-2 flex justify-center gap-3 text-xs text-text-secondary">
                    <span>참가자 {entry.scoreBreakdown.participant?.toFixed(2) ?? '-'}</span>
                    <span>심사위원 {entry.scoreBreakdown.judge?.toFixed(2) ?? '-'}</span>
                  </div>
                )}
                {entry.artifacts && (
                  <div className="mt-2 flex justify-center gap-2">
                    {entry.artifacts.webUrl && isSafeUrl(entry.artifacts.webUrl) && (
                      <a href={entry.artifacts.webUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">Web</a>
                    )}
                    {entry.artifacts.pdfUrl && isSafeUrl(entry.artifacts.pdfUrl) && (
                      <a href={entry.artifacts.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">PDF</a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Full Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-bg-surface">
        {board?.updatedAt && (
          <div className="border-b border-border px-6 py-3 text-xs text-text-tertiary">
            최종 업데이트: {formatDate(board.updatedAt)}
          </div>
        )}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-elevated text-left">
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
            {entries.map((entry: LeaderboardEntry, idx: number) => (
              <tr
                key={`${entry.rank}-${entry.teamName}`}
                className={`border-b border-border last:border-b-0 transition-colors hover:bg-bg-elevated/50 ${
                  idx % 2 === 0 ? 'bg-bg-surface' : 'bg-bg-base'
                }`}
              >
                <td className="px-4 py-3">
                  <RankBadge rank={entry.rank} />
                </td>
                <td className="px-4 py-3 font-medium text-text">{entry.teamName}</td>
                <td className="px-4 py-3 text-right font-display font-bold text-primary">
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
                            className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                          >
                            Web
                          </a>
                        )}
                        {entry.artifacts.pdfUrl && isSafeUrl(entry.artifacts.pdfUrl) && (
                          <a
                            href={entry.artifacts.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
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

function getMedalConfig(rank: number) {
  if (rank === 1) return {
    emoji: '🥇',
    borderClass: 'border-gold',
    bgClass: 'bg-bg-surface',
    scoreColor: 'text-gold',
  };
  if (rank === 2) return {
    emoji: '🥈',
    borderClass: 'border-silver',
    bgClass: 'bg-bg-surface',
    scoreColor: 'text-silver',
  };
  if (rank === 3) return {
    emoji: '🥉',
    borderClass: 'border-bronze',
    bgClass: 'bg-bg-surface',
    scoreColor: 'text-bronze',
  };
  return {
    emoji: '',
    borderClass: 'border-border',
    bgClass: 'bg-bg-surface',
    scoreColor: 'text-primary',
  };
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gold/15 font-display text-xs font-bold text-gold">1</span>;
  }
  if (rank === 2) {
    return <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-silver/15 font-display text-xs font-bold text-silver">2</span>;
  }
  if (rank === 3) {
    return <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-bronze/15 font-display text-xs font-bold text-bronze">3</span>;
  }
  return <span className="font-display text-sm text-text-secondary">{rank}</span>;
}
