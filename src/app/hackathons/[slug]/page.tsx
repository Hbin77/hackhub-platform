import { getHackathonDetailServer, getHackathonsServer } from '@/lib/server-data';
import { notFound } from 'next/navigation';
import DetailPageClient from '@/components/detail/DetailPageClient';

export default async function HackathonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = getHackathonDetailServer(slug);
  const hackathons = getHackathonsServer();
  const listItem = hackathons.find(h => h.slug === slug) ?? null;

  if (!detail) notFound();

  return <DetailPageClient detail={detail} listItem={listItem} slug={slug} />;
}
