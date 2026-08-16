# Tasks: Color Converter and Text Transformer Tools

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~630 (color ~355, text ~255, index ~20) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: Color converter + index; PR 2: Text transformer |
| Delivery strategy | ask-always |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: size-exception
400-line budget risk: High

Resolved: single PR with `size:exception`. Commits split by tool.

### Work Units

| Unit | Goal | Commit/PR |
|------|------|-----------|
| 1 | Index cards + CSS stagger fix | Commit 1 / PR 1 |
| 2 | Color converter tool | Commit 2 / PR 1 |
| 3 | Text transformer tool | Commit 3 / PR 2 or same PR |
| 4 | Build verification + manual checks | Commit 4 / PR |

## Phase 1: Index Wiring

- [x] 1.1 Add `:nth-child(16)` and `:nth-child(17)` stagger rules (0.85s, 0.9s) to `src/pages/index.astro`. +2.
- [x] 1.2 Add `colorIcon` and `textIcon` SVG constants to `src/pages/index.astro`. +2.
- [x] 1.3 Append Color Converter `ToolCard` (`/tools/color-converter`, `isNew: true`). +7.
- [x] 1.4 Append Text Transformer `ToolCard` (`/tools/text-transformer`, `isNew: true`). +7.
- [x] 1.5 Verify badge reads "17 Herramientas Listas" and grid unchanged.

## Phase 2: Color Converter

- [x] 2.1 Create `src/components/tools/ColorConverter.astro` markup: picker, swatch, selector, input, copy button, error banner. +80.
- [x] 2.2 Implement RGBA model and parsers for HEX, RGB/RGBA, HSL/HSLA, HSV/HSVA, CMYK/CMYKA. +90.
- [x] 2.3 Implement `rgb ↔ hsl`, `rgb ↔ hsv`, `rgb ↔ cmyk` conversions. +70.
- [x] 2.4 Implement formatters and picker sync. +50.
- [x] 2.5 Wire events, inline `copy()` helper, `.tool-error` on parse failure. +65.
- [x] 2.6 Create `src/pages/tools/color-converter.astro` page wrapper with `Layout` and SEO prose. +55.

## Phase 3: Text Transformer

- [x] 3.1 Create `src/components/tools/TextTransformer.astro` markup: textarea, copy-all button, output grid. +60.
- [x] 3.2 Implement tokenizer for whitespace, punctuation, case transitions, separators. +30.
- [x] 3.3 Implement token formatters: camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case, path/case, Train-Case. +45.
- [x] 3.4 Implement string formatters: lower, UPPER, Title Case, Sentence case; add copy-all output. +30.
- [x] 3.5 Wire `input` event and copy helpers; empty input yields empty outputs, no exceptions. +40.
- [x] 3.6 Create `src/pages/tools/text-transformer.astro` page wrapper with `Layout` and SEO prose. +55.

## Phase 4: Verification

- [x] 4.1 Run `pnpm build`; confirm zero errors and `./docs` output.
- [x] 4.2 Verify `/tools/color-converter`: `#3b82f6` → `rgb(59, 130, 246)`; alpha preserved; invalid input shows error; picker drives text.
- [x] 4.3 Verify `/tools/text-transformer`: `hello world` matches spec table; `hello-world_test` tokenizes correctly; emoji preserved; copy buttons work.
- [x] 4.4 Verify index page: 17 cards visible, links route, 16th/17th stagger delays 0.85s/0.9s.

## Rollback Notes

- Revert component + page commits per tool independently.
- Revert `src/pages/index.astro` changes as one unit if needed.
- No database, API, or build-config changes; rollback is file-level only.
