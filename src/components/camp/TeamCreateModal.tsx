import { useState, useEffect, useRef } from 'react';
import { HackathonListItem } from '@/types/hackathon';
import { Team, ContactType } from '@/types/team';
import { addTeam } from '@/lib/storage';
import { isSafeUrl } from '@/lib/validation';

interface TeamCreateModalProps {
  hackathons: HackathonListItem[];
  onClose: () => void;
  onCreated: () => void;
}

export default function TeamCreateModal({ hackathons, onClose, onCreated }: TeamCreateModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    modalRef.current?.querySelector<HTMLElement>('input')?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  const [hackathonSlug, setHackathonSlug] = useState(hackathons[0]?.slug ?? '');
  const [intro, setIntro] = useState('');
  const [memberCount, setMemberCount] = useState(1);
  const [lookingFor, setLookingFor] = useState('');
  const [contactType, setContactType] = useState<ContactType>('discord');
  const [contactUrl, setContactUrl] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !hackathonSlug || !contactUrl.trim()) return;
    if (!isSafeUrl(contactUrl.trim())) {
      alert('URL은 http:// 또는 https://로 시작해야 합니다.');
      return;
    }

    const team: Team = {
      teamCode: `team-${crypto.randomUUID()}`,
      hackathonSlug,
      name: name.trim(),
      isOpen: true,
      memberCount,
      lookingFor: lookingFor
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      intro: intro.trim(),
      contact: {
        type: contactType,
        url: contactUrl.trim(),
      },
      createdAt: new Date().toISOString(),
    };

    addTeam(team);
    onCreated();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div ref={modalRef} className="w-full max-w-lg rounded-2xl bg-surface p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text">팀 만들기</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text">팀 이름 *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              maxLength={50}
              placeholder="팀 이름을 입력하세요"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text">해커톤 *</label>
            <select
              value={hackathonSlug}
              onChange={e => setHackathonSlug(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {hackathons.map(h => (
                <option key={h.slug} value={h.slug}>{h.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text">팀 소개</label>
            <textarea
              value={intro}
              onChange={e => setIntro(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              maxLength={500}
              placeholder="팀을 소개해주세요"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-text">현재 인원</label>
              <input
                type="number"
                min={1}
                max={10}
                value={memberCount}
                onChange={e => setMemberCount(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">모집 포지션</label>
              <input
                type="text"
                value={lookingFor}
                onChange={e => setLookingFor(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="프론트, 백엔드, 디자인"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-text">연락 수단</label>
              <select
                value={contactType}
                onChange={e => setContactType(e.target.value as ContactType)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="discord">Discord</option>
                <option value="kakao">카카오톡</option>
                <option value="email">이메일</option>
                <option value="other">기타</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-text">연락처 URL *</label>
              <input
                type="text"
                value={contactUrl}
                onChange={e => setContactUrl(e.target.value)}
                required
                maxLength={500}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-elevated"
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              팀 만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
