---
name: open-props-guidance
description: Guidance for evolving the open-props-ds token system, reset, themes, and CSS architecture. Use when making design-system decisions or changing semantic tokens, density, surfaces, strokes, tables, or baseline reset behavior.
---

# open-props-ds Guidance

Use this skill when the task is about deciding how the system should work.

This skill captures the durable design-system rules for this repository.

Read it together with [markdown/session-1-learnings.md](../../../markdown/session-1-learnings.md) and [markdown/session-2-learnings.md](../../../markdown/session-2-learnings.md) when you need deeper historical context or decision rationale.

## Use This Skill For

- deciding whether a new token should exist
- deciding whether a value belongs in reset, theme, density, or component styles
- reviewing surface, stroke, and fallback-chain design decisions before editing code
- keeping new CSS aligned with the library's existing token architecture

## Working Principle

The system should stay small, legible, and easy to override.

- Open Props provides primitives.
- This library provides a semantic layer.
- Themes and density files provide controlled variation.
- The reset provides a strong but replaceable baseline.

## What This Repo Is Optimizing For

- Open Props primitives as the low-level design vocabulary.
- A small semantic token contract that theme authors can understand and override.
- An optional reset that is good enough to use, but not so opinionated that consumers cannot replace it.
- Angular-native, accessible components with minimal runtime styling complexity.

## Architectural Rules

### 1. Keep generic layers generic

- `--surface-1` through `--surface-4` are generic background hierarchy tokens.
- Do not assign durable semantic meaning to a generic surface unless repeated component usage proves the need.
- Prefer semantic aliases only when a role is stable across multiple components or contexts.

### 2. Prefer semantic tokens only where meaning is durable

Good reasons to add a semantic token:

- the same visual role appears in multiple places
- the role should vary by theme independently of the generic surface ladder
- the fallback would otherwise become a repeated ad hoc color formula

Bad reasons to add a semantic token:

- a one-off visual preference in a single component
- avoiding a small local derivation that is still obvious and coherent
- making the token matrix look complete on paper

Preferred default: derive locally until the role proves it deserves a public name.

### 3. Use the stroke scale for chrome, borders, and separators

- `--stroke-subtle`: low-emphasis separators
- `--stroke-default`: normal borders and dividers
- `--stroke-strong`: emphasized borders and stronger interactive chrome

If something behaves like chrome rather than filled surface, route it through the stroke scale before falling back to surfaces.

Examples:

- control borders
- table borders and separators
- scrollbar thumbs

### 4. Density is role-based, not numeric

Public density tokens should describe jobs, not positions on a scale.

Current contract:

- `--space-control-inline`
- `--space-control-block`
- `--space-gap-inline`
- `--space-gap-block`
- `--space-inset-inline`
- `--space-inset-block`
- `--space-cluster`
- `--space-stack`
- `--space-section`
- `--radius-control`
- `--radius-surface`

Do not reintroduce public tokens like `--space-1`, `--space-2`, `--radius-sm`, or `--radius-lg` as semantic API.

### 5. Density modes already do one scaling job

- `compact`, `normal`, and `spacious` are already a scaling axis.
- Do not multiply that axis with unnecessary token variants unless a role truly needs multiple semantic sizes.

### 6. The reset should be baseline-strong, not architecture-heavy

- Put the defaults that most consumers should benefit from in the reset.
- Do not turn the reset into a component styling layer.
- Baseline rules may be opinionated if the repo explicitly accepts that stance.

Current accepted example:

- checkbox and radio fieldsets default to horizontal wrapped layout as a desktop-first baseline

When in doubt, ask whether removing the rule would make the library feel unfinished or merely less opinionated. If the answer is “less opinionated,” the rule may belong outside the reset.

Baseline content affordance follows the same rule. Links should remain visibly link-like by default. If a UI surface genuinely needs calmer chrome, the reset exposes `--unsafe-link-text-decoration-line` as an explicit escape hatch. The `unsafe` prefix is intentional and should discourage casual use.

