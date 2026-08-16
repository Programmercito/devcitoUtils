# Tool Catalog Specification

## Purpose

Register the new Color Converter and Text Transformer tools on the landing page and extend the staggered card-in animation to cover the enlarged grid.

## Requirements

### Requirement: Tool card registration

The system MUST append a `ToolCard` entry to the `tools` array in `src/pages/index.astro` for each new tool. Each entry MUST include `title`, `description`, `href: "/tools/{slug}"`, an inline SVG `icon`, and `isNew: true`.

#### Scenario: Color converter card

- GIVEN `src/pages/index.astro` is rendered
- THEN the catalog contains a card titled "Conversor de Colores" linking to `/tools/color-converter`

#### Scenario: Text transformer card

- GIVEN `src/pages/index.astro` is rendered
- THEN the catalog contains a card titled "Transformador de Texto" linking to `/tools/text-transformer`

### Requirement: Stagger animation CSS fix

The system MUST add `.grid-stagger > *:nth-child(16)` and `.grid-stagger > *:nth-child(17)` rules to the existing `<style>` block in `src/pages/index.astro`, continuing the existing animation-delay progression.

#### Scenario: New cards animate in sequence

- GIVEN the landing page loads
- WHEN the 16th and 17th cards enter the viewport
- THEN they fade and slide in after `0.85s` and `0.9s` respectively

### Requirement: Count and layout consistency

The system MUST ensure the tools counter displays the updated total and MUST keep the existing responsive grid classes unchanged.

#### Scenario: Counter reflects total

- GIVEN the `tools` array contains 17 entries
- WHEN the page renders
- THEN the badge reads "17 Herramientas Listas"

### Requirement: Non-functional behavior and verification

The system MUST limit index changes to two card objects, two SVG constants and two CSS rules; MUST pass `pnpm build`; MUST preserve existing card order and routing; and MUST be verified by manual browser checks for card visibility, links and animation timing.

#### Scenario: Build with new catalog entries

- GIVEN `src/pages/index.astro` includes the new entries
- WHEN `pnpm build` runs
- THEN the build succeeds and the home page contains all 17 cards
