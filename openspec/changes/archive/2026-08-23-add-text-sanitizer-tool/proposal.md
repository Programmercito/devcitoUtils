# Proposal: Text Sanitizer Tool

## Intent

Add a client-side text sanitizer that lets users paste "dirty" text, choose cleanup rules, and get safe output plus a report of what was removed or escaped. This addresses failed database inserts caused by control characters, zero-width Unicode, and inconsistent whitespace without claiming to be a database-specific fix.

## Scope

### In Scope
- New `TextSanitizer.astro` component with input/output, toggles, and inline script.
- New page `src/pages/tools/text-sanitizer.astro`.
- Card registration in `src/pages/index.astro` (icon + `nth-child` delay if needed).
- Toggleable cleaners: remove control characters (except whitespace), null bytes, zero-width/non-printable Unicode, normalize line endings to `\n`, trim/collapse whitespace.
- Escape modes: quotes/backslash, JSON stringify, HTML entities, URL encode.
- Live detection log listing counts and example characters removed or escaped.
- Copy and clear actions.

### Out of Scope
- Database-specific sanitization / SQL parameterization.
- Encoding conversion libraries (iconv) or charset detection.
- Undo/redo, diff viewer, or file upload.

## Capabilities

### New Capabilities
- `text-sanitizer`: Paste text, apply configurable cleaners/escapers, view sanitized output and change report.

### Modified Capabilities
- None.

## Approach

Follow the established Astro/Tailwind tool pattern: the page imports the component, and the component holds UI plus inline TypeScript. Use pure DOM APIs and regex-based transforms. Keep all logic inside the component script to match existing utilities. No new dependencies.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/tools/TextSanitizer.astro` | New | UI, toggles, sanitization logic, detection log. |
| `src/pages/tools/text-sanitizer.astro` | New | Tool page with hero and SEO content block. |
| `src/pages/index.astro` | Modified | Add tool card + icon; add `nth-child(21)` delay if needed. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Users assume output is universally DB-safe | Med | Clear labels: "limpia caracteres comunes", not "seguro para SQL". |
| Destructive removal without preview | Med | Detection log visible before copy; show counts and examples. |
| Unicode edge cases (surrogates, BOM) | Med | Test with sample strings; use code-point aware regex ranges. |
| Component exceeds review budget | Med | Limit to MVP cleaners/escapers; forecast ~285–385 lines. |
| No automated tests | Med | Verify manually and via `pnpm build`. |

## Rollback Plan

- Revert the three file changes (component, page, index card + nth-child).
- No data migration needed; no backend or persisted state.

## Dependencies

- Exploration report `sdd/add-text-sanitizer-tool/explore`.
- Existing Astro/Tailwind design system classes.

## Success Criteria

- [ ] Tool renders at `/tools/text-sanitizer`.
- [ ] Pasting text with control/null/zero-width characters reports each category and count.
- [ ] Applying cleaners produces output free of the selected character classes.
- [ ] Escape modes produce valid JSON/HTML/URL strings.
- [ ] `pnpm build` passes with no TypeScript errors.
- [ ] Change stays within the 400-line review budget.
