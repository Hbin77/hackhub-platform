const PLACE_STYLES: Record<string, { emoji: string; borderColor: string; glowClass: string }> = {
  '1st': { emoji: '🥇', borderColor: 'border-gold', glowClass: 'shadow-[0_0_20px_rgba(255,215,0,0.15)]' },
  '2nd': { emoji: '🥈', borderColor: 'border-silver', glowClass: '' },
  '3rd': { emoji: '🥉', borderColor: 'border-bronze', glowClass: '' },
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
        const style = PLACE_STYLES[item.place];
        return (
          <div
            key={idx}
            className={`flex items-center justify-between rounded-xl border bg-bg-surface p-5 transition-all hover:bg-bg-elevated ${
              style ? `${style.borderColor} ${style.glowClass}` : 'border-border'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {style ? style.emoji : '🏅'}
              </span>
              <span className="text-base font-semibold text-text">{item.place}</span>
            </div>
            <span className="font-display text-xl font-bold text-accent">
              {formatKRW(item.amountKRW)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
