import Link from 'next/link';
import { HackathonListItem } from '@/types/hackathon';
import StatusBadge from './StatusBadge';
import { getDday } from '@/lib/date';

export default function HackathonCard({ hackathon }: { hackathon: HackathonListItem }) {
  const dday = hackathon.status !== 'ended' ? getDday(hackathon.period.submissionDeadlineAt) : null;
  const detailHref = hackathon.links.detail.startsWith('/') ? hackathon.links.detail : '#';

  return (
    <Link
      href={detailHref}
      className="group block overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-lg"
    >
      <div className="aspect-[3/2] overflow-hidden bg-surface-elevated">
        <img
          src={hackathon.thumbnailUrl}
          alt={hackathon.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <StatusBadge status={hackathon.status} />
          {dday && (
            <span className="text-xs font-semibold text-primary">{dday}</span>
          )}
        </div>
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-text group-hover:text-primary">
          {hackathon.title}
        </h3>
        <div className="flex flex-wrap gap-1">
          {hackathon.tags.map(tag => (
            <span
              key={tag}
              className="rounded bg-surface-elevated px-2 py-0.5 text-xs text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
