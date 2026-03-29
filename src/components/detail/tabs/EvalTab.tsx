import { EvalSection } from '@/types/hackathon';
import SectionCard from '@/components/common/SectionCard';

interface EvalTabProps {
  eval: EvalSection;
}

export default function EvalTab({ eval: evalSection }: EvalTabProps) {
  const isVote = evalSection.scoreSource === 'vote';

  return (
    <div className="space-y-6">
      <SectionCard>
        <h2 className="mb-2 text-lg font-semibold text-text">{evalSection.metricName}</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-text-secondary">
          {evalSection.description}
        </p>
      </SectionCard>

      {isVote && evalSection.scoreDisplay && (
        <SectionCard>
          <h3 className="mb-4 text-base font-semibold text-text">
            {evalSection.scoreDisplay.label}
          </h3>
          <div className="space-y-3">
            {evalSection.scoreDisplay.breakdown.map(item => (
              <div key={item.key} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-sm text-text-secondary">{item.label}</span>
                <div className="flex-1">
                  <div className="h-3 w-full overflow-hidden rounded-full bg-surface-elevated">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${item.weightPercent}%` }}
                    />
                  </div>
                </div>
                <span className="w-12 shrink-0 text-right text-sm font-medium text-text">
                  {item.weightPercent}%
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {!isVote && evalSection.limits && (
        <SectionCard>
          <h3 className="mb-4 text-base font-semibold text-text">제출 제한</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-surface-elevated p-4">
              <p className="mb-1 text-xs text-text-secondary">최대 실행 시간</p>
              <p className="text-lg font-semibold text-text">
                {evalSection.limits.maxRuntimeSec}초
              </p>
            </div>
            <div className="rounded-lg bg-surface-elevated p-4">
              <p className="mb-1 text-xs text-text-secondary">일일 최대 제출 횟수</p>
              <p className="text-lg font-semibold text-text">
                {evalSection.limits.maxSubmissionsPerDay}회
              </p>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
