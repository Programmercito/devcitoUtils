import { after, before, test } from 'node:test';
import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { canonicalUrl } from '../src/utils/seo.mjs';

const site = new URL('https://tools.devcito.org/');
let output;

before(() => {
  output = mkdtempSync(join(tmpdir(), 'devcito-seo-test-'));
  const build = spawnSync(process.execPath, [
    resolve('node_modules', 'astro', 'bin', 'astro.mjs'),
    'build',
    '--outDir',
    output,
  ], { encoding: 'utf8', timeout: 120000 });
  assert.equal(build.status, 0, `Build failed:\n${build.stdout}\n${build.stderr}`);
});

after(() => {
  if (output) rmSync(output, { recursive: true, force: true });
});

test('canonical URLs use the configured origin and exclude query strings and fragments', () => {
  assert.equal(canonicalUrl(site, '/tools/base64?x=1#test'), 'https://tools.devcito.org/tools/base64/');
  assert.equal(canonicalUrl(site, '/tools/base64/index.html'), 'https://tools.devcito.org/tools/base64/');
  assert.equal(canonicalUrl(site, '/'), site.href);
});

test('sitemap, robots and deployment files cover the generated pages', () => {
  const slugs = readdirSync(resolve('src', 'pages', 'tools'))
    .filter((name) => name.endsWith('.astro'))
    .map((name) => name.slice(0, -'.astro'.length))
    .sort();
  const urls = [site.href, ...slugs.map((slug) => new URL(`tools/${slug}/`, site).href)];
  const sitemap = readFileSync(join(output, 'sitemap.xml'), 'utf8');
  assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]), urls);
  assert.match(readFileSync(join(output, 'robots.txt'), 'utf8'), /Sitemap: https:\/\/tools\.devcito\.org\/sitemap\.xml/);
  assert.equal(readFileSync(join(output, 'CNAME'), 'utf8').trim(), site.hostname);
  assert.ok(readFileSync(join(output, '.nojekyll')));

  const png = readFileSync(join(output, 'social-card.png'));
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});

test('every page emits consistent metadata and valid structured data', () => {
  const slugs = readdirSync(resolve('src', 'pages', 'tools'))
    .filter((name) => name.endsWith('.astro'))
    .map((name) => name.slice(0, -'.astro'.length));
  const pages = ['', ...slugs.map((slug) => `tools/${slug}/`)];
  const titles = new Set();
  const descriptions = new Set();

  for (const page of pages) {
    const html = readFileSync(join(output, page, 'index.html'), 'utf8');
    const url = new URL(page, site).href;
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    assert.ok(title, `Missing title: ${page}`);
    assert.ok(description, `Missing description: ${page}`);
    titles.add(title);
    descriptions.add(description);
    assert.ok(html.includes(`<link rel="canonical" href="${url}">`), page);
    assert.ok(html.includes(`<meta property="og:url" content="${url}">`), page);
    assert.ok(html.includes(`<meta property="og:image" content="${site.href}social-card.png">`), page);
    const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    assert.ok(json, `Missing JSON-LD: ${page}`);
    const graph = JSON.parse(json)['@graph'];
    assert.ok(graph.some((item) => item['@type'] === 'WebSite' && item.url === site.href), page);
    assert.ok(graph.some((item) => item['@type'] === 'WebPage' && item.url === url), page);
    if (page) {
      assert.ok(graph.some((item) => item['@type'] === 'WebApplication' && item.url === url), page);
      assert.ok(graph.some((item) => item['@type'] === 'BreadcrumbList' && item.itemListElement[1].item === url), page);
      assert.match(html, /aria-label="Ruta de navegación"/);
    } else {
      for (const slug of slugs) assert.ok(html.includes(`href="/tools/${slug}/"`), slug);
    }
  }
  assert.equal(titles.size, pages.length);
  assert.equal(descriptions.size, pages.length);
});
