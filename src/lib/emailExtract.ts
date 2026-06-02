const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const JUNK_DOMAINS = ['example.com', 'sentry.io', 'wixpress.com', 'domain.com'];
const JUNK_EXT = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];

export function extractEmails(text: string): string[] {
  const matches = text.match(EMAIL_RE) ?? [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of matches) {
    const email = raw.toLowerCase();
    const domain = email.split('@')[1] ?? '';
    if (JUNK_DOMAINS.includes(domain)) continue;
    if (JUNK_EXT.some((ext) => email.endsWith(ext))) continue;
    if (seen.has(email)) continue;
    seen.add(email);
    out.push(email);
  }
  return out;
}
