# Proposal: Color Converter and Text Transformer Tools

## Intent

Add two client-side utilities to devcitoUtils: a color-format converter and a text-case transformer for quick, private, visual conversions.

## Scope

### In Scope
- Color converter at `/tools/color-converter`.
- Text transformer at `/tools/text-transformer`.
- Two index cards + nth-child(16/17) delays.
- Reuse `.tool-*` styles.

### Out of Scope
- Server APIs, persistence, external libraries, frameworks, tests.

## Capabilities

### New Capabilities
- `color-converter`: parse/emit HEX, RGB/RGBA, HSL/HSLA, HSV/HSVA, CMYK/CMYKA; pick, preview, validate, copy.
- `text-transformer`: apply camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, lower, UPPER, Title Case, Sentence case, dot.case, path/case, Train-Case; live update, copy.

### Modified Capabilities
- None.

## Approach

Client-side vanilla TypeScript in inline `<script>` tags, matching existing tools. Internal 8-bit RGBA model feeds parsers/formatters.

## Color Converter Requirements

- **Formats**: HEX, RGB/RGBA, HSL/HSLA, HSV/HSVA, CMYK/CMYKA.
- **Picker**: native `<input type="color">` synced with text input.
- **Preview**: live swatch.
- **UX**: format selector, copy button, invalid-input error state.

## Text Transformer Requirements

- **Cases**: camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, lower, UPPER, Title Case, Sentence case, dot.case, path/case, Train-Case.
- **UX**: single input, live outputs, copy per case, optional copy-all.

## Review Workload Note

Estimated ~535–665 new lines exceed the 400-line budget. Deliver as one PR with maintainer-approved `size:exception`; split commits by tool.

## Implementation Order

1. Color converter component + page.
2. Text transformer component + page.
3. Index cards, icons, and stagger-delay CSS.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `src/components/tools/ColorConverter.astro` | New | Picker, preview, formats, copy. |
| `src/pages/tools/color-converter.astro` | New | Page wrapper + SEO. |
| `src/components/tools/TextTransformer.astro` | New | Input, outputs, copy. |
| `src/pages/tools/text-transformer.astro` | New | Page wrapper + SEO. |
| `src/pages/index.astro` | Modified | Cards, icons, delays. |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Color rounding errors | Med | Clamp; cross-check values. |
| Invalid input crashes UI | Med | Validate; show `.tool-error`. |
| Index stagger breaks | Low | Add `:nth-child(16)` and `:nth-child(17)`. |
| Review fatigue | High | `size:exception`; work-unit commits. |
| No automated tests | Med | `pnpm build` + manual checks. |

## Rollback Plan

Revert the single PR. Only new files and two isolated index entries are added.

## Dependencies

- Approved issue per `branch-pr`.
- Tailwind v4 classes unchanged.

## Success Criteria

- [ ] `pnpm build` passes.
- [ ] Tools reachable at `/tools/color-converter` and `/tools/text-transformer`.
- [ ] Color converter supports all formats with validation and copy.
- [ ] Text transformer produces all cases live with per-result copy.
- [ ] Index shows two new cards with correct stagger animation.
