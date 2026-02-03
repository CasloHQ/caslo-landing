export const R2_BASE = "https://assets.casloart.com";


export function r2(path: string) {
  if (!R2_BASE) return path;
  return `${R2_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}
