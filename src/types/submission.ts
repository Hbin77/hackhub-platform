export interface Submission {
  id: string;
  hackathonSlug: string;
  teamName: string;
  artifactType: string;
  fileName?: string;
  url?: string;
  text?: string;
  notes?: string;
  step?: string;
  submittedAt: string;
}
