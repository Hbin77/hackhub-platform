import { HackathonListItem, HackathonDetail } from '@/types/hackathon';
import { get, KEYS } from './core';

export function getHackathons(): HackathonListItem[] {
  return get<HackathonListItem[]>(KEYS.hackathons) ?? [];
}

export function getHackathonDetail(slug: string): HackathonDetail | null {
  const all = get<HackathonDetail[]>(KEYS.details) ?? [];
  return all.find(d => d.slug === slug) ?? null;
}
