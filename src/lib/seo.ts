export const siteUrl = import.meta.env["VITE_SITE_URL"] ?? "http://localhost:8080";

export function canonicalUrl(path: string) {
  return `${siteUrl}${path}`;
}
