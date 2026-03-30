const STATUS_CONFIG = {
  ongoing: { label: '진행중', className: 'bg-emerald-500/15 text-emerald-400', dot: true },
  upcoming: { label: '예정', className: 'bg-accent/15 text-accent', dot: false },
  ended: { label: '종료', className: 'bg-bg-elevated text-text-tertiary', dot: false },
} as const;

export default function StatusBadge({ status }: { status: 'ongoing' | 'upcoming' | 'ended' }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      {config.dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
      )}
      {config.label}
    </span>
  );
}
