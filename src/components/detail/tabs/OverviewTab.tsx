import SectionCard from '@/components/common/SectionCard';

interface OverviewTabProps {
  overview: {
    summary: string;
    teamPolicy: {
      allowSolo: boolean;
      maxTeamSize: number;
    };
  };
}

export default function OverviewTab({ overview }: OverviewTabProps) {
  const { summary, teamPolicy } = overview;

  return (
    <div className="space-y-6">
      <SectionCard>
        <h2 className="mb-3 text-lg font-semibold text-text">요약</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-text-secondary">
          {summary}
        </p>
      </SectionCard>

      <SectionCard>
        <h2 className="mb-3 text-lg font-semibold text-text">팀 구성 정책</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg bg-bg-elevated p-4">
            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${teamPolicy.allowSolo ? 'bg-success/15 text-success' : 'bg-error/15 text-error'}`}>
              {teamPolicy.allowSolo ? '○' : '✕'}
            </span>
            <div>
              <p className="text-sm font-medium text-text">개인 참가</p>
              <p className="text-xs text-text-secondary">{teamPolicy.allowSolo ? '가능' : '불가'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-bg-elevated p-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-sm font-bold text-primary">
              {teamPolicy.maxTeamSize}
            </span>
            <div>
              <p className="text-sm font-medium text-text">최대 팀 인원</p>
              <p className="text-xs text-text-secondary">{teamPolicy.maxTeamSize}명</p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
