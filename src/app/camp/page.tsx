import { Suspense } from 'react';
import CampContent from '@/components/camp/CampContent';

export default function CampPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-base">
        <div className="mx-auto max-w-6xl px-4 py-10 text-text-secondary">로딩 중...</div>
      </div>
    }>
      <CampContent />
    </Suspense>
  );
}
