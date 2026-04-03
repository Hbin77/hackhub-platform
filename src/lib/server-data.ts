import fs from 'fs';
import path from 'path';
import { HackathonListItem, HackathonDetail } from '@/types/hackathon';
import { Leaderboard } from '@/types/leaderboard';
import { Team } from '@/types/team';

function readJson<T>(filename: string): T {
  const filePath = path.join(process.cwd(), 'public', 'data', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function computeStatus(period: HackathonListItem['period']): HackathonListItem['status'] {
  const now = new Date();
  const end = new Date(period.endAt);
  const deadline = new Date(period.submissionDeadlineAt);
  const startDate = new Date(deadline.getTime() - 30 * 24 * 60 * 60 * 1000);

  if (now > end) return 'ended';
  if (now < startDate) return 'upcoming';
  return 'ongoing';
}

export function getHackathonsServer(): HackathonListItem[] {
  const raw = readJson<HackathonListItem[]>('hackathons.json');
  return raw.map(h => ({ ...h, status: computeStatus(h.period) }));
}

export function getHackathonDetailServer(slug: string): HackathonDetail | null {
  const all = readJson<HackathonDetail[]>('hackathon_details.json');
  return all.find(d => d.slug === slug) ?? null;
}

export function getAllHackathonDetailsServer(): HackathonDetail[] {
  return readJson<HackathonDetail[]>('hackathon_details.json');
}

export function getAllLeaderboardsServer(): Leaderboard[] {
  return readJson<Leaderboard[]>('leaderboards.json');
}

export function getSeedTeamsServer(): Team[] {
  return readJson<Team[]>('teams.json');
}

export function getTotalPrizeServer(): number {
  const details = getAllHackathonDetailsServer();
  return details.reduce(
    (sum, d) => sum + d.sections.prize.items.reduce((s, i) => s + i.amountKRW, 0),
    0,
  );
}
