export interface LeaderboardEntry {
  rank: number;
  teamName: string;
  score: number;
  submittedAt: string;
  scoreBreakdown?: {
    participant: number;
    judge: number;
  };
  artifacts?: {
    webUrl: string;
    pdfUrl: string;
    planTitle: string;
  };
}

export interface Leaderboard {
  hackathonSlug: string;
  updatedAt: string;
  entries: LeaderboardEntry[];
}
