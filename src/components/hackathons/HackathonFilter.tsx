export type FilterValue = 'all' | 'ongoing' | 'ended' | 'upcoming';

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'ongoing', label: '진행중' },
  { value: 'ended', label: '종료' },
  { value: 'upcoming', label: '예정' },
];

interface HackathonFilterProps {
  activeFilter: FilterValue;
  onChange: (filter: FilterValue) => void;
}

export default function HackathonFilter({ activeFilter, onChange }: HackathonFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
            activeFilter === value
              ? 'gradient-bg text-white shadow-lg shadow-primary/20'
              : 'bg-bg-elevated text-text-secondary hover:text-text'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
