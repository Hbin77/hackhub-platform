import { addSubmission, addLeaderboardEntry } from '@/lib/storage';
import { Submission } from '@/types/submission';
import { LeaderboardEntry } from '@/types/leaderboard';

export function submitAndRegister(
  submission: Omit<Submission, 'id' | 'submittedAt'>,
  leaderboardExtra?: Partial<LeaderboardEntry>,
): void {
  const now = new Date().toISOString();

  addSubmission({
    ...submission,
    id: `sub_${crypto.randomUUID()}`,
    submittedAt: now,
  });

  addLeaderboardEntry(submission.hackathonSlug, {
    rank: 0,
    teamName: submission.teamName,
    score: 0,
    submittedAt: now,
    ...leaderboardExtra,
  });
}
