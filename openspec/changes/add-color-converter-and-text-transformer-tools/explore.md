# Exploration Report: add-color-converter-and-text-transformer-tools

## status

`explore_complete`

## executive_summary

The codebase is an Astro 6 static site with Tailwind CSS 4 and strict TypeScript. Tools follow a very consistent pattern: a route page under `src/pages/tools/{slug}.astro`, a presentational component under `src/components/tools/{ComponentName}.astro`, and a card entry in `src/pages/index.astro`. Client-side behavior is implemented with inline `<script>` tags using vanilla TypeScript and DOM APIs; no islands, React, Vue, or other UI framework are used. Adding both requested tools will likely exceed the 400-line review budget, so the work should be split into two chained/stacked PRs.

## findings

### 1. Pattern for adding a new tool

The pattern is file-based routing plus manual catalog registration:

1. **Create the tool page** at `src/pages/tools/{slug}.astro`.
   - Imports `Layout` from `../../layouts/Layout.astro`.
   - Imports the tool component from `../../components/tools/{ComponentName}.astro`.
   - Wraps everything in `<main class="flex-grow flex flex-col items-center p-4 sm:p-6 md:p-8">`.
   - Contains a centered `<h1>` + `<p>` hero, the tool component, and an SEO content section with `tool-panel prose prose-invert`.
2. **Create the tool component** at `src/components/tools/{ComponentName}.astro`.
   - Uses the shared CSS component classes (`tool-panel`, `tool-textarea`, `tool-input`, `tool-select`, `tool-btn`, etc.).
   - Adds an inline `<script>` for client-side logic.
3. **Register the card** in `src/pages/index.astro`.
   - Append a new object to the `tools` array with `title`, `description`, `href: "/tools/{slug}"`, `icon` (inline SVG), and optionally `isNew: true`.
   - The card is rendered via `<ToolCard {...tool} />`.
4. **Routing** is handled automatically by Astro's file-based router; no extra route configuration is required.

Example existing slugs:

- `/tools/text-counter` → `src/pages/tools/text-counter.astro` → `TextCounter.astro`
- `/tools/base64` → `src/pages/tools/base64.astro` → `Base64Converter.astro`
- `/tools/json-formatter` → `src/pages/tools/json-formatter.astro` → `JSONFormatter.astro`

### 2. Client-side interactivity

- All interactivity is implemented with inline `<script>` tags inside `.astro` components.
- Scripts use standard DOM APIs (`document.getElementById`, `addEventListener`, etc.) and TypeScript-style casts such as `as HTMLTextAreaElement`.
- Astro bundles these scripts as JavaScript modules for the page; no `client:*` directive or framework island is used.
- State lives in DOM elements (inputs, textareas, counters). There is no external state library.
- UI feedback is done by toggling classes, updating `textContent`, and using `navigator.clipboard` for copy actions.

### 3. Tailwind classes and layout conventions

Page-level layout:

```html
<main class="flex-grow flex flex-col items-center p-4 sm:p-6 md:p-8">
  <div class="text-center mb-12">
    <h1 class="text-4xl md:text-5xl font-bold text-white">...</h1>
    <p class="text-lg text-gray-400 mt-2">...</p>
  </div>
  <div class="w-full"><ToolComponent /></div>
  <div class="mt-16 w-full max-w-5xl"><div class="tool-panel prose prose-invert max-w-none">...</div></div>
</main>
```

Shared component classes (defined in `src/styles/global.css`):

