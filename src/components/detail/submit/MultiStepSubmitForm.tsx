'use client';

import { useState } from 'react';
import { SubmissionItem } from '@/types/hackathon';
import { addSubmission, addLeaderboardEntry } from '@/lib/storage';
import { isSafeUrl } from '@/lib/validation';

interface MultiStepSubmitFormProps {
  slug: string;
  items: SubmissionItem[];
  onSubmitted: () => void;
}

export default function MultiStepSubmitForm({ slug, items, onSubmitted }: MultiStepSubmitFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [teamName, setTeamName] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const currentItem = items[currentStep];
  const isLastStep = currentStep === items.length - 1;

  const updateValue = (key: string, val: string) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  const handleNext = () => {
    if (currentStep < items.length - 1) {
      setCurrentStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    setSubmitting(true);

    items.forEach(item => {
      const val = values[item.key] ?? '';
      if (!val.trim()) return;

      const isUrl = ['url', 'web', 'pdf_url'].includes(item.format);
      if (isUrl && !isSafeUrl(val.trim())) return;
      addSubmission({
        id: `sub_${crypto.randomUUID()}`,
        hackathonSlug: slug,
        teamName: teamName.trim(),
        artifactType: item.format,
        ...(isUrl ? { url: val.trim() } : { text: val.trim() }),
        step: item.key,
        submittedAt: new Date().toISOString(),
      });
    });

    addLeaderboardEntry(slug, {
      rank: 0,
      teamName: teamName.trim(),
      score: 0,
      submittedAt: new Date().toISOString(),
      artifacts: {
        webUrl: values['web'] ?? '',
        pdfUrl: values['pdf'] ?? '',
        planTitle: values['plan']?.slice(0, 50) ?? '',
      },
    });

    setValues({});
    setTeamName('');
    setCurrentStep(0);
    setSubmitting(false);
    onSubmitted();
  };

  const renderInput = (item: SubmissionItem) => {
    const value = values[item.key] ?? '';

    if (['url', 'web', 'pdf', 'pdf_url'].includes(item.format)) {
      return (
        <input
          type="url"
          value={value}
          onChange={e => updateValue(item.key, e.target.value)}
          placeholder={`${item.title} URL을 입력하세요`}
          className="w-full rounded-lg border border-border bg-bg-elevated px-3 py-2.5 text-sm text-text placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      );
    }

    return (
      <textarea
        value={value}
        onChange={e => updateValue(item.key, e.target.value)}
        placeholder={`${item.title} 내용을 입력하세요`}
        rows={5}
        className="w-full rounded-lg border border-border bg-bg-elevated px-3 py-2.5 text-sm text-text placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
      />
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-bg-surface p-6"
    >
      <h2 className="mb-4 text-lg font-semibold text-text">단계별 제출</h2>

      {/* Step indicators */}
      <div className="mb-6 flex items-center gap-2">
        {items.map((item, idx) => (
          <div key={item.key} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentStep(idx)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg font-display text-xs font-bold transition-all ${
                idx === currentStep
                  ? 'gradient-bg text-white shadow-[0_0_12px_rgba(108,92,231,0.3)]'
                  : idx < currentStep
                    ? 'bg-success/15 text-success'
                    : 'bg-bg-elevated text-text-secondary'
              }`}
            >
              {idx + 1}
            </button>
            {idx < items.length - 1 && (
              <div className={`h-0.5 w-6 rounded-full ${idx < currentStep ? 'bg-success' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {currentStep === 0 && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">팀 이름</label>
            <input
              type="text"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              placeholder="팀 이름을 입력하세요"
              maxLength={100}
              className="w-full rounded-lg border border-border bg-bg-elevated px-3 py-2.5 text-sm text-text placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">
            {currentItem.title}
            <span className="ml-2 text-xs font-normal text-text-tertiary">({currentItem.format})</span>
          </label>
          {renderInput(currentItem)}
        </div>

        <div className="flex gap-3 pt-2">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="rounded-lg border border-border bg-bg-elevated px-4 py-2.5 text-sm font-medium text-text transition-colors hover:border-border-hover"
            >
              이전
            </button>
          )}

          {!isLastStep ? (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              다음
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting || !teamName.trim()}
              className="ml-auto rounded-lg gradient-bg px-4 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? '제출 중...' : '전체 제출하기'}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
