import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'yyyy.MM.dd HH:mm', { locale: ko });
}

export function formatDateShort(iso: string): string {
  return format(parseISO(iso), 'MM.dd', { locale: ko });
}

export function relativeTime(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: ko });
}

export function isDatePast(iso: string): boolean {
  return isPast(parseISO(iso));
}

export function getDday(iso: string): string {
  const target = parseISO(iso);
  const now = new Date();
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return 'D-Day';
  return `D+${Math.abs(diff)}`;
}
