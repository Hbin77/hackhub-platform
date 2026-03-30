'use client';

import { useState } from 'react';
import { submitAndRegister } from '@/lib/submit-service';

interface SingleSubmitFormProps {
  slug: string;
  onSubmitted: () => void;
}

export default function SingleSubmitForm({ slug, onSubmitted }: SingleSubmitFormProps) {
  const [fileName, setFileName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim() || !teamName.trim()) return;

    submitAndRegister({
      hackathonSlug: slug,
      teamName: teamName.trim(),
      artifactType: 'zip',
      fileName: fileName.trim(),
      notes: notes.trim() || undefined,
    });

    setFileName('');
    setNotes('');
    setSubmitting(false);
    onSubmitted();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-surface p-6"
    >
      <h2 className="mb-4 text-lg font-semibold text-text">파일 제출</h2>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">팀 이름</label>
          <input
            type="text"
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            placeholder="팀 이름을 입력하세요"
            maxLength={100}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text placeholder:text-text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">파일명 (.zip)</label>
          <input
            type="text"
            value={fileName}
            onChange={e => setFileName(e.target.value)}
            placeholder="submission.zip"
            maxLength={200}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text placeholder:text-text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">메모 (선택)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="제출에 대한 메모를 남겨주세요"
            rows={3}
            maxLength={1000}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text placeholder:text-text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !fileName.trim() || !teamName.trim()}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? '제출 중...' : '제출하기'}
        </button>
      </div>
    </form>
  );
}
