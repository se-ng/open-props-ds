# Session 2 Learnings — Theming, Density, and Baseline Review

> Date: 2026-04-17  
> Covers: semantic token refinements, theme tuning decisions, density token naming, and baseline reset review findings.

---

## Density Token Model

The original numeric density tokens (`--space-1..4`, `--radius-sm/md`) were replaced with role-based semantic tokens.

### Current spacing tokens

| Token | Purpose |
| --- | --- |
| `--space-control-inline` | Horizontal padding inside controls |
| `--space-control-block` | Vertical padding inside controls |
| `--space-gap-inline` | Small inline gap between adjacent items |
| `--space-gap-block` | Small block gap between stacked items |
| `--space-inset-inline` | Medium inline inset / container padding |
| `--space-inset-block` | Medium block inset / container padding |
| `--space-cluster` | Medium grouping distance |
| `--space-stack` | Large vertical stack distance |
| `--space-section` | Largest section-to-section spacing |

### Current radius tokens

| Token | Purpose |
| --- | --- |
| `--radius-control` | Smaller radius for controls and compact UI pieces |
| `--radius-surface` | Larger radius for surfaces like tables and dialogs |

### Naming decision rationale

- Avoid numeric tokens as the public semantic contract.
- Avoid adjective scale names like `tight/roomy/loose` because they conflict mentally with density modes such as `compact/normal/spacious`.
- Prefer role-based names over a perfectly regular but overbuilt matrix.
- Do **not** create `sm/md/lg` variants unless a specific role genuinely needs multiple semantic sizes.

### Important design principle

Density modes are already one scaling axis. Do not duplicate that job by forcing size variants onto every token family.

---

## Baseline Reset Decisions

### Desktop-first option groups

Checkbox and radio fieldsets intentionally default to horizontal wrapped layout in the reset.

Reasoning:

- This is not a neutral baseline.
- It is acceptable as a deliberate desktop-first product stance.
- Consumers can override it locally when a vertical layout is clearer.

This should be treated as an intentional baseline decision, not an accidental default.

### Control padding belongs in the density contract

This was a real gap in the first pass.

Controls must respond to density changes in a way users can feel. As of session 2:

- text inputs use `--space-control-inline` / `--space-control-block`
- textareas use `--space-control-inline` / `--space-control-block`
- selects use `--space-control-inline` / `--space-control-block`
- buttons and button-like inputs use `--space-control-inline` / `--space-control-block`

This makes compact/spacious modes affect not only grouping/layout, but also the controls people interact with directly.

### Baseline control states now exist

The reset now includes explicit baseline states for native controls:

- hover
- active (button-like controls)
- disabled
- read-only
- invalid / `aria-invalid`

These are still intentionally conservative, but the baseline is no longer relying on raw browser state styling with only tokenized padding and surfaces.

---

## Theme Review Outcomes

### Dialog overlay tokens

The first floating-layer primitive now has a small theme override contract instead of hardcoded overlay styling:

- `--dialog-surface`
- `--dialog-border`
- `--dialog-shadow`
- `--dialog-backdrop-color`
- `--dialog-backdrop-blur`
- `--dialog-backdrop-saturate`

Reasoning:

- dialog is a true floating layer, so shadow is allowed here even though in-flow components should avoid shadow-led elevation
- backdrop treatment is part of theme authorship, not component-local taste
- the backdrop should preserve context with a frosted-glass feel by default, while still being easy to tone down or warm up per scheme

### Light theme

The original light theme felt too bright and high-glare. It was softened into a calmer "soft-light" variant by:

- lifting surface values away from pure white
- separating `--heading-1` from body text tone
- toning down links, brand, accent, and table surfaces

### Dark theme

The original dark baseline felt too close to full-white-on-full-black. It was softened into a calmer "soft-dark" variant by:

- lifting the base background from near-black
- softening body text while keeping headings crisp
- reducing contrast in tables and secondary surfaces

### Woodlike theme

Tables needed explicit table-level tokens to fit the scheme. The final approach uses cell-based zebra striping and hover states:

- `--table-cell-bg`
- `--table-cell-alt-bg`
- `--table-cell-hover-bg`
- `--table-row-separator`

Important: hover/striping is applied to `td`, not `tr`, to avoid the common table-row background problems and cascade surprises.

### Surface hierarchy policy

The generic dark and light surface ladders now follow the stronger Open Props normalize hierarchy instead of the softer custom ramps.

- dark: `gray-9`, `gray-8`, `gray-7`, `gray-6`
- light: `gray-0`, `gray-2`, `gray-3`, `gray-4`

The goal is to preserve the clearer separation Open Props already established for generic surfaces while keeping our customizations in `base-background`, text, link, and semantic special-purpose tokens.

Woodlike now uses the same more-pronounced idea rather than a flat one-step ladder:

- `sand-12`, `sand-10`, `sand-9`, `sand-8`

### Stroke token policy

To avoid per-component border token sprawl while keeping borders readable, themes now define a small stroke scale:

- `--stroke-subtle`
- `--stroke-default`
- `--stroke-strong`

Generic reset borders and table border/separator tokens route through this stroke scale.

Table tokens remain available as a theme author convenience layer, but now default to surface/stroke aliases instead of hardcoded color values in dark and light.

Control hover borders follow the same rule and now prefer `--stroke-strong` instead of jumping directly to a text token.

Scrollbar policy follows the same reasoning:

- thumb defaults through `--scrollthumb-color`, then falls back to `--stroke-default`
- track defaults through `--scrolltrack-color`, then falls back to `transparent`

Rationale:

- the thumb behaves more like UI chrome than a filled surface
- the track is intentionally quiet by default to avoid visual noise unless a theme wants to style it explicitly

---

## Design Review Findings To Keep In Mind

The strongest remaining critique points after session 2:

1. Control-state semantic tokens are still optional future work.
   The current baseline state model is acceptable and consistent enough for now. If real components later need more expressive or theme-specific state language, we can add dedicated semantic control-state tokens instead of growing more ad hoc `color-mix(...)` rules in the reset.

2. Surface hierarchy is still tight.
   Too many surfaces are only one token step apart, which can feel muddy instead of intentional.

3. Link affordance should stay explicit in baseline content.
   The reset now keeps underlines by default. There is an escape hatch for chrome-heavy UI contexts, but it is intentionally named `--unsafe-link-text-decoration-line` so opting out reads as a warning, not as the normal pattern.

These are good candidates for the next baseline-quality pass.

---

## Recommended Next Steps

1. Revisit surface separation with a stricter hierarchy.
2. Keep the unsafe link opt-out narrow and review any use of `--unsafe-link-text-decoration-line` critically.
3. Revisit semantic control-state tokens only if future components show the current derived states are not expressive enough.
4. As real components are added, keep validating whether `--space-inset-block` earns its place or should be removed later.
