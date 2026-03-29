import { Team } from '@/types/team';
import { isSafeUrl } from '@/lib/storage';

interface TeamCardProps {
  team: Team;
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-surface p-5 transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-text">{team.name}</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            team.isOpen
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {team.isOpen ? '모집중' : '모집완료'}
        </span>
      </div>

      <p className="mb-1 text-xs text-text-secondary">{team.hackathonSlug}</p>
      <p className="mb-3 text-sm leading-relaxed text-text-secondary">{team.intro}</p>

      <div className="mb-3 flex items-center gap-3 text-xs text-text-secondary">
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {team.memberCount}명
        </span>
      </div>

      {team.lookingFor.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {team.lookingFor.map(role => (
            <span
              key={role}
              className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              {role}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto">
        {isSafeUrl(team.contact.url) ? (
          <a
            href={team.contact.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover"
          >
            연락하기
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ) : (
          <span className="text-sm text-text-secondary">{team.contact.url}</span>
        )}
      </div>
    </div>
  );
}
