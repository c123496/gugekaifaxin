export interface DedupeInput {
  email: string | null;
  companyName: string;
  region: string;
}

export function dedupeKey(input: DedupeInput): string {
  if (input.email && input.email.trim()) {
    return `email:${input.email.trim().toLowerCase()}`;
  }
  return `name:${input.companyName.trim().toLowerCase()}|${input.region.trim().toLowerCase()}`;
}

export function dedupeBatch<T extends DedupeInput>(items: T[], existingKeys: Set<string>): T[] {
  const seen = new Set(existingKeys);
  const out: T[] = [];
  for (const item of items) {
    const key = dedupeKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}
