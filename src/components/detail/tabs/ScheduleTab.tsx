'use client';

import { formatDate, isDatePast } from '@/lib/date';
import SectionCard from '@/components/common/SectionCard';

interface ScheduleTabProps {
  schedule: {
    timezone: string;
    milestones: {
      name: string;
      at: string;
    }[];
  };
}

export default function ScheduleTab({ schedule }: ScheduleTabProps) {
  return (
    <SectionCard>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">일정</h2>
        <span className="text-xs text-text-tertiary">{schedule.timezone}</span>
      </div>

      <div className="relative">
        {/* Purple connecting line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-primary/30" />

        <div className="space-y-6">
          {schedule.milestones.map((milestone, idx) => {
            const past = isDatePast(milestone.at);
            return (
              <div key={idx} className="relative flex items-start gap-4 pl-8">
                <span className="absolute left-0 top-1">
                  {past ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success/15">
                      <svg className="h-3.5 w-3.5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-bg-base">
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" />
                    </span>
                  )}
                </span>
                <div className={`rounded-lg p-3 transition-colors ${past ? 'bg-transparent' : 'bg-bg-elevated border border-border'}`}>
                  <p className={`text-sm font-medium ${past ? 'text-text-secondary' : 'text-text font-semibold'}`}>
                    {milestone.name}
                  </p>
                  <p className={`mt-0.5 text-xs ${past ? 'text-text-tertiary' : 'text-text-secondary'}`}>
                    {formatDate(milestone.at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}
