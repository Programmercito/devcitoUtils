# Tasks: Text Sanitizer Tool

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~405 (component ~320 + page ~70 + index ~15) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: component + tool page → PR 2: index card integration |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Add `TextSanitizer.astro` and `pages/tools/text-sanitizer.astro` | PR 1 | Tool is fully usable standalone; targets `main` |
| 2 | Add catalog card and grid stagger delay in `index.astro` | PR 2 | Depends on PR 1; small integration slice |

## Phase 1: Foundation

- [x] 1.1 Create `src/components/tools/TextSanitizer.astro` with TypeScript types `CleanerKey`, `EscapeMode`, `State`, `LogEntry`, `Result` and DOM element refs. **AC:** File compiles and types match the design contract.
- [x] 1.2 Add empty layout skeleton using `tool-panel`, `tool-textarea`, and placeholder controls. **AC:** Component renders without JS errors in a browser preview.

## Phase 2: Core Sanitization Logic

- [x] 2.1 Implement the six cleaner functions returning `{ text, count, example }` in the fixed pipeline order. **AC:** `hello\x02world` with control-chars enabled produces `helloworld` and logs 1 removed character.
- [x] 2.2 Implement the five escape-mode functions (`none`, `quotes`, `json`, `html`, `url`) returning count/example. **AC:** JSON escape of `line"one\nline"two` yields `line\"one\\nline\"two`.
- [x] 2.3 Build `sanitize(state)` to run cleaners then escape and produce a `Result` with `LogEntry[]`. **AC:** Combined mode logs each category separately with correct counts and examples.

## Phase 3: UI Wiring & Actions

- [x] 3.1 Build cleaner checkboxes, escape `<select>`, input/output textareas, and log panel markup. **AC:** All controls use existing `tool-*` classes and each checkbox/select has an associated label.
- [x] 3.2 Wire `input`, checkbox, and select events to `readStateFromDOM` → `sanitize` → render output and log. **AC:** Live update completes in under 100 ms for a 50 k-character input.
- [x] 3.3 Implement the copy button using `navigator.clipboard.writeText` with temporary success feedback and graceful denial handling. **AC:** Click copies output; denial shows a non-blocking error message.
- [x] 3.4 Implement the clear button that resets input, output, and detection log. **AC:** Click leaves all three areas empty.

## Phase 4: Page & Catalog Integration

- [x] 4.1 Create `src/pages/tools/text-sanitizer.astro` with hero heading, `<TextSanitizer />`, and Spanish SEO content block. **AC:** Page is reachable at `/tools/text-sanitizer` and follows the existing tool-page layout.
- [x] 4.2 Add tool card entry, inline SVG icon, and `.grid-stagger > *:nth-child(21)` delay in `src/pages/index.astro`. **AC:** Card appears in the catalog, links to the new page, and animates with the correct stagger delay.

## Phase 5: Verification

- [x] 5.1 Run `pnpm build` and fix any TypeScript/Astro errors. **AC:** Build exits with code 0.
- [x] 5.2 Manually verify spec scenarios and edge cases: empty input, only whitespace, emojis, clipboard denial, and >50 k input. **AC:** All scenarios from the spec produce the expected output and log.
