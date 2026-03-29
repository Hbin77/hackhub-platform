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
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold text-text md:text-3xl">{title}</h1>
        <StatusBadge status={status} />
      </div>
      {period && (
        <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
          <span>
            제출 마감: {formatDate(period.submissionDeadlineAt)}
          </span>
          <span>
            종료: {formatDate(period.endAt)}
          </span>
          <span className="text-xs text-text-secondary">({period.timezone})</span>
        </div>
      )}
    </div>
  );
}
