# Tasks: SQL Formatter Tool

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~320–360 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | none |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | SQL formatter component + page + home card | PR 1 | Single PR; tests/docs included |

## Phase 1: Core Formatter Component

- [x] 1.1 Create `src/components/tools/SqlFormatter.astro` with `.tool-panel` layout, `#status-message`, options bar (dialect, indent, keyword case), input/output textareas, and action buttons per the design sketch.
- [x] 1.2 Add the `sql-formatter@15` jsDelivr CDN script and a TypeScript `Window.sqlFormatter` global declaration.
- [x] 1.3 Implement `format()` and `minify()` handlers that read options, call `window.sqlFormatter.format()`, and write the result to `#sql-output`.
- [x] 1.4 Implement `copy()`, `clear()`, and `example()` handlers with Spanish status messages for the spec scenarios.
- [x] 1.5 Add library polling: disable action buttons until `window.sqlFormatter` is available, show a spinner/status, and timeout after 10 s with a Spanish CDN error.

## Phase 2: Page & Home Card

- [x] 2.1 Create `src/pages/tools/sql-formatter.astro` importing `SqlFormatter`, with `Layout` title/description and an SEO prose block matching existing tool pages.
- [x] 2.2 Add a SQL formatter card with `isNew: true` and a database icon to `src/pages/index.astro`.

## Phase 3: Verification

- [x] 3.1 Run `pnpm build` and confirm no TypeScript or static-generation errors.
- [x] 3.2 Manually verify `/tools/sql-formatter` against the spec scenarios: PostgreSQL/4/upper formatting, minify, copy, clear, example, empty-input prompt, invalid-SQL error, and CDN loading state.
