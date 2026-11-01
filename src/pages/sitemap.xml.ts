import type { APIRoute } from 'astro';
import { canonicalUrl } from '../utils/seo.mjs';

const toolPages = Object.keys(import.meta.glob('./tools/*.astro'))
  .map((path) => `/tools/${path.slice('./tools/'.length, -'.astro'.length)}`)
  .sort();

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Astro site is required to generate the sitemap.');

  const urls = ['/', ...toolPages]
    .map((path) => canonicalUrl(site, path).replace(/&/g, '&amp;'))
    .map((url) => `  <url><loc>${url}</loc></url>`)
    .join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
