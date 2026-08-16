# Text Transformer Specification

## Purpose

Client-side text-case transformer at `/tools/text-transformer`. Produces camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, lower, UPPER, Title Case, Sentence case, dot.case, path/case and Train-Case with live updates and copy-to-clipboard.

## Requirements

### Requirement: Supported transformations

The system MUST produce the following outputs from a single input string. Tokenization SHALL split on whitespace, punctuation, case transitions and existing separators.

| Case | `hello world` → output |
|---|---|
| camelCase | `helloWorld` |
| PascalCase | `HelloWorld` |
| snake_case | `hello_world` |
| kebab-case | `hello-world` |
| CONSTANT_CASE | `HELLO_WORLD` |
| lower | `hello world` |
| UPPER | `HELLO WORLD` |
| Title Case | `Hello World` |
| Sentence case | `Hello world` |
| dot.case | `hello.world` |
| path/case | `hello/world` |
| Train-Case | `Hello-World` |

#### Scenario: Mixed separators

- GIVEN the input is `hello-world_test`
- WHEN the transformer tokenizes
- THEN `snake_case` outputs `hello_world_test` and `camelCase` outputs `helloWorldTest`

#### Scenario: Empty input

- GIVEN the input is empty
- WHEN the transformer runs
- THEN every output field is empty

### Requirement: Live update and copy

The system MUST update all outputs on every `input` event. Each output MUST have a copy button writing its value to `navigator.clipboard`. The system SHOULD provide a copy-all button with labels and values as plain text.

#### Scenario: Copy one result

- GIVEN the input reads `foo bar`
- WHEN the user clicks the copy button next to `PascalCase`
- THEN `navigator.clipboard` receives `FooBar`

#### Scenario: Copy all results

- GIVEN the input reads `foo bar`
- WHEN the user clicks the copy-all button
- THEN the clipboard contains a block with each label and its transformed value

### Requirement: Input handling and validation

The system MUST accept any Unicode string, preserve characters the active transformation does not alter, tolerate leading/trailing whitespace, and not crash on surrogate pairs or emoji.

#### Scenario: Emoji and symbols

- GIVEN the input is `hello 🌍 world`
- WHEN the transformer runs
- THEN `kebab-case` outputs `hello-🌍-world`

### Requirement: Layout and accessibility

The system MUST reuse `.tool-panel`, `.tool-textarea`, `.tool-input`, `.tool-btn`, `.tool-output-panel` and `.tool-label`. The layout SHALL show one input textarea above a responsive grid of read-only outputs: one column on mobile, two or three on desktop. Every control MUST have a label or `aria-label`, and focus MUST be visible.

#### Scenario: Mobile layout

- GIVEN a viewport width of 375px
- WHEN the page loads
- THEN output rows stack in a single column

#### Scenario: Screen reader labels

- GIVEN a screen reader is active
- WHEN focus moves to a copy button
- THEN the accessible name includes the transformation name

### Requirement: Error handling and performance

The system MUST treat null/undefined input as empty, avoid console errors for any user input, and keep updates under 100ms even for 10,000-character inputs.

#### Scenario: Long input stays responsive

- GIVEN the user pastes 10,000 characters
- WHEN typing continues
- THEN the UI remains responsive and updates complete within 100ms

### Requirement: Non-functional behavior

The system MUST run client-side, pass TypeScript strict with no `any`, keep the component script under 250 lines, avoid external dependencies beyond Astro/Tailwind, and pass `pnpm build`.

#### Scenario: Build succeeds

- GIVEN the page imports `TextTransformer.astro`
- WHEN `pnpm build` runs
- THEN the build succeeds with zero errors

### Requirement: Files

The system MUST create `src/components/tools/TextTransformer.astro`, `src/pages/tools/text-transformer.astro` and append the card entry to `src/pages/index.astro`.

#### Scenario: Route reachable

- GIVEN the site is built
- WHEN a user visits `/tools/text-transformer`
- THEN the page renders
