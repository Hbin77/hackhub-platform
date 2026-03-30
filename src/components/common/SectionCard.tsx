import { ReactNode } from 'react';

interface SectionCardProps {
  children: ReactNode;
  className?: string;
}

export default function SectionCard({ children, className = '' }: SectionCardProps) {
  return (
    <div className={`rounded-xl border border-border bg-bg-surface p-6 ${className}`}>
      {children}
    </div>
  );
}
