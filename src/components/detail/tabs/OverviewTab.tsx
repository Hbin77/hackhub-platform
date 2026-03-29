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
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-3 text-lg font-semibold text-text">요약</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-text-secondary">
          {summary}
        </p>
      </section>

      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-3 text-lg font-semibold text-text">팀 구성 정책</h2>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-center gap-2">
            <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${teamPolicy.allowSolo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {teamPolicy.allowSolo ? '○' : '✕'}
            </span>
            개인 참가 {teamPolicy.allowSolo ? '가능' : '불가'}
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-light text-xs text-primary">
              {teamPolicy.maxTeamSize}
            </span>
            최대 팀 인원: {teamPolicy.maxTeamSize}명
          </li>
        </ul>
      </section>
    </div>
  );
}
