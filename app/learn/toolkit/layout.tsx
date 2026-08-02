import type { ReactNode } from 'react';
import { LearnSectionShell } from '@/components/learn/LearnSectionShell';
import type { LearnSectionNavigation } from '@/components/learn/LearnNavigationTypes';
import { getToolkitProducts } from '@/lib/toolkit';
import { TOOLKIT_LENSES, TOOLKIT_TOPICS } from '@/lib/toolkit-types';

export default function ToolkitLayout({ children }: { children: ReactNode }) {
  const products = getToolkitProducts();
  const navigation: LearnSectionNavigation = {
    title: 'Capability Index',
    overviewHref: '/learn/toolkit',
    overviewLabel: 'Capability overview',
    utilityItems: products.map((product) => ({
      href: `/learn/toolkit/products/${product.id}`,
      label: `${product.shortName} product view`,
    })),
    items: TOOLKIT_TOPICS.map((topic, index) => ({
      href: `/learn/toolkit/${topic.slug}`,
      label: topic.name,
      marker: String(index + 1).padStart(2, '0'),
      children: TOOLKIT_LENSES.map((lens) => ({
        href: `/learn/toolkit/${topic.slug}/${lens.slug}`,
        label: lens.label,
      })),
    })),
  };

  return <LearnSectionShell navigation={navigation}>{children}</LearnSectionShell>;
}
