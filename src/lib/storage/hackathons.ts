import { HackathonListItem, HackathonDetail } from '@/types/hackathon';
import { get, KEYS } from './core';

function computeStatus(period: HackathonListItem['period']): HackathonListItem['status'] {
  const now = new Date();
  const end = new Date(period.endAt);
  const start = new Date(period.submissionDeadlineAt);

  // 종료일이 지났으면 ended
  if (now > end) return 'ended';
  // 시작 전이면 upcoming (제출마감 30일 전을 시작으로 간주)
  const startDate = new Date(start.getTime() - 30 * 24 * 60 * 60 * 1000);
  if (now < startDate) return 'upcoming';
  return 'ongoing';
}

export function getHackathons(): HackathonListItem[] {
  const raw = get<HackathonListItem[]>(KEYS.hackathons) ?? [];
  return raw.map(h => ({
    ...h,
    status: computeStatus(h.period),
  }));
}

export function getHackathonDetail(slug: string): HackathonDetail | null {
  const all = get<HackathonDetail[]>(KEYS.details) ?? [];
  return all.find(d => d.slug === slug) ?? null;
}
