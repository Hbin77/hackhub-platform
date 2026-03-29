import { isSafeUrl } from '@/lib/storage';

interface InfoTabProps {
  info: {
    notice: string[];
    links: {
      rules: string;
      faq: string;
    };
  };
}

export default function InfoTab({ info }: InfoTabProps) {
  const linkItems = [
    { url: info.links.rules, label: '대회 규칙', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { url: info.links.faq, label: 'FAQ', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-lg font-semibold text-text">공지사항</h2>
        <ul className="space-y-3">
          {info.notice.map((item, idx) => (
            <li key={idx} className="flex gap-3 text-sm leading-relaxed text-text-secondary">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-medium text-primary">
                {idx + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-lg font-semibold text-text">참고 링크</h2>
        <div className="flex flex-wrap gap-3">
          {linkItems.map(({ url, label, icon }) =>
            isSafeUrl(url) ? (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-sm font-medium text-text transition-colors hover:border-primary hover:text-primary"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
                {label}
              </a>
            ) : (
              <span key={label} className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-sm font-medium text-text-secondary">
                {label}
              </span>
            )
          )}
        </div>
      </section>
    </div>
  );
}
