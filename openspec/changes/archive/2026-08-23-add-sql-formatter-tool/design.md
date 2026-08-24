# Design: SQL Formatter Tool

## Technical Approach

Add a client-side SQL formatter that follows the established two-file Astro tool pattern: a reusable `SqlFormatter.astro` component for the interactive UI and inline script, plus a `sql-formatter.astro` page for layout, SEO, and prose. The library loads from jsDelivr at runtime and is polled for availability before enabling actions, mirroring the `MarkdownPreviewer`/`marked` precedent.

## Architecture Decisions

| Decision | Option | Tradeoff | Rationale |
|---|---|---|---|
| Library delivery | jsDelivr CDN | No npm install, keeps build small; dependent on CDN uptime | Matches `MarkdownPreviewer` and avoids scope creep from adding an npm dependency. |
| Component split | Component + page | Reuses existing pattern; slightly more files than a single page | Consistent with every other tool in `src/components/tools` and `src/pages/tools`. |
| State management | DOM-only | Simple for a single-tool page; no shared state needed | All inputs/outputs live in the same component; no external store required. |
| Output target | Read-only `<textarea>` | Easy copy/select; no syntax-highlighting complexity | Consistent with `JSONFormatter` and avoids rendering parser output as HTML. |
| Dialect list | All v15 dialects from `sql-formatter` | Long select list; covers every user need | The spec requires all dialects; default `sql`. |

## Data Flow

```
User paste / option change
        │
        ▼
┌─────────────────────┐
│  SqlFormatter.astro │
│  (DOM inputs)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐     missing      ┌─────────────┐
│ window.sqlFormatter │ ────────────────▶ │ poll + spinner/disable
│  (jsDelivr CDN)     │
└──────────┬──────────┘
           │ ready
           ▼
┌─────────────────────┐
│ format() / minify() │
│ try/catch wrapper   │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
 success      error
    │             │
    ▼             ▼
 output      #status-message
 textarea    (Spanish text)
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/components/tools/SqlFormatter.astro` | Create | Formatter UI, options bar, action buttons, inline script, CDN load. |
| `src/pages/tools/sql-formatter.astro` | Create | Page wrapper, title/description, SEO prose block. |
| `src/pages/index.astro` | Modify | Add one `tools` entry with `isNew: true`. |

## Interfaces / Contracts

```typescript
// Runtime global exposed by the CDN script
declare global {
  interface Window {
    sqlFormatter?: {
      format: (sql: string, opts: {
        language?: string;
        tabWidth?: number;
        keywordCase?: 'upper' | 'lower' | 'preserve';
        minify?: boolean;
      }) => string;
    };
  }
}
```

## UI Layout Sketch

```astro
<div class="max-w-5xl mx-auto">
  <div class="tool-panel space-y-6">
    <div id="status-message" class="min-h-[1.5rem] text-center text-sm font-semibold"></div>

    <!-- Options bar -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label class="tool-label" for="dialect">Dialecto</label>
        <select id="dialect" class="tool-select">...</select>
      </div>
      <div>
        <label class="tool-label" for="indent">Indentación</label>
        <input id="indent" type="number" min="1" max="8" value="2" class="tool-input" />
      </div>
      <div>
        <label class="tool-label" for="keyword-case">Mayúsculas/minúsculas</label>
        <select id="keyword-case" class="tool-select">...</select>
      </div>
    </div>

    <!-- Input / Output -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label for="sql-input" class="tool-label">SQL de entrada</label>
        <textarea id="sql-input" rows="16" class="tool-textarea" placeholder="Pegá tu SQL aquí..."></textarea>
      </div>
      <div class="space-y-2">
        <label for="sql-output" class="tool-label">Resultado</label>
        <textarea id="sql-output" rows="16" class="tool-textarea" readonly></textarea>
      </div>
    </div>

    <!-- Actions -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <button id="format-btn" class="tool-btn tool-btn-primary">Formatear</button>
      <button id="minify-btn" class="tool-btn tool-btn-warning">Minificar</button>
      <button id="example-btn" class="tool-btn tool-btn-secondary">Ejemplo</button>
      <button id="copy-btn" class="tool-btn tool-btn-ghost">Copiar</button>
      <button id="clear-btn" class="tool-btn tool-btn-ghost">Limpiar</button>
    </div>
  </div>
</div>
```

## Error Handling Approach

- **Parser errors**: wrap every `window.sqlFormatter.format()` call in `try/catch`; render `Error de formato: ${error.message}` in `#status-message` with red styling.
- **Empty/whitespace input**: show `El área de entrada está vacía.` and skip formatting.
- **CDN failure/timeout**: after a reasonable poll timeout (e.g. 10 s) show `No se pudo cargar el formateador de SQL.` and keep action buttons disabled.
- **Clipboard errors**: catch `navigator.clipboard.writeText()` rejection and show a non-blocking status message.

## Edge-Case Handling

| Case | Handling |
|---|---|
| Empty input | Status prompts for input; no call to formatter. |
| Whitespace-only input | Treated as empty after `trim()`; status prompts. |
| Indent outside 1–8 | HTML `min="1" max="8"` clamps keyboard input; script coerces to nearest valid value. |
| Copy with empty output | Status informs `No hay contenido para copiar.` |
| CDN slow but arrives | Buttons disabled until `window.sqlFormatter` is detected; spinner text in status. |
| Very large input (10 k+ chars) | `sql-formatter` is synchronous; NFR2 measured during verification. |

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Type check | No TS errors in component/page | `pnpm astro check` or build-time type checking |
| Build | Static generation succeeds | `pnpm build` |
| Manual/E2E | Format, minify, copy, clear, example, error display | Open `/tools/sql-formatter` in browser and run spec scenarios |

## Migration / Rollout

No migration required. Rollback is deleting the two new files and removing the `tools` array entry in `src/pages/index.astro`.

## Open Questions

- None.
