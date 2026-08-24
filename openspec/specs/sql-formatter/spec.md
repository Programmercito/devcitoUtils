# SQL Formatter Specification

## Purpose

Define the `/tools/sql-formatter` tool: paste SQL, pick a dialect and formatting options, then format, minify, copy, or clear — all client-side.

## Functional Requirements

### Requirement: Input and Output Areas

The system MUST provide a multi-line SQL input and a read-only output area.

#### Scenario: Paste SQL

- GIVEN the user is on `/tools/sql-formatter`
- WHEN the user pastes SQL
- THEN the input area shows the SQL

### Requirement: Formatting Options

The system MUST provide a dialect selector with all `sql-formatter` v15 dialects, default `sql`; an indent-width control, 1–8, default 2; and a keyword-case selector, `upper`/`lower`/`preserve`, default `preserve`.

#### Scenario: Options affect output

- GIVEN `postgresql`, width `4`, and `upper` are selected
- WHEN the user clicks Format on `select * from users`
- THEN the output uses PostgreSQL rules, 4-space indents and uppercase keywords

### Requirement: Format and Minify Actions

The system MUST provide Format and Minify buttons that produce formatted and single-line SQL, respectively.

#### Scenario: Format and minify SQL

- GIVEN the input is `select id,name from users where active=1`
- WHEN the user clicks Format and then Minify
- THEN the output is first formatted, then minified to one line

### Requirement: Copy and Clear Actions

The system MUST provide Copy and Clear buttons. Copy MUST copy the output to the clipboard, with feedback or a message when empty. Clear MUST empty the input, output and status areas.

#### Scenario: Copy and clear

- GIVEN output contains SQL
- WHEN the user clicks Copy
- THEN the clipboard receives the output text

- GIVEN both areas contain text
- WHEN the user clicks Clear
- THEN all three areas are empty

### Requirement: Example Loader

The system SHOULD provide an Example button that inserts a sample SQL query.

#### Scenario: Load example

- GIVEN the input area is empty
- WHEN the user clicks Example
- THEN the input area contains a valid sample query

### Requirement: Error Handling

The system MUST catch formatter errors and show a friendly Spanish status message without crashing.

#### Scenario: Invalid SQL

- GIVEN the input is unparseable
- WHEN the user clicks Format
- THEN the status area shows a Spanish error message

### Requirement: Client-side Processing

The system MUST load `sql-formatter` v15 from jsDelivr client-side and disable or defer actions until the library is available.

#### Scenario: Library pending

- GIVEN the CDN script is still loading
- WHEN the user clicks Format
- THEN the action is disabled or deferred until ready

### Requirement: Tool Registration

The system MUST create `src/components/tools/SqlFormatter.astro`, `src/pages/tools/sql-formatter.astro`, and add a card entry with `isNew: true` to `src/pages/index.astro`.

#### Scenario: Route and badge

- GIVEN the site is built
- WHEN the page renders
- THEN `/tools/sql-formatter` is reachable and the home-page card shows a "Nuevo" badge

## Non-functional Requirements

- **NFR1: Privacy.** All processing MUST be client-side.
- **NFR2: Performance.** Formatting up to 10,000 characters MUST complete in under 300 ms.
- **NFR3: Build health.** `pnpm build` MUST pass without errors.

## UI/UX Expectations

- Follow the existing tool layout: hero heading, component, and SEO block.
- Use `.tool-textarea`, `.tool-panel`, and `.tool-btn` classes.
- Group options in a compact bar; show status messages in `#status-message`.

## Edge Cases and Expected Behavior

| Case | Input / Action | Expected Behavior |
|---|---|---|
| Empty input | Format with no text | Status prompts for input |
| Invalid indent | Width outside 1–8 | Clamp or disable Format |
| Whitespace-only input | Spaces/newlines only | Output empty or unchanged |
| Clipboard denied | Copy without permission | Non-blocking error |
| CDN failure | Library fails to load | Disable actions, show error |

## Out-of-Scope Items

- npm installation of `sql-formatter`.
- Query execution, schema parsing, parameter binding.
- File upload, SSR, persistence, export, diff.