### 7. Theme convenience tokens are acceptable when they reduce override friction

Table tokens are the current example:

- `--table-bg`
- `--table-cell-bg`
- `--table-cell-alt-bg`
- `--table-head-bg`
- `--table-head-text`
- `--table-border`
- `--table-divider`
- `--table-row-separator`
- `--table-cell-hover-bg`

These remain valid because they provide a useful theme-author override layer while still defaulting to the generic surface and stroke systems.

### 8. Prefer coherent fallback chains

Fallbacks should move through the same conceptual layer before dropping to primitives.

Good pattern:

- semantic token -> generic semantic scale -> primitive fallback

Examples:

- `--scrollthumb-color -> --stroke-default -> --surface-3`
- `--table-row-separator -> --stroke-subtle -> --table-divider -> --surface-3`

Avoid fallback chains that jump sideways between unrelated concepts unless there is a strong reason.

### 9. Use shadow only for true floating layers

- Do not use shadow as the primary depth language for in-flow components.
- Prefer tonal elevation (`--surface-*`) plus stroke hierarchy for controls and content surfaces.
- Reserve shadow for detached overlays (dialog, popover, menu, tooltip, drawer).

If a component only reads as interactive or elevated because of shadow, the base surface and boundary contrast likely need improvement.

Accessibility parity requirement:

- Any visually floating pattern must ship with equivalent semantic and interaction behavior.
- Examples: modal semantics for dialogs, expanded/controls/haspopup wiring for triggers, role mapping on popup containers, and complete keyboard/focus handling.

### 10. Use intent as semantic action API for interactive components

- For interactive primitives and components, use `intent` attributes to represent action meaning (for example `primary`, `secondary`, `quiet`, `danger`).
- Intent is not a purely visual tier. It communicates action semantics in markup and should map consistently across components.
- Avoid introducing parallel naming (`variant`, ad hoc classes) when the meaning is action intent.
- Keep state semantics separate from intent semantics:
	- intent expresses meaning/emphasis of an action
	- state expresses interaction condition (`disabled`, `aria-disabled`, `aria-pressed`, `aria-expanded`, etc.)

When adding a new component, prefer reusing existing intent names before inventing new ones.

### 11. Keep icons app-supplied and inline by default

- Do not introduce a design-system-wide icon setup (registry, sprite build, icon package) unless repeated cross-app evidence proves it is necessary.
- Prefer inline SVG in component markup so consuming applications can replace icon glyphs without fighting library constraints.
- For icon-only controls, require an accessible name (`aria-label` or `aria-labelledby`) and treat inline SVG as decorative (`aria-hidden="true"`).

Default stance: icon infrastructure is deferred; icon-ready component contracts are allowed.

## Design Review Heuristics

Use these questions when making changes:

1. Is this value part of a stable system, or just convenient right now?
2. If the token were exposed publicly, would its name still make sense in six months?
3. Is this visual role really a surface, or is it actually chrome/stroke?
4. Is the reset setting a useful baseline, or is it smuggling in component design?
5. Does this change improve theme authorship, or create more token sprawl?
6. If a fallback fires, does the result still match the intended conceptual layer?

## Expected Outcome

When this skill is applied well, the result should have these qualities:

- the token contract stays small enough to explain without a diagram
- theme authors get meaningful override points without extra duplication
- reset rules feel intentional but replaceable
- fallback chains remain conceptually clean rather than historically accidental

## Documentation Expectations

When a decision materially changes the token architecture, reset philosophy, or theme policy:

- update [markdown/session-2-learnings.md](../../../markdown/session-2-learnings.md)
- update [README.md](../../../README.md) if contributors or consumers need to know
- keep this skill aligned if the rule is durable enough to guide future work

## Known Open Questions

These are not resolved rules yet:

- whether control states need dedicated semantic state tokens later
- whether `--space-inset-block` keeps earning its place as components grow
