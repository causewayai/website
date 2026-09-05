// Prefixes a site-root path with Astro's configured `base`, so links and
// asset references still work when the site is served from a subpath
// (e.g. the interim GitHub Pages URL causewayai.github.io/website/).
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}
