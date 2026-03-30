'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getHackathonDetail, getHackathons } from '@/lib/storage';
import { useStorageReady } from '@/components/layout/StorageInitializer';
import { HackathonDetail } from '@/types/hackathon';
import { HackathonListItem } from '@/types/hackathon';
import DetailHeader from '@/components/detail/DetailHeader';
import TabNavigation, { type TabKey } from '@/components/detail/TabNavigation';
import OverviewTab from '@/components/detail/tabs/OverviewTab';
import TeamsTab from '@/components/detail/tabs/TeamsTab';
import EvalTab from '@/components/detail/tabs/EvalTab';
import PrizeTab from '@/components/detail/tabs/PrizeTab';
import InfoTab from '@/components/detail/tabs/InfoTab';
import ScheduleTab from '@/components/detail/tabs/ScheduleTab';
import SubmitTab from '@/components/detail/tabs/SubmitTab';
import LeaderboardTab from '@/components/detail/tabs/LeaderboardTab';

export default function HackathonDetailPage() {
  const ready = useStorageReady();
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug ?? '';
  const [detail, setDetail] = useState<HackathonDetail | null>(null);
  const [listItem, setListItem] = useState<HackathonListItem | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    const d = getHackathonDetail(slug);
    const items = getHackathons();
    const item = items.find(h => h.slug === slug) ?? null;
    setDetail(d);
    setListItem(item);
    setLoading(false);
  }, [slug, ready]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-bg-base">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center bg-bg-base text-text-secondary">
        <p className="text-lg">해커톤을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab overview={detail.sections.overview} />;
      case 'teams':
        return <TeamsTab slug={slug} campEnabled={detail.sections.teams.campEnabled} />;
      case 'eval':
        return <EvalTab eval={detail.sections.eval} />;
      case 'prize':
        return <PrizeTab items={detail.sections.prize.items} />;
      case 'info':
        return <InfoTab info={detail.sections.info} />;
      case 'schedule':
        return <ScheduleTab schedule={detail.sections.schedule} />;
      case 'submit':
        return <SubmitTab slug={slug} submit={detail.sections.submit} />;
      case 'leaderboard':
        return <LeaderboardTab slug={slug} note={detail.sections.leaderboard.note} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <DetailHeader
          title={detail.title}
          status={listItem?.status ?? 'upcoming'}
          period={listItem?.period}
        />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-6 animate-float-up">{renderTab()}</div>
      </div>
    </div>
  );
}
