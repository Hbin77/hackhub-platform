'use client';

import { useState, useEffect } from 'react';
import { SubmissionItem } from '@/types/hackathon';
import { getSubmissions } from '@/lib/storage';
import { Submission } from '@/types/submission';
import SingleSubmitForm from '@/components/detail/submit/SingleSubmitForm';
import MultiStepSubmitForm from '@/components/detail/submit/MultiStepSubmitForm';
import SubmissionHistory from '@/components/detail/submit/SubmissionHistory';

interface SubmitTabProps {
  slug: string;
  submit: {
    allowedArtifactTypes: string[];
    submissionUrl: string;
    guide: string[];
    submissionItems?: SubmissionItem[];
  };
}

export default function SubmitTab({ slug, submit }: SubmitTabProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setSubmissions(getSubmissions(slug));
  }, [slug, refreshKey]);

  const onSubmitted = () => {
    setRefreshKey(k => k + 1);
  };

  const isZipOnly =
    submit.allowedArtifactTypes.length === 1 &&
    submit.allowedArtifactTypes[0] === 'zip';

  return (
    <div className="space-y-6">
      {submit.guide.length > 0 && (
        <section className="rounded-xl border border-border bg-bg-surface p-6">
          <h2 className="mb-3 text-lg font-semibold text-text">제출 가이드</h2>
          <ul className="space-y-2 text-sm text-text-secondary">
            {submit.guide.map((g, i) => (
              <li key={i} className="flex gap-2">
                <span className="shrink-0 text-primary">*</span>
                {g}
              </li>
            ))}
          </ul>
        </section>
      )}

      {isZipOnly ? (
        <SingleSubmitForm slug={slug} onSubmitted={onSubmitted} />
      ) : submit.submissionItems ? (
        <MultiStepSubmitForm
          slug={slug}
          items={submit.submissionItems}
          onSubmitted={onSubmitted}
        />
      ) : (
        <SingleSubmitForm slug={slug} onSubmitted={onSubmitted} />
      )}

      <SubmissionHistory submissions={submissions} />
    </div>
  );
}
