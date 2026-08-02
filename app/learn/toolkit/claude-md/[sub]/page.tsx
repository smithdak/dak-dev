import { notFound, permanentRedirect } from 'next/navigation';
import { TOOLKIT_LENSES, isToolkitSubPage } from '@/lib/toolkit-types';

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLKIT_LENSES.map((lens) => ({ sub: lens.slug }));
}

export default async function LegacyClaudeMdLensRedirect({
  params,
}: {
  params: Promise<{ sub: string }>;
}) {
  const { sub } = await params;
  if (!isToolkitSubPage(sub)) notFound();
  permanentRedirect(`/learn/toolkit/project-instructions/${sub}`);
}
