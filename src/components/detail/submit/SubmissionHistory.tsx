import { Submission } from '@/types/submission';
import { formatDate } from '@/lib/date';
import { isSafeUrl } from '@/lib/validation';
import EmptyState from '@/components/common/EmptyState';
import SectionCard from '@/components/common/SectionCard';

interface SubmissionHistoryProps {
  submissions: Submission[];
}

export default function SubmissionHistory({ submissions }: SubmissionHistoryProps) {
  if (submissions.length === 0) {
    return <EmptyState message="아직 제출 내역이 없습니다." />;
  }

  return (
    <SectionCard>
      <h2 className="mb-4 text-lg font-semibold text-text">제출 내역</h2>
      <div className="space-y-3">
        {submissions.map(sub => (
          <div
            key={sub.id}
            className="flex flex-col gap-1 rounded-xl border border-border bg-bg-elevated p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text">{sub.teamName}</span>
                <span className="rounded-md bg-primary-light px-1.5 py-0.5 text-xs font-medium text-primary">
                  {sub.artifactType}
                </span>
                {sub.step && (
                  <span className="rounded-md bg-bg-surface px-1.5 py-0.5 text-xs text-text-secondary">
                    {sub.step}
                  </span>
                )}
              </div>
              {sub.fileName && (
                <p className="text-xs text-text-secondary">{sub.fileName}</p>
              )}
              {sub.url && (
                isSafeUrl(sub.url) ? (
                  <a
                    href={sub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent hover:underline"
                  >
                    {sub.url}
                  </a>
                ) : (
                  <span className="text-xs text-text-secondary">{sub.url}</span>
                )
              )}
              {sub.notes && (
                <p className="text-xs text-text-tertiary">{sub.notes}</p>
              )}
            </div>
            <span className="shrink-0 text-xs text-text-tertiary">
              {formatDate(sub.submittedAt)}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
