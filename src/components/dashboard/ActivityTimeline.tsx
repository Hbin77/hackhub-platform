'use client';

import { motion } from 'framer-motion';
import { formatDate } from '@/lib/date';

export interface TimelineEvent {
  id: string;
  type: 'submission' | 'team';
  title: string;
  hackathonSlug: string;
  hackathonName: string;
  date: string;
}

interface ActivityTimelineProps {
  events: TimelineEvent[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function ActivityTimeline({ events }: ActivityTimelineProps) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-text-tertiary">아직 활동 기록이 없습니다.</p>
    );
  }

  return (
    <motion.div
      className="relative ml-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Vertical line */}
      <div className="absolute left-0 top-0 h-full w-px bg-border" />

      {events.map(event => (
        <motion.div
          key={event.id}
          variants={item}
          className="relative mb-6 pl-8 last:mb-0"
        >
          {/* Dot */}
          <div
            className={`absolute left-0 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-bg-surface ${
              event.type === 'submission' ? 'bg-primary' : 'bg-accent'
            }`}
          />

          {/* Card */}
          <div className="rounded-lg border border-border bg-bg-elevated/50 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-bg-surface text-text-secondary">
                {event.type === 'submission' ? '제출' : '팀 생성'}
              </span>
              <span className="text-xs text-text-tertiary">
                {formatDate(event.date)}
              </span>
            </div>
            <p className="text-sm font-medium text-text">{event.title}</p>
            <p className="text-xs text-text-tertiary mt-0.5">{event.hackathonName}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
