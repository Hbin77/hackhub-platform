import { Submission } from '@/types/submission';
import { get, set, KEYS } from './core';

export function getSubmissions(hackathonSlug?: string): Submission[] {
  const all = get<Submission[]>(KEYS.submissions) ?? [];
  if (!hackathonSlug) return all;
  return all.filter(s => s.hackathonSlug === hackathonSlug);
}

export function addSubmission(submission: Submission): void {
  const subs = get<Submission[]>(KEYS.submissions) ?? [];
  subs.push(submission);
  set(KEYS.submissions, subs);
}
