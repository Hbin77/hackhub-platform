import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section
      className="relative overflow-hidden bg-bg-base px-4 py-24 sm:py-32"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(108,92,231,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 60%, rgba(0,210,255,0.1) 0%, transparent 50%)',
      }}
    >
      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="mb-6 font-display text-4xl font-extrabold tracking-tight text-text sm:text-5xl lg:text-6xl">
          Build. <span className="gradient-text">Compete</span>. Win.
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-text-secondary sm:text-xl leading-relaxed">
          해커톤 참가부터 팀 모집, 리더보드까지 한곳에서 관리하세요.
          <br className="hidden sm:block" />
          당신의 다음 해커톤을 HackHub에서 시작하세요.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/hackathons"
            className="gradient-bg inline-flex items-center gap-2 rounded-lg px-8 py-3 text-base font-semibold text-white transition-transform hover:scale-105"
          >
            해커톤 참가하기
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/hackathons"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-3 text-base font-semibold text-text-secondary transition-colors hover:text-text hover:border-text-secondary"
          >
            둘러보기
          </Link>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 sm:gap-16">
          <div className="text-center">
            <p className="font-display text-3xl font-bold text-text">368</p>
            <p className="mt-1 text-sm text-text-secondary">참가 팀</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="font-display text-3xl font-bold gradient-text">&#8361;10,000,000+</p>
            <p className="mt-1 text-sm text-text-secondary">총 상금</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="font-display text-3xl font-bold text-text">50+</p>
            <p className="mt-1 text-sm text-text-secondary">해커톤 개최</p>
          </div>
        </div>
      </div>
    </section>
  );
}
