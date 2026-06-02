export type Status = '待联系' | '已生成' | '已导出';

export interface Company {
  id: number;
  company_name: string;
  contact: string | null;
  email: string | null;
  region: string;
  customer_type: string;
  source: string;
  search_category: string;
  status: Status;
  created_at: string;
}

export interface Letter {
  id: number;
  company_id: number;
  subject: string;
  body: string;
  created_at: string;
}