- `.tool-panel` — glass-morphic card (`bg`, `backdrop-blur`, `border-white/8`, `rounded-3xl`, `p-8`, shadow).
- `.tool-label` — uppercase, tracking-wide, muted label.
- `.tool-input`, `.tool-select`, `.tool-textarea` — dark inputs with focus ring using `--accent-primary` (#3b82f6).
- `.tool-btn`, `.tool-btn-primary`, `.tool-btn-success`, `.tool-btn-info`, `.tool-btn-warning`, `.tool-btn-secondary`, `.tool-btn-ghost` — colored action buttons.
- `.tool-stat-card`, `.tool-error`, `.tool-output-panel` — supporting UI blocks.

Layout utilities commonly used inside components:

- `max-w-4xl mx-auto` / `max-w-5xl mx-auto`
- `space-y-6`, `space-y-4`, `space-y-3`
- `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6`
- `flex items-center justify-between`
- `border-t border-white/5`, `border-b border-white/5`

### 4. Color formats to support

The converter should support at least:

- **HEX** — `#RRGGBB` and `#RRGGBBAA` (with/without alpha).
- **RGB** — `rgb(r, g, b)` and `rgba(r, g, b, a)`.
- **HSL** — `hsl(h, s%, l%)` and `hsla(h, s%, l%, a)`.
- **HSV** — `hsv(h, s%, v%)` and `hsva(h, s%, v%, a)`.
- **CMYK** — `cmyk(c%, m%, y%, k%)` and `cmyka(c%, m%, y%, k%, a)`.

UI additions:

- A native `<input type="color">` color picker.
- A text input showing the current color in the selected format.
- A live preview swatch (large colored box).
- Format selector to switch the active input/output format.
- Copy button for the current color string.

### 5. Text case transformations to support

The transformer should apply the following transformations to the input text and display each result:

- `camelCase`
- `PascalCase`
- `snake_case`
- `kebab-case`
- `CONSTANT_CASE` (SCREAMING_SNAKE)
- `lower case`
- `UPPER CASE`
- `Title Case`
- `Sentence case`

Optional extras that fit the same theme and are cheap to add:

- `dot.case`
- `path/case`
- `Train-Case`

UI shape:

- Single textarea for input.
- Grid/list of read-only output textareas/inputs, one per transformation, each with a copy button.
- A "Copiar todo" / copy-all button is a nice-to-have.

### 6. Constraints and gotchas

- **Tailwind CSS v4** is loaded via `@tailwindcss/vite`; `global.css` uses `@import "tailwindcss";`. The `tailwind.config.mjs` exists but the project relies heavily on utility classes in components, so prefer standard Tailwind utilities and the shared custom classes.
- **TypeScript strict** is enabled (`astro/tsconfigs/strict`). Inline script tags must cast DOM elements (e.g., `as HTMLInputElement`) to avoid `Object is possibly null` errors.
- **No test runner** is configured (`package.json` only has `dev`, `build`, `preview`). Verification is limited to `npm run build` and manual testing.
- **Build verification only** — there are no unit/integration tests for tool logic.
- **Static site** — all logic must run client-side in the browser; no API routes are available.
- **Index stagger animation** — `index.astro` currently defines `.grid-stagger > *:nth-child(1)` through `:nth-child(15)`. Adding two tools increases the card count to 17, so `:nth-child(16)` and `:nth-child(17)` animation-delay rules must be added to keep the stagger consistent.
- **Native color picker** styling is browser-dependent; the preview swatch is the primary visual feedback.
- **Branch/PR rules** (from `branch-pr` skill): every PR must link an approved issue, use a `type/*` label, and follow conventional commits.

### 7. Rough line-count forecast

| Deliverable | Estimated lines |
|---|---|
| Color converter component (`src/components/tools/ColorConverter.astro`) | 250–300 |
| Color converter page (`src/pages/tools/color-converter.astro`) | 60–70 |
| Text transformer component (`src/components/tools/TextTransformer.astro`) | 150–200 |
| Text transformer page (`src/pages/tools/text-transformer.astro`) | 60–70 |
| `index.astro` additions (2 cards + icon + nth-child delays) | 15–25 |
| **Total** | **~535–665 new lines** |

This forecast places the combined change well above the 400-line review budget.

### 8. One PR or chained PRs?

**Recommended: split into two PRs.**

- Each tool is independent and self-contained.
- The forecasted total (~535–665 lines) exceeds the 400-line review budget defined by the SDD session and the `chained-pr` skill.
- The session `delivery_strategy` is `ask-always`, so the final strategy should be confirmed with the user.

Suggested split:

1. **PR 1 — Color converter** (`feat/color-converter`): component, page, card entry, index CSS nth-child update.
2. **PR 2 — Text transformer** (`feat/text-transformer`): component, page, card entry.

Both can target `main` independently (stacked PRs) because they only share the `index.astro` catalog, and the second PR will have a trivial conflict on the `tools` array that is easy to resolve after the first merges. Alternatively, a feature-branch chain is overkill here; stacked PRs to `main` are simpler.

## risks

1. **Color conversion math** — incorrect parsing or rounding between HEX/RGB/HSL/HSV/CMYK can produce visibly wrong colors and undermine trust.
2. **Cross-browser color input** — `<input type="color">` returns HEX only, so conversion to/from other formats must be robust.
3. **Index animation overflow** — forgetting to add `:nth-child(16)` and `:nth-child(17)` delays will break the stagger animation for the new cards.
4. **No automated tests** — bugs will only be caught by `npm run build` or manual review; color edge cases (alpha, invalid input) need extra manual verification.
5. **Issue/branch compliance** — `branch-pr` requires an approved linked issue for each PR; this must be created before implementation.

## next_recommended

1. Confirm with the user the chained/stacked PR strategy for the two tools (session `delivery_strategy` is `ask-always`).
2. Create/approve one issue per tool so PRs can link them.
3. Proceed to the `sdd-propose` (or `sdd-spec`) phase for both tools, keeping them as separate change units.
4. When implementing, create branches `feat/color-converter` and `feat/text-transformer` separately.
5. Verify each PR with `npm run build` and manual browser checks before opening.

## skill_resolution

- **branch-pr** — applies. Each PR must link an approved issue, use a `type:*` label, follow the branch naming regex (`feat/description`), and use conventional commits.
- **chained-pr** — applies. Forecasted total exceeds 400 lines; split into two stacked PRs to `main`.
- **work-unit-commits** — applies. Each tool is a self-contained work unit; commits should be behavior-based (e.g., `feat(tools): add color converter`), keeping page SEO content and component logic together.
