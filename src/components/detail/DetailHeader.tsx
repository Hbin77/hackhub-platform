import StatusBadge from '@/components/common/StatusBadge';
import { formatDate } from '@/lib/date';

interface DetailHeaderProps {
  title: string;
  status: 'ongoing' | 'upcoming' | 'ended';
  period?: {
    timezone: string;
    submissionDeadlineAt: string;
    endAt: string;
  };
}

export default function DetailHeader({ title, status, period }: DetailHeaderProps) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-xl border border-border bg-bg-surface p-8">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="font-display text-3xl font-bold text-text md:text-4xl">{title}</h1>
          <StatusBadge status={status} />
        </div>
        {period && (
          <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              제출 마감: {formatDate(period.submissionDeadlineAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              종료: {formatDate(period.endAt)}
            </span>
            <span className="text-xs text-text-tertiary">({period.timezone})</span>
          </div>
        )}
      </div>
    </div>
  );
}
