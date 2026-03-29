import { HackathonListItem } from '@/types/hackathon';

interface CampFilterProps {
  hackathons: HackathonListItem[];
  selected: string;
  onChange: (slug: string) => void;
}

export default function CampFilter({ hackathons, selected, onChange }: CampFilterProps) {
  return (
    <select
      value={selected}
      onChange={e => onChange(e.target.value)}
      className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
    >
      <option value="">전체 해커톤</option>
      {hackathons.map(h => (
        <option key={h.slug} value={h.slug}>
          {h.title}
        </option>
      ))}
    </select>
  );
}
