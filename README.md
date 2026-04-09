# open-props-ds

An Angular component design system built on top of [Open Props](https://open-props.style/) and inspired by [OpenPropsUI](https://open-props-ui.netlify.app/) — a CSS-first, zero-runtime component library for Angular applications.

> **Status:** Early development — architecture and foundations in progress.

## Philosophy

- **CSS-first** — components are styled with Open Props custom properties; no CSS-in-JS, no style encapsulation hacks.
- **Copy-paste friendly** — components are standalone and self-contained; take what you need.
- **Accessible by default** — every component targets WCAG AA compliance and passes axe audits.
- **Angular-native** — standalone components, signals, `OnPush` change detection, typed reactive forms.
- **Zero opinion on your theme** — Open Props design tokens are the API; override anything.

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Angular 20+ (standalone, signals) |
| Design tokens | [Open Props](https://open-props.style/) |
| Reference UI | [OpenPropsUI](https://open-props-ui.netlify.app/) |
| Styles | CSS custom properties (no pre-processors required) |
| Testing | Vitest + Testing Library |
| Docs / showcase | Angular app in this repo (`projects/showcase`) |
| Package manager | pnpm |

## Getting started

```bash
pnpm install
ng serve           # showcase app at http://localhost:4200
ng test            # unit tests
ng build           # build all projects
```

## Repo structure (planned)

```
open-props-ds/
├── projects/
│   ├── ui/           # The component library (publishable)
│   └── showcase/     # Docs & demo app
├── .copilot/
│   └── mcp.json      # Repo-level MCP servers (jcodemunch + jdocmunch)
└── ...
```

## AI tooling (Copilot / MCP)

This repo is configured with two MCP servers for AI-assisted development:

- **[jCodeMunch](https://github.com/jgravelle/jcodemunch-mcp)** — semantic code search and symbol navigation across the codebase.
- **[jDocMunch](https://github.com/jgravelle/jdocmunch-mcp)** — section-precise documentation retrieval (Open Props docs, Angular docs, component specs).

Both are declared in `.copilot/mcp.json` and picked up automatically by GitHub Copilot CLI.

## Things we'll need (design decisions ahead)

See the section below for context before diving in.

### 1. Monorepo library structure
Split into `projects/ui` (publishable Angular library) and `projects/showcase` (demo app). Use `ng generate library` and `ng generate application`.

### 2. Open Props integration strategy
Decide whether to ship Open Props as a peer dependency (consumers import the CSS themselves) or to re-export a curated subset of tokens as part of the library's CSS layer.

### 3. CSS architecture
Pick a layer strategy (`@layer`) and decide on component-level encapsulation: `ViewEncapsulation.None` + scoped selectors, or shadow DOM. None + scoped is likely the right call to keep Open Props tokens flowing through naturally.

### 4. Component API conventions
Agree on input naming, slot/content projection patterns, and host element usage before building the first components.

### 5. Theme / color-scheme support
Open Props ships light and dark token sets. Decide how consumers opt in (class on `:root`, `prefers-color-scheme`, or a signal-based theme service).

### 6. Accessibility testing pipeline
Add `axe-core` (via `@axe-core/playwright` or `jest-axe`) to CI so every component is continuously audited.

### 7. Documentation tooling
Consider [Storybook](https://storybook.js.org/) or a hand-rolled Angular showcase app. Storybook has good Angular support and autodocs, but adds weight.

### 8. Semantic versioning & release
Set up [Changesets](https://github.com/changesets/changesets) or [release-it](https://github.com/release-it/release-it) before the first published version to keep the changelog clean from day one.

### 9. Bundle size budget
Set `ng build` size budgets early and enforce them in CI to prevent token/style bloat creeping in.

### 10. Peer dependency matrix
Decide minimum supported Angular version and whether to also publish a standalone CSS-only package for non-Angular consumers.

## Contributing

Work in progress — contributing guidelines will be added once the initial architecture is settled.

## License

MIT
