export type CategoryId =
  | 'hiviz' | 'ppe' | 'roadwork' | 'workwear' | 'industrial' | 'contractor' | 'police';

export interface Category {
  id: CategoryId;
  label: string;
  queryTemplate: string;
}

export interface Region {
  id: string;
  label: string;
  english: string;
}

export const REGIONS: Region[] = [
  { id: 'us', label: '美国', english: 'United States' },
  { id: 'ca', label: '加拿大', english: 'Canada' },
  { id: 'uk', label: '英国', english: 'United Kingdom' },
  { id: 'de', label: '德国', english: 'Germany' },
  { id: 'au', label: '澳大利亚', english: 'Australia' },
  { id: 'eu', label: '欧洲其他', english: 'Europe' },
];

export const CATEGORIES: Category[] = [
  { id: 'hiviz', label: '高可视安全服 / 反光装备分销商', queryTemplate: 'high visibility reflective safety apparel distributor {region}' },
  { id: 'ppe', label: 'PPE / 劳保安全用品分销商', queryTemplate: 'PPE safety supply distributor wholesale {region}' },
  { id: 'roadwork', label: '道路 / 工地 / 市政安全用品商', queryTemplate: 'road work traffic municipal safety equipment supplier {region}' },
  { id: 'workwear', label: '工装 / 制服分销商', queryTemplate: 'workwear uniform distributor importer {region}' },
  { id: 'industrial', label: '工业安全 / 安全设备商', queryTemplate: 'industrial safety equipment supplier distributor {region}' },
  { id: 'contractor', label: '建筑总承包商采购部', queryTemplate: 'construction general contractor procurement purchasing {region}' },
  { id: 'police', label: '警用 / 安防装备分销商', queryTemplate: 'police municipal public safety gear distributor {region}' },
];

export function buildQuery(categoryId: CategoryId, regionId: string): string {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) throw new Error(`未知分类: ${categoryId}`);
  const region = REGIONS.find((r) => r.id === regionId);
  const english = region ? region.english : 'United States';
  return category.queryTemplate.replace('{region}', english);
}
