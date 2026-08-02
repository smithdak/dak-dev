export interface LearnNavigationItem {
  href: string;
  label: string;
  marker?: string;
  children?: LearnNavigationItem[];
}

export interface LearnSectionNavigation {
  title: string;
  overviewHref: string;
  overviewLabel: string;
  items: LearnNavigationItem[];
  utilityItems?: LearnNavigationItem[];
}
