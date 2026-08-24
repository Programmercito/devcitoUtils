# Exploration Report: add-text-sanitizer-tool

## status

`success`

## executive_summary

The project is an Astro 6 static site with Tailwind CSS 4 and TypeScript. Adding a text sanitizer/cleaner tool fits the established pattern: a page under `src/pages/tools/{slug}.astro`, a component under `src/components/tools/{ComponentName}.astro`, and a manual card entry in `src/pages/index.astro`. Client-side logic is implemented with inline `<script>` tags using vanilla TypeScript and DOM APIs; there are no islands, React, or state libraries. A focused sanitizer that removes/escapes problematic characters and reports what changed is a small-to-medium addition that should stay within the 400-line review budget if scope is kept tight.

## key_findings

### 1. File / component / page conventions

Adding a tool requires three consistent steps:

1. **Create the page** at `src/pages/tools/{slug}.astro`.
   - Import `Layout` from `../../layouts/Layout.astro`.
   - Import the tool component from `../../components/tools/{ComponentName}.astro`.
   - Wrap content in `<main class="flex-grow flex flex-col items-center p-4 sm:p-6 md:p-8">`.
   - Include a centered `<h1>` + `<p>` hero, the component, and an SEO content block using `tool-panel prose prose-invert`.
2. **Create the component** at `src/components/tools/{ComponentName}.astro`.
   - Use the shared CSS design-system classes: `tool-panel`, `tool-textarea`, `tool-input`, `tool-select`, `tool-btn`, `tool-btn-primary`, `tool-btn-ghost`, `tool-error`, `tool-output-panel`, etc.
   - Implement behavior in an inline `<script>` tag with TypeScript casts for DOM elements.
3. **Register the card** in `src/pages/index.astro`.
   - Add an entry to the `tools` array with `title`, `description`, `href: "/tools/{slug}"`, an inline SVG `icon`, and `isNew: true`.
   - If the card count exceeds existing `.grid-stagger > *:nth-child(N)` rules, add the next nth-child delay to keep the stagger animation consistent.

Routing is automatic via Astro's file-based router; no route config is needed.

### 2. Client-side interactivity

- All behavior lives in inline `<script>` tags inside `.astro` components.
- Scripts use standard DOM APIs (`document.getElementById`, `addEventListener`, `textContent`, `classList`) and explicit casts such as `as HTMLTextAreaElement`.
- Astro bundles the scripts as JS modules; no `client:*` directives or framework islands are used.
- State is kept in the DOM (inputs, textareas, counters); there is no shared state library.
- Copy actions use `navigator.clipboard.writeText`, with temporary button-label changes for feedback.

### 3. Tailwind patterns and UI consistency

Page-level pattern:

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

Component-level Tailwind/common classes observed:

- Containers: `max-w-4xl mx-auto`, `max-w-5xl mx-auto`, `max-w-6xl mx-auto`, `tool-panel`.
- Spacing: `space-y-6`, `space-y-4`, `space-y-3`, `gap-6`, `gap-4`.
- Grids: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.
- Forms: `tool-input`, `tool-select`, `tool-textarea`.
- Buttons: `tool-btn tool-btn-primary`, `tool-btn tool-btn-ghost`.
- Feedback: `tool-error`, `tool-success-msg`, `tool-info-msg`.
- Text: `text-sm`, `text-xs`, `text-gray-400`, `text-gray-500`, `font-mono`.

### 4. Tool registration on the landing page

`src/pages/index.astro` contains a static `tools` array. New tools are registered by appending an object and adding an inline SVG icon. The array is rendered with `<ToolCard {...tool} />` inside a searchable grid. No dynamic route list or registry file exists.

### 5. Existing utilities or helpers

There is no shared `src/utils/` folder. Logic is inlined per component. Only `src/data/gitignore-templates.ts` contains reusable data. For the sanitizer, any helper functions (character classification, escaping, detection) should live inside the component's `<script>` tag, following the existing pattern.

### 6. Potential scope boundaries and risks

A text sanitizer can expand quickly. The recommended MVP scope is:

- A large textarea for input and a read-only textarea/output for sanitized text.
- A set of toggleable cleaners:
  - Remove control characters (`\x00`–`\x1F` except whitespace).
  - Remove null bytes (`\x00`).
  - Remove zero-width / non-printable Unicode characters (e.g., zero-width space, BOM).
  - Normalize line endings to `\n`.
  - Trim leading/trailing whitespace and collapse multiple spaces.
- A set of escape modes (mutually exclusive or additive):
  - Escape single/double quotes and backslashes.
  - Escape for JSON string (via `JSON.stringify`).
  - Escape for HTML entities (`<`, `>`, `&`, `"`).
  - Escape for URL (via `encodeURIComponent`).
- A live detection log showing counts and examples of what was removed or escaped, matching the user's request: *"si detecta o limpie algo que diga que limpio y que quito"*.
- Copy and clear actions.

Out of scope for the first iteration:

- Database-specific sanitization (SQL parameterization, prepared statements).
- Full encoding conversion libraries (iconv).
- Stateful undo/redo or diff viewer.

## recommended_scope_and_approach

1. Create `src/components/tools/TextSanitizer.astro` with the input/output layout, option toggles, inline sanitization logic, and a detection log.
2. Create `src/pages/tools/text-sanitizer.astro` importing the component and adding Spanish SEO content.
3. Add a card in `src/pages/index.astro` with an inline SVG icon and, if needed, an additional `.grid-stagger` nth-child delay.
4. Keep the component under ~300 lines by limiting options to the MVP list above.
5. Use pure JS/TS inside an inline `<script>`; no new dependencies.

## risks

1. **Ambiguous "problematic" definition** — what breaks one DB may be valid for another. The UI must label options clearly and not claim universal safety.
2. **Data loss** — removing characters is destructive. Users should see the detection log before copying output.
3. **No automated tests** — logic must be verified manually and via `pnpm build`.
4. **Unicode edge cases** — surrogate pairs, combining characters, and BOM handling need careful regexes.
5. **Review budget** — if the component grows beyond ~350 lines, the change may exceed the 400-line budget and should be split or trimmed.

## line_forecast_and_pr_strategy

| Deliverable | Estimated lines |
|---|---|
| `src/components/tools/TextSanitizer.astro` | 220–300 |
| `src/pages/tools/text-sanitizer.astro` | 55–65 |
| `src/pages/index.astro` (card + icon + nth-child) | 10–20 |
| **Total** | **~285–385** |

A single PR is expected to fit the 400-line budget. If scope expands, split into a core sanitizer PR and a follow-up PR for extra escape modes.

## next_recommended_phase

`sdd-propose`

## skill_resolution

- `sdd-explore` — loaded via `~/.config/opencode/skills/sdd-explore/SKILL.md`.
- `_shared/sdd-phase-common.md` — loaded as required by the phase skill.
- `branch-pr` — reviewed for branch naming and conventional-commit conventions.
- `chained-pr` — reviewed to confirm the change fits within the 400-line budget as a single PR.
