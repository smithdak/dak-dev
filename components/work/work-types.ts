export type WorkCategory = 'agent' | 'plugin' | 'product' | 'infrastructure';

export interface WorkRecord {
  id: string;
  name: string;
  description: string;
  url: string;
  repositoryUrl?: string;
  category: WorkCategory;
  date: string;
}

export const WORK_CATEGORY_LABELS: Record<WorkCategory, string> = {
  agent: 'Agent systems',
  plugin: 'Plugins',
  product: 'Products',
  infrastructure: 'Infrastructure',
};

export const WORK_CATEGORY_ORDER: WorkCategory[] = ['infrastructure', 'agent', 'plugin', 'product'];

export function formatWorkDate(value: string) {
  const [year, month] = value.split('-').map(Number);

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function isExternalWorkUrl(value: string) {
  return /^https?:\/\//.test(value);
}
