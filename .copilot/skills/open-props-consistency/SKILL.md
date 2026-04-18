---
name: open-props-consistency
description: Consistency audit for open-props-ds CSS architecture. Use when reviewing changes to reset, themes, density tokens, tables, surfaces, strokes, or other semantic token decisions.
---

# open-props-ds Consistency Audit

Use this skill when the task is about checking whether the code still follows the repo's own design-system rules.

Read this together with [markdown/session-2-learnings.md](../../../markdown/session-2-learnings.md) and the guidance skill at [open-props-guidance](../open-props-guidance/SKILL.md).

## Use This Skill For

- reviewing changes to reset, theme, or density files
- checking whether a fallback chain still follows the intended conceptual model
- deciding whether a new token is a durable addition or unnecessary sprawl
- running a focused architectural review before merging CSS-system changes

## Audit Goal

Find drift between the intended architecture and the current CSS implementation.

Focus on:

- reset behavior
- theme token coherence
- fallback chains
- density contract usage
- surface vs stroke semantics
- elevation semantics and overlay accessibility parity
- convenience-token sprawl

## Review Procedure

### 1. Check whether the right layer owns the decision

- reset for baseline browser-facing defaults
- theme files for token definitions and scheme-specific meaning
- density files for spacing and radius scaling
- showcase styles for demo-specific presentation only

Flag changes that solve a system problem in the showcase instead of the library styles.

### 2. Check fallback-chain coherence

Look for patterns where a property starts semantic, then falls back to the wrong conceptual family.

Examples of drift:

- stroke-like concerns falling directly to text colors
- table separators falling directly to arbitrary surfaces without using stroke tokens first
- semantic tokens skipping their generic layer and falling straight to raw Open Props primitives when a repo-level scale exists

### 3. Check semantic vs generic token usage

Ask:

- should this use a generic surface token?
- should this use a semantic alias?
- should this use a stroke token?
- is the new token truly reusable, or just compensating for one awkward rule?

Flag tokens that exist only to avoid making a local design choice.

### 4. Check density discipline

- controls should use control density tokens
- grouping/layout should use gap, cluster, stack, or section tokens
- surfaces should use the surface radius token only where the object is actually surface-like

Flag reintroduction of numeric semantic spacing like `--space-1` or direct primitive sizing where the repo already has a role token.

### 5. Check whether convenience tokens still earn their keep

Convenience tokens are acceptable if they:

- reduce override friction for theme authors
- still default through the generic semantic system
- do not multiply one concept into many near-duplicates

Flag convenience tokens that no longer provide real override value.

### 6. Check reset scope discipline

The reset may be opinionated, but it should still feel like a baseline, not like component styling.

Flag rules that:

- hard-code component-specific aesthetics
- embed too much product layout policy without an explicit repo decision
- create state logic that belongs in component-level styling instead

### 7. Check documentation sync

If the architecture changed, confirm the relevant docs changed too:

- [markdown/session-2-learnings.md](../../../markdown/session-2-learnings.md)
- [README.md](../../../README.md) when contributor-facing behavior changed
- [open-props-guidance](../open-props-guidance/SKILL.md) when a durable rule changed

### 8. Check elevation policy and accessibility parity

- In-flow components should not rely on shadow as their primary elevation cue.
- Detached overlays (dialog, popover, menu, tooltip, drawer) may use shadow, but must also use correct semantic roles and keyboard/focus behavior.

Flag patterns where:

- a component only reads as elevated because of shadow while surface and stroke contrast are weak
- a visually floating UI lacks matching semantics (`role`, popup relationships, modal state)
- a floating UI lacks predictable keyboard handling (dismiss, focus movement, focus return)

## How To Report Findings

Use this reporting structure:

1. findings that are current inconsistencies or defects
2. open questions or assumptions
3. optional future work that should not block the current change

Prefer explaining the architectural mismatch, not just pointing at the line.

## Expected Output Style

When using this skill for a review:

1. Report findings first, ordered by severity.
2. Distinguish actual inconsistencies from acceptable local derivations.
3. Call out optional future work separately from current defects.
4. Prefer architectural explanations over taste-based comments.

## Current Repo-Specific Watchpoints

Pay extra attention to these areas because they have already produced architectural drift once:

1. control hover, disabled, read-only, and invalid states
2. table border and separator fallback chains
3. scrollbar token fallbacks
4. surface hierarchy getting too flat to read clearly
5. link affordance becoming visually too weak in baseline content
6. spread of `--unsafe-link-text-decoration-line` into places where normal content links should stay explicit
7. in-flow components introducing decorative shadow as pseudo-elevation
8. floating components with visual elevation but incomplete a11y semantics/keyboard behavior
9. interactive components using mixed naming for action meaning (`variant`, classnames) instead of shared `intent` semantics
10. accidental introduction of design-system-level icon infrastructure where inline app-supplied SVG would suffice

## Intent-Semantics Check (Interactive Components)

When reviewing interactive components, verify:

1. Action meaning is represented through `intent` in markup and selectors.
2. Intent names are reused consistently across components (`primary`, `secondary`, `quiet`, `danger`) unless a new durable meaning is justified.
3. Interaction states are not conflated with intent:
	- use `disabled` / `aria-disabled` for unavailable actions
	- use ARIA state attributes for behavior state (`aria-pressed`, `aria-expanded`, etc.)
4. Visual styling does not become the only carrier of destructive intent; labels/flows should still communicate risk.

## Icon Policy Check

When reviewing icon-capable controls, verify:

1. No unnecessary icon registry/sprite/pipeline was added to the design system.
2. Inline SVG usage remains consumer-replaceable at call sites.
3. Icon-only controls provide an accessible name (`aria-label` or `aria-labelledby`).
4. Inline SVG in controls is decorative (`aria-hidden="true"`) unless it must be announced.

## What Is Not Automatically A Problem

Do not over-report these by default:

- use of Open Props primitive size tokens for typographic widths and indentation
- local `color-mix(...)` derivations when no stable semantic token exists yet
- convenience tokens that still clearly reduce theme override friction

Only flag them when they actively undermine the current architecture.

## Success Criteria

This audit is working correctly when it:

- catches genuine drift without inventing busywork
- separates real defects from intentional local derivations
- reinforces the guidance skill instead of competing with it
- leaves future contributors with a clear reason for each finding

If the audit starts reporting every primitive value as suspicious, it has become too noisy to be useful.
