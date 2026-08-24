# Text Sanitizer Specification

## Purpose

Define the behavior of the `text-sanitizer` tool: a client-side utility that lets users paste "dirty" text, apply configurable cleanup rules and escape modes, and receive sanitized output plus a live report of what changed.

## Functional Requirements

### Requirement: Input Area

The system MUST provide a multi-line input area where users can paste or type arbitrary text.

#### Scenario: Paste dirty text

- GIVEN the user is on `/tools/text-sanitizer`
- WHEN the user pastes text into the input area
- THEN the input area displays the pasted text and the output/log update automatically

### Requirement: Toggleable Cleaners

The system MUST provide independently toggleable cleaners with the following effects when enabled:

- Remove ASCII control characters (`U+0000`–`U+001F`) except tab, LF, and CR.
- Remove null bytes (`U+0000`).
- Remove zero-width and non-printable Unicode characters (e.g., BOM `U+FEFF`, zero-width spaces `U+200B`–`U+200D`, directional marks `U+202A`–`U+202E`).
- Normalize line endings to a single LF (`\n`).
- Trim leading and trailing whitespace.
- Collapse consecutive whitespace characters to a single space.

#### Scenario: Remove control characters

- GIVEN the input contains `hello\x02world`
- WHEN the "Remove control characters" cleaner is enabled
- THEN the output is `helloworld` and the log reports 1 control character removed

#### Scenario: Normalize line endings

- GIVEN the input contains mixed `\r\n`, `\r`, and `\n` line endings
- WHEN the "Normalize line endings" cleaner is enabled
- THEN every line break in the output is a single `\n`

#### Scenario: Trim and collapse whitespace

- GIVEN the input is `  hello   world  `
- WHEN "Trim" and "Collapse whitespace" are enabled
- THEN the output is `hello world`

### Requirement: Escape Modes

The system MUST provide a single selectable escape mode applied after cleaners:

- Escape quotes and backslashes (`"` → `\"`, `'` → `\'`, `\` → `\\`).
- Escape for JSON string (equivalent to `JSON.stringify` value without outer quotes).
- Escape for HTML entities (`<`, `>`, `&`, `"` → named entities).
- Escape for URL encoding (`encodeURIComponent`).

#### Scenario: Escape for JSON string

- GIVEN the input contains `line"one\nline"two`
- WHEN the "JSON string" escape mode is selected
- THEN the output contains `line\"one\\nline\"two`

### Requirement: Sanitized Output

The system MUST display the sanitized result in a read-only output area that updates live as options or input change.

#### Scenario: Live output update

- GIVEN the user enables "Remove null bytes"
- WHEN the input contains a null byte
- THEN the output area immediately shows the text without the null byte

### Requirement: Detection Log

The system MUST show a live detection log listing, for each cleaner or escape mode that produced changes, the count of affected characters and at least one representative example.

#### Scenario: Log reports multiple categories

- GIVEN the input contains null bytes, zero-width spaces, and control characters
- WHEN the corresponding cleaners are enabled
- THEN the log shows separate counts for null bytes, zero-width characters, and control characters

### Requirement: Copy Output

The system MUST provide a button that copies the current sanitized output to the clipboard and gives visual feedback on success.

#### Scenario: Copy sanitized text

- GIVEN the output area contains sanitized text
- WHEN the user clicks the copy button
- THEN the output text is written to the clipboard and the button briefly indicates success

### Requirement: Clear Action

The system MUST provide a button that clears the input area, output area, and detection log.

#### Scenario: Clear all

- GIVEN the input and output contain text and the log shows entries
- WHEN the user clicks the clear button
- THEN the input, output, and log are empty

## Non-functional Requirements

- **NFR1: Privacy.** All processing MUST occur client-side; no text MUST be sent to a server.
- **NFR2: Browser support.** The tool MUST work in the latest stable versions of Chrome, Firefox, Safari, and Edge with JavaScript enabled.
- **NFR3: Performance.** Sanitization of inputs up to 50,000 characters MUST complete in under 100 ms on a modern laptop.
- **NFR4: Code budget.** The new component SHOULD stay within the 400-line review budget for the whole change.
- **NFR5: Build health.** `pnpm build` MUST pass without TypeScript errors after the change.

## UI/UX Expectations

- The page MUST follow the existing Astro/Tailwind tool layout: hero heading, tool component, and an SEO content block.
- Cleaners MUST be presented as a compact group of labeled toggles (checkboxes or switches).
- Escape mode MUST be presented as a single-choice control (select or radio group).
- Input and output areas MUST use the existing `tool-textarea` and `tool-panel` classes.
- The detection log MUST be visually distinct from the output, using the existing `tool-info-msg` or similar feedback style.
- Copy and clear buttons MUST use the existing `tool-btn` classes and provide immediate visual feedback.

## Edge Cases and Expected Behavior

| Case | Input / Action | Expected Behavior |
|------|----------------|-------------------|
| Empty input | No text entered | Output is empty; log shows zero counts or hides |
| No options enabled | Any text | Output equals input; escape mode "None" leaves text unchanged |
| Only whitespace | `   \t\n   ` with trim enabled | Output is empty |
| Emojis and surrogate pairs | `hello 🌍` | Preserved unless a selected cleaner explicitly targets the code points |
| All cleaners + JSON escape | Text with quotes and control chars | Cleaners run first, then JSON escape |
| Very long input | >50,000 chars | Still processes; may defer updates but remains responsive |
| Clipboard denied | User clicks copy but permission is denied | Show a non-blocking error message instead of crashing |

## Out-of-Scope Items

- Database-specific sanitization, SQL parameterization, or SQL escaping.
- File upload or drag-and-drop input.
- Undo/redo history or a diff viewer.
- Character-set detection or encoding conversion (e.g., iconv).
- Server-side processing or persistence of user text.
