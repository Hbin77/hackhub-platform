import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-primary px-4 py-20 text-white sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-90" />
      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          HackHub
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80 sm:text-xl">
          해커톤 참가부터 팀 모집, 리더보드까지 한곳에서 관리하세요.
          <br className="hidden sm:block" />
          당신의 다음 해커톤을 HackHub에서 시작하세요.
        </p>
        <Link
          href="/hackathons"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 text-base font-semibold text-primary shadow-lg transition-transform hover:scale-105"
        >
          해커톤 둘러보기
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
