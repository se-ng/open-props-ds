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
| Framework | Angular 22+ (standalone, signals) |
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

> All packages are pinned to exact versions (`save-exact=true`). Run `pnpm install` after any version change.

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

## Architecture decisions

### 1. Monorepo structure
- `projects/ng-open-ui` — publishable Angular library (`@se-ng/ng-open-ui`)
- `projects/showcase` — demo/docs Angular app

### 2. Open Props integration
Open Props is a **peer dependency** — consumers import it themselves. The library ships a `preset.css` (reset + theme variants) as an optional but recommended starting point.

### 3. CSS architecture
**`ViewEncapsulation.Emulated`** (Angular default) on all components. Custom properties pierce Angular's attribute scoping naturally, so Open Props tokens flow through without friction. No Shadow DOM, no `ViewEncapsulation.None`.

### 4. Component API conventions
- **Native HTML elements as host selectors**: `button[se]`, `input[se]`, `a[se]`, etc.
- `se-` prefix only for elements with no native semantic equivalent (e.g. `<se-card>`)
- Styling driven by **CSS attribute selectors** — no classnames
- **Angular `input()` signals only when JS/state is actually needed**; otherwise plain HTML attributes
- Content projection via `<ng-content>` where needed

### 5. Theme system

Two independent theme axes, each controlled by a CSS custom property:

#### Color/font themes → `--se-selected-scheme`

```css
/* preset.css sets the defaults */
:root { --se-selected-scheme: dark; } /* dark is the default */

@media (prefers-color-scheme: light) {
  :root { --se-selected-scheme: light; }
}
```

Each theme lives in its own file. **`dark.theme.css` is the full base**; other files only contain props that diverge from it:

```
styles/
  preset.css              ← import this always; sets defaults
  dark.theme.css          ← DEFAULT: full color + font token set
  light.theme.css         ← only props divergent from dark
  woodlike.theme.css      ← only props divergent from dark
  (add more as needed)
```

#### Density/shape themes → `--se-selected-density`

Controls spacing, border-radius, sizing — independent from color themes:

```
styles/
  normal.density.css      ← DEFAULT: full spacing + radius token set
  compact.density.css     ← only divergent props
  spacious.density.css    ← only divergent props
  mobile.density.css      ← only divergent props
```

Consumers import `preset.css` always, then only the extra theme files they need. Unused themes are never loaded.

CSS `@container style()` queries react to both properties. The Angular **theme service** overrides them via `document.documentElement.style.setProperty()` — inline styles beat `@media`, so removing the override restores OS preference automatically. The two axes are set independently:

```ts
themeService.setScheme('light');
themeService.setDensity('compact');
```

### 6. Accessibility
Every component targets **WCAG AA**. `axe-core` runs in every Vitest unit test. Native element hosts give correct semantics for free.

### 7. Documentation
**Showcase Angular app** in `projects/showcase`. Storybook deferred until it officially supports Angular 22+.

### 8. Release tooling
- **`semantic-release`** — automated versioning + changelog from commit messages
- **`commitlint`** + **`husky`** — enforces [Conventional Commits](https://www.conventionalcommits.org/) at the git hook level; non-conforming commits are rejected

### 9. Bundle size budgets
CI fails if any single component's CSS + JS exceeds **5 kb gzipped**. Configured in `angular.json` and enforced in GitHub Actions.

### 10. Peer dependency matrix
- **Angular 22+** only — tracks latest, no legacy burden
- **Open Props** — peer dependency
- Angular-only; no CSS-only package planned

## Contributing

Work in progress — contributing guidelines will be added once the initial architecture is settled.

## License

MIT
