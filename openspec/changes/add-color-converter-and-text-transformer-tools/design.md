# Design: Color Converter and Text Transformer Tools

## Technical Approach

Add two client-side Astro tools following the established `src/components/tools/{Component}.astro` + `src/pages/tools/{slug}.astro` + index-card pattern. Each tool keeps state in the DOM and uses an inline `<script>` with vanilla TypeScript, consistent with the rest of the site. The change is delivered as one PR with a maintainer-approved `size:exception`; commits are split by tool (color converter, text transformer, index wiring) per `work-unit-commits`.

## Architecture Decisions

| Decision | Options | Tradeoffs | Rationale |
|---|---|---|---|
| State storage | Inline DOM + TS variables | No external library; matches existing tools | Keeps bundle small and pattern consistent |
| Color internal model | 8-bit sRGBA `{r,g,b,a}` | Centralizes clamping/rounding; all conversions go through RGBA | Simplest path to support every requested format |
| Color parser strategy | Regex per format, parse from active format | User edits in selected format; picker writes HEX | Reduces ambiguity and matches selector UX |
| Text tokenization | Regex split on separators, case transitions, whitespace | Handles mixed delimiters (`hello-world_test`) | Pure functions can then join tokens reliably |
| Copy pattern | Inline `navigator.clipboard` helper per component | Existing components do the same; no shared module needed | Avoids adding a dependency or extra file |

## Data Flow

```
Color Converter
Picker HEX ──┐
Text input ──┼──→ Parser ──→ RGBA state ──→ Formatter ──→ UI + swatch + clipboard
Format sel ──┘               (clamp/round)

Text Transformer
Textarea input ──→ Tokenizer ──→ Case formatters ──→ Read-only output grid ──→ Clipboard
```

## Component Architecture

- `ColorConverter.astro` — no props, no slots. Markup: a responsive panel with the color picker, live preview swatch, format selector, text input, copy button, and error banner. Client script runs on `DOMContentLoaded`.
- `TextTransformer.astro` — no props, no slots. Markup: input textarea, optional copy-all button, and a responsive grid of read-only output fields with per-case copy buttons.
- `src/pages/tools/color-converter.astro` and `src/pages/tools/text-transformer.astro` — page wrappers importing `Layout`, setting title/description, and rendering the component inside `<main class="flex-grow flex flex-col items-center p-4 sm:p-6 md:p-8">` with the standard centered hero and SEO `prose prose-invert` section.

## State Management

State is held in script-local variables and reflected in DOM elements:

- **Color converter**: `let current = { r: 59, g: 130, b: 246, a: 1 }` plus `format` and `lastValidText`. Inputs update the model; the model drives the swatch, picker, and formatted text.
- **Text transformer**: `const input = document.getElementById(...)` value is the only state. `input` events re-run tokenization and all formatters.

## Color Conversion Design

- **Internal representation**: `{ r, g, b: 0–255; a: 0–1 }`.
- **Parsing**: one regex/function per active format. Whitespace is removed before parsing. Values are clamped immediately.
- **Conversion functions**: `hex ↔ rgb`, `rgb ↔ hsl`, `rgb ↔ hsv`, `rgb ↔ cmyk`. Alpha is passed through unchanged.
- **Formatting**: RGB uses integers; HSL/HSV/CMYK use one-decimal percentages; HEX is uppercase `#RRGGBB` or `#RRGGBBAA` when alpha < 1.
- **Picker sync**: `<input type="color">` only emits HEX. On picker change, parse HEX into RGBA while preserving the current alpha value.
- **Validation**: parse failures show `.tool-error` and keep the last valid swatch/text; empty input falls back to the default color.

## Text Transformation Design

- **Tokenizer**: `/[A-Z]?[a-z]+|[0-9]+|[^A-Za-z0-9\s]+/g` or a manual split that normalizes separators to spaces, then splits on case transitions. The result is an array of lower-cased tokens.
- **Pure formatters** (each maps `tokens: string[]` → `string`):
  - `camelCase`, `PascalCase`, `snake_case`, `kebab-case`, `CONSTANT_CASE`, `dot.case`, `path/case`, `Train-Case`
  - `lower`, `UPPER`, `Title Case`, `Sentence case` operate on the original/normalized string
- **Input normalization**: trim only for tokenization; preserve characters not affected by the active transform (e.g. emojis).
- **Edge cases**: empty input yields empty outputs; `null`/`undefined` are treated as `""`; all work is wrapped so no throw reaches the browser.

## UI Layout

- Reuse `.tool-panel`, `.tool-input`, `.tool-select`, `.tool-textarea`, `.tool-btn`, `.tool-error`, `.tool-output-panel`.
- **Color converter**: `grid grid-cols-1 md:grid-cols-2 gap-6` inside the panel. Picker + swatch on the left; controls on the right.
- **Text transformer**: `tool-textarea` input at full width, then `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4` for outputs.
- Dark mode is the only theme; white text on gray-950 background with accent blue is already the site default. Focus rings come from `.tool-input`/`.tool-select` styles.

## Copy-to-Clipboard

Inline helper in each component:

```ts
function copy(text: string, btn: HTMLButtonElement, doneHtml: string) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.innerHTML;
    btn.innerHTML = doneHtml;
    setTimeout(() => (btn.innerHTML = orig), 2000);
  });
}
```

Failures are silently ignored; the button only activates when there is a value.

## Index Page Changes

- Append two entries to the `tools` array in `src/pages/index.astro` with `title`, `description`, `href: "/tools/{slug}"`, `icon` (inline SVG), and `isNew: true`.
- Add two SVG constants near the existing icon block.
- Add `.grid-stagger > *:nth-child(16)` and `:nth-child(17)` animation-delay rules to keep the stagger consistent.

## File List

| File | Action | Description |
|---|---|---|
| `src/components/tools/ColorConverter.astro` | Create | Picker, preview, format select, input, copy, error banner |
| `src/pages/tools/color-converter.astro` | Create | Page wrapper + SEO content |
| `src/components/tools/TextTransformer.astro` | Create | Input textarea, output grid, copy buttons |
| `src/pages/tools/text-transformer.astro` | Create | Page wrapper + SEO content |
| `src/pages/index.astro` | Modify | Add 2 tool cards, 2 icons, nth-child(16/17) delays |

## Error Boundaries

- Color converter wraps parsing and conversion in `try/catch`; invalid input shows `.tool-error` and does not overwrite the last valid color.
- Text transformer never throws on user input: it coerces `null`/`undefined` to `""`, treats empty input as empty outputs, and uses safe string operations for surrogate pairs and symbols.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Type check | Component scripts and pages | `pnpm build` |
| Manual | Routes render at `/tools/color-converter` and `/tools/text-transformer` | Browser navigation |
| Manual | Color parse/emit round-trips for HEX, RGBA, HSLA, HSVA, CMYKA | Sample values from spec |
| Manual | Text case outputs match spec table | Sample inputs |
| Manual | Copy buttons write correct values | `navigator.clipboard` + UI feedback |
| Visual | Index stagger for cards 16 and 17 | DevTools animation inspection |

## Migration / Rollout

No migration required. Roll out via one PR with `size:exception`; if review load becomes an issue, split into stacked PRs (`feat/color-converter` then `feat/text-transformer`) resolving the trivial `index.astro` conflict after the first merge.

## Open Questions

None.
