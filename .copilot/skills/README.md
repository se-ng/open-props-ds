# Repo-local Copilot Skills

This directory contains skills that belong to this repository rather than to a global Copilot setup.

The point of keeping them here is simple: the rules should evolve with the codebase. Once they stabilize and prove broadly useful, they can be promoted into a shared skill library.

## Skills

### [open-props-guidance](./open-props-guidance/SKILL.md)

Use this when you are deciding how the design system should evolve.

Typical use cases:

- adding or removing semantic tokens
- deciding whether styling belongs in reset, theme, density, or component code
- judging whether a fallback chain is conceptually coherent
- making architecture-level CSS decisions before editing files

### [open-props-consistency](./open-props-consistency/SKILL.md)

Use this when you are reviewing whether the current code still follows those rules.

Typical use cases:

- auditing reset/theme/density changes
- reviewing a pull request for token drift
- checking whether convenience tokens still earn their keep
- separating current defects from optional future cleanups

## Relationship Between The Two

- `open-props-guidance` defines the policy.
- `open-props-consistency` checks code against that policy.

They should stay aligned. If one changes, review the other.

## Source Material

These skills summarize the working rules captured in:

- [markdown/session-1-learnings.md](../../markdown/session-1-learnings.md)
- [markdown/session-2-learnings.md](../../markdown/session-2-learnings.md)

Those session documents remain the deeper historical record. The skills are the shorter operational layer.
