export interface LetterInput {
  companyName: string;
  customerType: string;
  region: string;
  companyProfile: string;
}

export interface GeneratedLetter {
  subject: string;
  body: string;
}

export function buildLetterPrompt(input: LetterInput): { system: string; user: string } {
  const system = [
    'You are an expert B2B export sales copywriter for a Chinese reflective safety apparel manufacturer.',
    'Write concise, professional cold outreach emails in natural English (avoid obvious AI tone and exaggeration).',
    'Never claim third-party certification the company does not hold; you may say "can manufacture to ANSI/CE standards".',
    'Respond ONLY with a JSON object: {"subject": string, "body": string}. No markdown, no extra text.',
  ].join(' ');

  const user = [
    `Target company: ${input.companyName}`,
    `Customer type: ${input.customerType}`,
    `Region: ${input.region}`,
    '',
    'Our company (the sender) selling points:',
    input.companyProfile,
    '',
    'Write a personalized cold email to this company\'s procurement/purchasing contact.',
    'Emphasize factory-direct pricing, big-client credibility (Costco, Huawei), capacity, and fit for 1,000+ pcs wholesale orders.',
    'Include a clear call to action (request a quote / product catalog). End with a signature placeholder for the sender.',
  ].join('\n');

  return { system, user };
}

export async function generateLetter(input: LetterInput, apiKey: string): Promise<GeneratedLetter> {
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  const { system, user } = buildLetterPrompt(input);
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`DeepSeek 请求失败 (${res.status}): ${detail}`);
  }
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content ?? '';
  let parsed: GeneratedLetter;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`DeepSeek 返回非 JSON: ${content.slice(0, 200)}`);
  }
  return { subject: parsed.subject ?? '', body: parsed.body ?? '' };
}
