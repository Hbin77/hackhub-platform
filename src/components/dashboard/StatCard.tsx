import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color: 'primary' | 'accent' | 'success' | 'warning';
}

const COLOR_MAP = {
  primary: {
    bg: 'bg-primary/15',
    text: 'text-primary',
  },
  accent: {
    bg: 'bg-accent/15',
    text: 'text-accent',
  },
  success: {
    bg: 'bg-success/15',
    text: 'text-success',
  },
  warning: {
    bg: 'bg-warning/15',
    text: 'text-warning',
  },
} as const;

export default function StatCard({ label, value, icon, color }: StatCardProps) {
  const colors = COLOR_MAP[color];

  return (
    <div className="group rounded-xl border border-border bg-bg-surface p-6 transition-all duration-200 hover:border-border-hover hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className={`font-display text-3xl font-bold ${colors.text}`}>
            {value}
          </p>
          <p className="mt-1 text-sm text-text-secondary">{label}</p>
        </div>
        <div className={`rounded-lg ${colors.bg} p-2.5`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
