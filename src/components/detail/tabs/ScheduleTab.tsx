'use client';

import { formatDate, isDatePast } from '@/lib/date';

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
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">일정</h2>
        <span className="text-xs text-text-secondary">{schedule.timezone}</span>
      </div>

      <div className="relative">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />

        <div className="space-y-6">
          {schedule.milestones.map((milestone, idx) => {
            const past = isDatePast(milestone.at);
            return (
              <div key={idx} className="relative flex items-start gap-4 pl-8">
                <span className="absolute left-0 top-1">
                  {past ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                      <svg className="h-3.5 w-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-white">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    </span>
                  )}
                </span>
                <div>
                  <p className={`text-sm font-medium ${past ? 'text-text-secondary' : 'text-text font-semibold'}`}>
                    {milestone.name}
                  </p>
                  <p className={`mt-0.5 text-xs ${past ? 'text-text-secondary/70' : 'text-text-secondary'}`}>
                    {formatDate(milestone.at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
