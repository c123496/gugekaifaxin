import type { LetterInput } from './deepseek';

export interface CompanyRowForLetter {
  company_name: string;
  customer_type: string;
  region: string;
}

export function buildLetterInput(row: CompanyRowForLetter, companyProfile: string): LetterInput {
  return {
    companyName: row.company_name,
    customerType: row.customer_type,
    region: row.region,
    companyProfile,
  };
}
