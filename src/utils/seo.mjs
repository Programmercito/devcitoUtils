/**
 * @param {URL} site
 * @param {string} pathname
 */
export function canonicalUrl(site, pathname) {
  const url = new URL(pathname, site);
  url.pathname = url.pathname.replace(/\/index\.html$/, '/').replace(/\/?$/, '/');
  url.search = '';
  url.hash = '';
  return url.href;
}
