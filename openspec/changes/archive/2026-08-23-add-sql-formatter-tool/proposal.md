# Proposal: SQL Formatter Tool

## Intent

Add a client-side SQL formatter/beautifier to DevcitoUtils so developers can paste raw or minified SQL and get readable formatted output (or a minified version) without sending data to any server.

## Scope

### In Scope
- New `SqlFormatter.astro` component and `sql-formatter.astro` page following the existing two-file tool pattern.
- Load `sql-formatter` v15 from jsDelivr CDN inside the component, matching the MarkdownPreviewer precedent.
- UI controls: SQL dialect `<select>`, indent-width spinner, keyword-case toggle, and Format / Minify / Clear / Copy / Example buttons.
- Spanish UI copy, page title/description, and SEO prose section.
- Register the tool in `src/pages/index.astro` with `isNew: true`.

### Out of Scope
- Installing `sql-formatter` as an npm dependency (deferred to a follow-up if CDN reliability becomes an issue).
- SQL validation beyond parser errors, execution, schema parsing, parameter binding, or export features.
- Server-side rendering of formatted output.

## Capabilities

### New Capabilities
- `sql-formatter`: Client-side SQL formatting/beautification with dialect selection, indent width, keyword case, and minify/copy helpers.

### Modified Capabilities
- None.

## Approach

Reuse the established Astro/Tailwind tool pattern: a reusable component under `src/components/tools/SqlFormatter.astro` for markup and inline `<script>`, plus a page under `src/pages/tools/sql-formatter.astro` for layout, SEO, and prose.

Load `sql-formatter@15` via `https://cdn.jsdelivr.net/npm/sql-formatter@15/dist/sql-formatter.min.js`, exposing `window.sqlFormatter`. Poll for `window.sqlFormatter` on `DOMContentLoaded` (same strategy used by MarkdownPreviewer for `window.marked`).

Call `window.sqlFormatter.format(sql, { language, tabWidth, keywordCase })` for formatting and `format(sql, { minify: true, ... })` for minification. Wrap calls in `try/catch`; render parser errors in the shared `#status-message` area. Mirror the JSONFormatter button grid and status-message conventions.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/tools/SqlFormatter.astro` | New | Formatter UI, options, and client-side script. |
| `src/pages/tools/sql-formatter.astro` | New | Tool page wrapper, title, description, and SEO prose. |
| `src/pages/index.astro` | Modified | Add one entry to the `tools` array with `isNew: true`. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| CDN unavailable or slow | Low | jsDelivr is reliable; script is loaded only when the tool page is visited. |
| Parse errors on dialect-specific syntax | Medium | Wrap `format()` in `try/catch` and show friendly Spanish error messages. |
| Scope creep into validation/execution | Medium | Explicitly exclude those features in the Out of Scope section. |
| Inconsistent Spanish copy | Low | Reuse labels and button text from existing tools. |

## Rollback Plan

Delete the two new files (`SqlFormatter.astro` and `sql-formatter.astro`) and remove the single entry added to the `tools` array in `src/pages/index.astro`.

## Dependencies

- jsDelivr CDN serving `sql-formatter@15/dist/sql-formatter.min.js`.

## Success Criteria

- [ ] The page renders at `/tools/sql-formatter` and matches the site's visual style.
- [ ] Pasted SQL can be formatted and minified using the selected dialect and options.
- [ ] Invalid SQL surfaces a friendly Spanish error without breaking the UI.
- [ ] The tool appears on the landing page with the "Nuevo" badge.
- [ ] `pnpm build` completes successfully.
