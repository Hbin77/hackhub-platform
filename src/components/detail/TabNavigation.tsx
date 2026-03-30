export type TabKey = 'overview' | 'teams' | 'eval' | 'prize' | 'info' | 'schedule' | 'submit' | 'leaderboard';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: '개요' },
  { key: 'teams', label: '팀' },
  { key: 'eval', label: '평가' },
  { key: 'prize', label: '상금' },
  { key: 'info', label: '안내' },
  { key: 'schedule', label: '일정' },
  { key: 'submit', label: '제출' },
  { key: 'leaderboard', label: '리더보드' },
];

interface TabNavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="overflow-x-auto rounded-xl bg-bg-surface border border-border">
      <nav className="flex min-w-max gap-0" role="tablist">
        {TABS.map(tab => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.key)}
              className={`relative px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-t" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
