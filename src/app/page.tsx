import { getHackathonsServer, getTotalPrizeServer, getSeedTeamsServer } from '@/lib/server-data';
import HeroBanner from '@/components/home/HeroBanner';
import HomeContent from '@/components/home/HomeContent';

export default function HomePage() {
  const hackathons = getHackathonsServer();
  const totalPrize = getTotalPrizeServer();
  const seedTeams = getSeedTeamsServer();

  return (
    <div className="bg-bg-base">
      <HeroBanner
        teamCount={seedTeams.length}
        totalPrize={totalPrize}
        hackathonCount={hackathons.length}
      />
      <HomeContent serverHackathons={hackathons} />
    </div>
  );
}
