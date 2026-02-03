export const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE_URL ?? "";


export function r2(path: string) {
  if (!R2_BASE) return path;
  return `${R2_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}
