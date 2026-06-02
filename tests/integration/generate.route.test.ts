import { describe, it, expect } from 'vitest';
import { buildLetterInput } from '@/lib/generatePipeline';

describe('buildLetterInput', () => {
  it('从公司行与卖点资料组装 DeepSeek 输入', () => {
    const input = buildLetterInput(
      { company_name: 'Acme', customer_type: 'PPE', region: '美国' },
      'Jinda profile',
    );
    expect(input).toEqual({
      companyName: 'Acme',
      customerType: 'PPE',
      region: '美国',
      companyProfile: 'Jinda profile',
    });
  });
});
