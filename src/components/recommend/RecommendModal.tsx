'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HackathonListItem } from '@/types/hackathon';
import { getHackathons } from '@/lib/storage';
import StatusBadge from '@/components/common/StatusBadge';

const INTEREST_TAGS = [
  'Frontend', 'Backend', 'ML', 'AI', 'Design',
  'Data', 'Web', 'Mobile', 'Cloud', 'DevOps',
  'Security', 'Blockchain', 'IoT', 'Game', 'NLP',
];

const STORAGE_KEY = 'hp_user_interests';

interface RecommendModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = 'tags' | 'loading' | 'results';

interface MatchedHackathon extends HackathonListItem {
  matchCount: number;
  matchPercent: number;
  matchedTags: string[];
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export default function RecommendModal({ open, onClose }: RecommendModalProps) {
  const [step, setStep] = useState<Step>('tags');
  const [direction, setDirection] = useState(1);
  const [selected, setSelected] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [results, setResults] = useState<MatchedHackathon[]>([]);

  const toggleTag = useCallback((tag: string) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const handleAnalyze = useCallback(() => {
    if (selected.length === 0) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    setDirection(1);
    setStep('loading');

    setTimeout(() => {
      const hackathons = getHackathons();
      const lowerSelected = selected.map((s) => s.toLowerCase());

      const matched: MatchedHackathon[] = hackathons
        .map((h) => {
          const lowerTags = h.tags.map((t) => t.toLowerCase());
          const matchedTags = selected.filter((s) =>
            lowerTags.some(
              (lt) => lt.includes(s.toLowerCase()) || s.toLowerCase().includes(lt)
            )
          );
          const matchCount = matchedTags.length;
          const matchPercent = Math.round((matchCount / lowerSelected.length) * 100);
          return { ...h, matchCount, matchPercent, matchedTags };
        })
        .filter((h) => h.matchCount > 0)
        .sort((a, b) => b.matchPercent - a.matchPercent || b.matchCount - a.matchCount);

      setResults(matched);
      setDirection(1);
      setStep('results');
    }, 400);
  }, [selected]);

  const handleBack = useCallback(() => {
    setDirection(-1);
    setStep('tags');
  }, []);

  useEffect(() => {
    if (open) {
      setStep('tags');
      setDirection(1);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-bg-surface shadow-lg"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-lg font-bold text-text">
            {step === 'tags' && '관심 분야 선택'}
            {step === 'loading' && '매칭 분석 중'}
            {step === 'results' && '추천 결과'}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-elevated hover:text-text transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="relative min-h-[360px] overflow-hidden px-6 py-5">
          <AnimatePresence custom={direction} mode="wait">
            {step === 'tags' && (
              <motion.div
                key="tags"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <p className="mb-4 text-sm text-text-secondary">
                  관심있는 분야를 선택하면 태그 매칭으로 해커톤을 추천해드립니다.
                </p>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_TAGS.map((tag) => {
                    const isSelected = selected.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-primary/15 text-primary border border-primary/30'
                            : 'bg-bg-elevated text-text-secondary border border-transparent hover:border-border-hover'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleAnalyze}
                    disabled={selected.length === 0}
                    className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    분석하기 ({selected.length}개 선택)
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'loading' && (
              <motion.div
                key="loading"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <div className="mb-4 flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-3 w-3 rounded-full bg-primary"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <p className="text-sm font-medium text-text-secondary">
                  매칭 분석 중...
                </p>
              </motion.div>
            )}

            {step === 'results' && (
              <motion.div
                key="results"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 text-sm text-text-secondary hover:text-text transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    다시 선택
                  </button>
                  <span className="text-xs text-text-tertiary">
                    {results.length}개 매칭
                  </span>
                </div>

                {results.length === 0 ? (
                  <div className="py-12 text-center text-sm text-text-secondary">
                    매칭되는 해커톤이 없습니다. 다른 태그를 선택해보세요.
                  </div>
                ) : (
                  <div className="max-h-[280px] space-y-3 overflow-y-auto pr-1">
                    {results.map((h) => (
                      <div
                        key={h.slug}
                        className="rounded-xl border border-border bg-bg-elevated p-4 transition-colors hover:border-border-hover"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <StatusBadge status={h.status} />
                            <h3 className="text-sm font-semibold text-text line-clamp-1">
                              {h.title}
                            </h3>
                          </div>
                          <span
                            className={`text-xs font-bold ${
                              h.matchPercent > 70 ? 'gradient-text' : 'text-text-secondary'
                            }`}
                          >
                            {h.matchPercent}% 매칭
                          </span>
                        </div>
                        <div className="mb-3 flex flex-wrap gap-1.5">
                          {h.tags.map((tag) => {
                            const isMatch = h.matchedTags.some(
                              (mt) =>
                                tag.toLowerCase().includes(mt.toLowerCase()) ||
                                mt.toLowerCase().includes(tag.toLowerCase())
                            );
                            return (
                              <span
                                key={tag}
                                className={`rounded-md px-2 py-0.5 text-xs ${
                                  isMatch
                                    ? 'bg-primary/15 text-primary font-medium'
                                    : 'bg-bg-surface text-text-tertiary'
                                }`}
                              >
                                {tag}
                              </span>
                            );
                          })}
                        </div>
                        <a
                          href={h.links.detail.startsWith('/') ? h.links.detail : '#'}
                          className="text-xs font-medium text-accent hover:text-accent-hover transition-colors"
                        >
                          자세히 보기 &rarr;
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
