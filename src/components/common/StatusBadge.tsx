const STATUS_CONFIG = {
  ongoing: { label: '진행중', className: 'bg-green-100 text-green-800' },
  upcoming: { label: '예정', className: 'bg-blue-100 text-blue-800' },
  ended: { label: '종료', className: 'bg-gray-100 text-gray-600' },
} as const;

export default function StatusBadge({ status }: { status: 'ongoing' | 'upcoming' | 'ended' }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
