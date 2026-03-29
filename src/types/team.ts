export type ContactType = 'discord' | 'kakao' | 'email' | 'other';

export interface Team {
  teamCode: string;
  hackathonSlug: string;
  name: string;
  isOpen: boolean;
  memberCount: number;
  lookingFor: string[];
  intro: string;
  contact: {
    type: ContactType;
    url: string;
  };
  createdAt: string;
}
