# Color Converter Specification

## Purpose

Client-side color-format converter at `/tools/color-converter`. Parses and emits HEX, RGB/RGBA, HSL/HSLA, HSV/HSVA and CMYK/CMYKA, with a native picker, live swatch, validation and copy-to-clipboard.

## Requirements

### Requirement: Supported formats

The system MUST parse and emit HEX (`#RRGGBB[AA]`), RGB/RGBA, HSL/HSLA, HSV/HSVA and CMYK/CMYKA. The internal model SHALL be 8-bit sRGBA with channels clamped to valid ranges.

| Format | Example |
|---|---|
| HEX | `#3b82f6`, `#3b82f680` |
| RGB/A | `rgb(59,130,246)`, `rgba(59,130,246,0.5)` |
| HSL/A | `hsl(217,91%,60%)`, `hsla(217,91%,60%,0.5)` |
| HSV/A | `hsv(217,76%,96%)`, `hsva(217,76%,96%,0.5)` |
| CMYK/A | `cmyk(76%,47%,0%,4%)`, `cmyka(76%,47%,0%,4%,0.5)` |

#### Scenario: HEX to RGB

- GIVEN the user enters `#3b82f6`
- WHEN the format selector changes to RGB
- THEN the output reads `rgb(59, 130, 246)`

#### Scenario: Alpha preserved

- GIVEN the user enters `rgba(59,130,246,0.5)`
- WHEN switching to HEX
- THEN the output reads `#3b82f680`

### Requirement: Validation and normalization

The system MUST ignore optional whitespace, clamp out-of-range values, round RGB to integers and percentages/degrees to one decimal place, and show `.tool-error` for unparseable input. Empty input SHALL fall back to the default color.

#### Scenario: Invalid input

- GIVEN the text input contains `not a color`
- WHEN parsing fails
- THEN the swatch keeps the last valid color and an error message appears

#### Scenario: Clamp values

- GIVEN the user enters `rgb(300,-10,256)`
- WHEN normalizing
- THEN the output is `rgb(255, 0, 255)`

### Requirement: Picker synchronization

The system MUST provide an `<input type="color">` synced to the current color. Picker changes MUST update the text input; valid text edits MUST update the picker.

#### Scenario: Picker drives text

- GIVEN the format selector is HSL
- WHEN the user picks `#ff0000`
- THEN the text input becomes `hsl(0, 100%, 50%)`

### Requirement: Preview and copy

The system MUST render a live swatch of the valid color and provide a copy button writing the current text to `navigator.clipboard`. Clipboard failures MUST be handled gracefully.

#### Scenario: Copy value

- GIVEN the output reads `hsv(217,76%,96%)`
- WHEN the copy button is clicked
- THEN `navigator.clipboard` receives `hsv(217,76%,96%)`

### Requirement: Layout and accessibility

The system MUST reuse `.tool-panel`, `.tool-input`, `.tool-select`, `.tool-btn` and `.tool-error`. The layout SHALL be responsive: stacked on mobile, two columns on desktop. Every control MUST have a visible label or `aria-label`, text MUST meet 4.5:1 contrast, and focus MUST be visible.

#### Scenario: Keyboard navigation

- GIVEN focus is on the format selector
- WHEN the user presses Tab
- THEN focus moves through text input and copy button in order

### Requirement: Non-functional behavior

The system MUST run client-side without network requests, keep the component script under 350 lines, pass TypeScript strict with no `any`, complete updates within 100ms for 50-character inputs, and pass `pnpm build`.

#### Scenario: Build succeeds

- GIVEN the page imports `ColorConverter.astro`
- WHEN `pnpm build` runs
- THEN the build completes with zero errors

### Requirement: Files

The system MUST create `src/components/tools/ColorConverter.astro`, `src/pages/tools/color-converter.astro` and append the card entry to `src/pages/index.astro`.

#### Scenario: Route reachable

- GIVEN the site is built
- WHEN a user visits `/tools/color-converter`
- THEN the page renders
