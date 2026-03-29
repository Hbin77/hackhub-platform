import { HackathonListItem } from '@/types/hackathon';
import HackathonCard from '@/components/common/HackathonCard';
import EmptyState from '@/components/common/EmptyState';

interface HackathonGridProps {
  hackathons: HackathonListItem[];
}

export default function HackathonGrid({ hackathons }: HackathonGridProps) {
  if (hackathons.length === 0) {
    return <EmptyState message="해당하는 해커톤이 없습니다." />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {hackathons.map(hackathon => (
        <HackathonCard key={hackathon.slug} hackathon={hackathon} />
      ))}
    </div>
  );
}
