const PLACE_ICONS: Record<string, { emoji: string; color: string }> = {
  '1st': { emoji: '🥇', color: 'text-yellow-500' },
  '2nd': { emoji: '🥈', color: 'text-gray-400' },
  '3rd': { emoji: '🥉', color: 'text-amber-600' },
};

function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
}

interface PrizeTabProps {
  items: {
    place: string;
    amountKRW: number;
  }[];
}

export default function PrizeTab({ items }: PrizeTabProps) {
  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const icon = PLACE_ICONS[item.place];
        return (
          <div
            key={idx}
            className="flex items-center justify-between rounded-xl border border-border bg-surface p-5 transition-shadow hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {icon ? icon.emoji : '🏅'}
              </span>
              <span className="text-base font-semibold text-text">{item.place}</span>
            </div>
            <span className="text-lg font-bold text-primary">
              {formatKRW(item.amountKRW)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
