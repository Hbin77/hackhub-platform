export interface HackathonListItem {
  slug: string;
  title: string;
  status: 'ended' | 'ongoing' | 'upcoming';
  tags: string[];
  thumbnailUrl: string;
  period: {
    timezone: string;
    submissionDeadlineAt: string;
    endAt: string;
  };
  links: {
    detail: string;
    rules: string;
    faq: string;
  };
}

export interface ScoreBreakdownWeight {
  key: string;
  label: string;
  weightPercent: number;
}

export interface EvalSection {
  metricName: string;
  description: string;
  scoreSource?: 'vote';
  limits?: {
    maxRuntimeSec: number;
    maxSubmissionsPerDay: number;
  };
  scoreDisplay?: {
    label: string;
    breakdown: ScoreBreakdownWeight[];
  };
}

export type ArtifactFormat = 'zip' | 'text' | 'url' | 'web' | 'pdf' | 'pdf_url' | 'text_or_url';

export interface SubmissionItem {
  key: string;
  title: string;
  format: ArtifactFormat;
}

export interface HackathonDetail {
  slug: string;
  title: string;
  sections: {
    overview: {
      summary: string;
      teamPolicy: {
        allowSolo: boolean;
        maxTeamSize: number;
      };
    };
    info: {
      notice: string[];
      links: {
        rules: string;
        faq: string;
      };
    };
    eval: EvalSection;
    schedule: {
      timezone: string;
      milestones: {
        name: string;
        at: string;
      }[];
    };
    prize: {
      items: {
        place: string;
        amountKRW: number;
      }[];
    };
    teams: {
      campEnabled: boolean;
      listUrl: string;
    };
    submit: {
      allowedArtifactTypes: string[];
      submissionUrl: string;
      guide: string[];
      submissionItems?: SubmissionItem[];
    };
    leaderboard: {
      publicLeaderboardUrl: string;
      note: string;
    };
  };
}
