import { Team } from '@/types/team';
import { get, set, KEYS } from './core';

export function getTeams(hackathonSlug?: string): Team[] {
  const all = get<Team[]>(KEYS.teams) ?? [];
  if (!hackathonSlug) return all;
  return all.filter(t => t.hackathonSlug === hackathonSlug);
}

export function addTeam(team: Team): void {
  const all = getTeams();
  all.push(team);
  set(KEYS.teams, all);
}
