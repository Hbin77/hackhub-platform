'use client';

import { useState } from 'react';
import { HackathonDetail, HackathonListItem } from '@/types/hackathon';
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

interface DetailPageClientProps {
  detail: HackathonDetail;
  listItem: HackathonListItem | null;
  slug: string;
}

export default function DetailPageClient({ detail, listItem, slug }: DetailPageClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

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
