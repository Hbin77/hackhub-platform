import { getHackathonsServer } from '@/lib/server-data';
import HackathonsPageClient from '@/components/hackathons/HackathonsPageClient';

export default function HackathonsPage() {
  const hackathons = getHackathonsServer();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-text mb-2">해커톤</h1>
        <p className="text-text-secondary">최신 해커톤을 확인하고 참가해보세요</p>
      </div>
      <HackathonsPageClient serverHackathons={hackathons} />
    </div>
  );
}
