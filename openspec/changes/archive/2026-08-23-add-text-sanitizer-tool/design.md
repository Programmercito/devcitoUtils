# Design: Text Sanitizer Tool

## Technical Approach

Add a single Astro component that encapsulates the text sanitizer UI, state, and transforms. The component uses an inline TypeScript script and vanilla DOM APIs, matching existing tools such as `TextCounter.astro` and `TextTransformer.astro`. Cleaners run in a fixed pipeline order, each counting removed characters; escape modes run once after cleaners and count affected characters. The detection log is derived on every update and rendered into the same component.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|---|---|---|---|
| State management | Plain JS object + DOM reads | Store library, reactive framework | Matches the project's vanilla-JS inline-script pattern; zero dependencies. |
| Cleaner controls | Labeled checkboxes | Toggle switches, buttons | Checkboxes are accessible, compact, and familiar for multi-select options. |
| Escape control | Single `<select>` | Radio group | A select keeps the UI compact next to six cleaner toggles. |
| Pipeline order | Cleaners first, then escape | Escape first, then cleaners | Spec requires cleaners to run before escape modes; removes invisible chars before quoting. |
| Detection log | Derived render, not stored | Stored history | Simpler, live, and fits the 300-350 line component target. |

## Data Flow

```
User input / toggle / select change
        |
        v
  readStateFromDOM()
        |
        v
  sanitize(state) --> run cleaners --> run escape
        |
        v
  renderOutput(text) + renderLog(entries)
```

`readStateFromDOM` reads the input value and every checkbox/select. `sanitize` builds a `Result` with the final text and a `LogEntry[]`. `renderOutput` writes the result to the read-only output textarea; `renderLog` replaces the log list.

## File Changes

| File | Action | Description |
|---|---|---|
| `src/components/tools/TextSanitizer.astro` | Create | UI, cleaners, escape modes, detection log, copy/clear actions. |
| `src/pages/tools/text-sanitizer.astro` | Create | Tool page with hero and Spanish SEO content block. |
| `src/pages/index.astro` | Modify | Add card entry, inline SVG icon, and `.grid-stagger > *:nth-child(21)` delay. |

## Interfaces / Contracts

```ts
type CleanerKey =
  | 'controlChars'
  | 'nullBytes'
  | 'zeroWidth'
  | 'normalizeLines'
  | 'trim'
  | 'collapseWhitespace';

type EscapeMode = 'none' | 'quotes' | 'json' | 'html' | 'url';

interface State {
  input: string;
  cleaners: Record<CleanerKey, boolean>;
  escape: EscapeMode;
}

interface LogEntry {
  key: CleanerKey | EscapeMode;
  label: string;
  count: number;
  example: string;
  type: 'removed' | 'escaped';
}

interface Result {
  output: string;
  log: LogEntry[];
}
```

### Cleaner regex / transforms

| Cleaner | Regex / Transform | Log example |
|---|---|---|
| Control chars | `/[\x00-\x08\x0B\x0C\x0E-\x1F]/g` | `\x02` |
| Null bytes | `/\x00/g` (also counted by control) | `\x00` |
| Zero-width / non-printable | `/[\u200B-\u200D\uFEFF\u202A-\u202E\u2060-\u206F\uFE0E\uFE0F]/g` | `\u200B` |
| Normalize lines | `.replace(/\r\n/g, '\n').replace(/\r/g, '\n')` | `\r\n` |
| Trim | `.trim()` | leading space |
| Collapse whitespace | `.replace(/\s+/g, ' ')` | multiple spaces |

Pipeline order: control chars -> null bytes -> zero-width -> normalize lines -> trim -> collapse whitespace.

### Escape mode implementations

| Mode | Implementation | Log example |
|---|---|---|
| `none` | identity | - |
| `quotes` | `.replace(/[\\"']/g, '\\$&')` | `"` -> `\"` |
| `json` | `JSON.stringify(value).slice(1, -1)` | `"` -> `\"` |
| `html` | manual named-entity map for `< > & "` | `<` -> `&lt;` |
| `url` | `encodeURIComponent(value)` | space -> `%20` |

## UI Layout Sketch

```
max-w-5xl mx-auto
\-- tool-panel space-y-6
    |-- header row (flex justify-between)
    |   |-- tool-label "Texto de entrada"
    |   \-- clear button (tool-btn tool-btn-ghost)
    |-- textarea#input (tool-textarea h-40)
    |-- options grid (grid grid-cols-1 md:grid-cols-2 gap-4)
    |   |-- cleaners column (space-y-3)
    |   |   \-- label + checkbox per cleaner
    |   \-- escape column
    |       \-- select#escape (tool-select)
    |-- action row (flex justify-end gap-3)
    |   \-- copy button (tool-btn tool-btn-primary)
    |-- output label + textarea#output (tool-textarea h-40 read-only)
    \-- detection log (tool-output-panel)
        \-- list of LogEntry rows
```

Each log row shows the label, count, and a monospace example. Empty or zero-count entries are omitted.

## Edge-Case Handling

| Case | Handling |
|---|---|
| Empty input | Output empty; log hidden or shows "No changes detected". |
| No options enabled | Output equals input; log hidden. |
| Only whitespace + trim | Output becomes empty string. |
| Emojis / surrogates | Avoid regexes that split surrogate pairs; Unicode escapes target specific code-point ranges only. |
| Long input (>50 k) | No debounce; regex transforms on 50 k chars run well under 100 ms in modern browsers. |
| Clipboard denied | Wrap `navigator.clipboard.writeText` in `try/catch`; show a temporary `tool-error` message. |
| Escape after cleaners | Always run cleaners first so quotes/backslashes inside removed characters do not affect escape counts. |

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Manual | Spec scenarios: `hello\x02world`, mixed line endings, trim/collapse, JSON escape | Paste samples, assert output and log counts. |
| Manual | Edge cases: empty input, only whitespace, emojis, clipboard denial | Verify no crash and correct output. |
| Build | TypeScript + Astro build | Run `pnpm build`; must pass with zero errors. |
| Visual | Responsive layout | Check mobile/desktop rendering and log readability. |

## Migration / Rollout

No migration required. The change is additive and client-side only.

## Open Questions

None.
