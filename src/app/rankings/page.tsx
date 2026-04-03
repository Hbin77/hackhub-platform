import { getAllLeaderboardsServer } from '@/lib/server-data';
import RankingsContent from '@/components/rankings/RankingsContent';

export default function RankingsPage() {
  const leaderboards = getAllLeaderboardsServer();

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">랭킹</h1>
          <p className="text-sm text-text-secondary">
            모든 해커톤의 성적을 종합한 팀별 순위입니다.
          </p>
        </div>
        <RankingsContent serverLeaderboards={leaderboards} />
      </div>
    </div>
  );
}
