export function extractDomain(url: string): string {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.startsWith('www.') ? host.slice(4) : host;
  } catch {
    return '';
  }
}

const TITLE_SEPARATORS = ['|', '-', '–', '—', '::', '•'];

export function companyNameFromResult(title: string, url: string): string {
  const cleaned = title.trim();
  if (cleaned) {
    let name = cleaned;
    for (const sep of TITLE_SEPARATORS) {
      const idx = name.indexOf(sep);
      if (idx > 0) name = name.slice(0, idx);
    }
    return name.trim();
  }
  const domain = extractDomain(url);
  const main = domain.split('.')[0] ?? '';
  return main ? main.charAt(0).toUpperCase() + main.slice(1) : '';
}
