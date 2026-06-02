export function checkAccess(provided: string | null, expected: string | undefined): boolean {
  if (!expected) return false;
  return provided === expected;
}
