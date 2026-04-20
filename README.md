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
| --- | --- |
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

## Live showcase

- GitHub Pages: https://se-ng.github.io/open-props-ds/
- Deployment is automated via GitHub Actions on every push to `main`.

## Repo structure (planned)

```text
open-props-ds/
├── projects/
│   ├── ui/           # The component library (publishable)
│   └── showcase/     # Docs & demo app
├── .copilot/
│   ├── mcp.json      # Repo-level MCP servers (jcodemunch + jdocmunch)
│   └── skills/       # Repo-local Copilot skills for design-system work
└── ...
```

## AI tooling (Copilot / MCP)

This repo is configured with two MCP servers for AI-assisted development:

- **[jCodeMunch](https://github.com/jgravelle/jcodemunch-mcp)** — semantic code search and symbol navigation across the codebase.
- **[jDocMunch](https://github.com/jgravelle/jdocmunch-mcp)** — section-precise documentation retrieval (Open Props docs, Angular docs, component specs).

Both are declared in `.copilot/mcp.json` and picked up automatically by GitHub Copilot CLI.

This repo also keeps Copilot guidance local to the workspace under `.copilot/skills/` so design-system rules can evolve with the codebase before being promoted to any global skill library.

## Architecture decisions

### 1. Monorepo structure

- `projects/ng-open-ui` — publishable Angular library (`@se-ng/ng-open-ui`)
- `projects/showcase` — demo/docs Angular app

### 2. Open Props integration

Open Props is a **peer dependency** — consumers import it themselves. The library ships a `preset.css` (reset + theme variants) as an optional but recommended starting point.

### 3. CSS architecture

**`ViewEncapsulation.Emulated`** (Angular default) on all components. Custom properties pierce Angular's attribute scoping naturally, so Open Props tokens flow through without friction. No Shadow DOM, no `ViewEncapsulation.None`.

#### Baseline reset escape hatches

The reset is allowed to expose narrowly scoped bailout variables when the baseline is correct for most content but some UI chrome needs an exception.

Current example:

- links underline by default in baseline content
- `--unsafe-link-text-decoration-line` exists as an explicit opt-out for chrome-heavy UI contexts where a visible underline would be too noisy

The `unsafe` prefix is intentional. Treat these variables as exceptions that require review, not as normal customization points.

#### Elevation and floating layers

The design system uses a surface-first depth model, not a shadow-first model.

- In-flow UI (buttons, inputs, cards, tables, inline panels) should express depth with surface and stroke tokens.
- Shadow is reserved for truly floating layers (dialogs, popovers, menus, tooltips, drawers).
- Reason: shadow-only elevation is fragile across dark themes and can hide weak surface contrast decisions.

Recommended depth cues:

- Tonal elevation via `--surface-1` through `--surface-4`
- Boundary emphasis via `--stroke-subtle`, `--stroke-default`, `--stroke-strong`
- Optional backdrop contrast for overlays (scrim/backdrop)
- Meaningful motion (enter/exit/anchor-origin) to reinforce layer separation

Accessibility parity rule:

- If a UI is visually presented as floating, it must also expose correct semantic and interaction behavior.
- `dialog` / `alertdialog`: accessible name, `aria-modal` where applicable, focus management, escape-to-close.
- Triggered popups (menu/listbox/popover): trigger uses `aria-expanded` + `aria-controls` and appropriate `aria-haspopup`; popup has the matching role and keyboard support.
- Tooltip: use `role="tooltip"` and `aria-describedby` from the anchor.
- Non-modal floating UI still needs predictable focus return and dismiss behavior.

### 4. Component API conventions

- **Native HTML elements as host selectors**: `button[se]`, `input[se]`, `a[se]`, etc.
- `se-` prefix only for elements with no native semantic equivalent (e.g. `<se-card>`)
- Styling driven by **CSS attribute selectors** — no classnames
- Use **`intent` attributes** (e.g. `intent="primary"`, `intent="danger"`) for semantic action intent on interactive components.
- Treat `intent` as semantic API, not a visual-only variant label. The same intent should be reusable across components that represent the same action meaning.
- Do **not** introduce a library-level icon registry, sprite pipeline, or icon package by default.
- For icon-capable controls, use inline SVG in component markup and let applications supply/replace icons as needed.
- For icon-only controls, provide an accessible name (`aria-label` or `aria-labelledby`) and keep inline SVG decorative (`aria-hidden="true"`).
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

```text
styles/
  preset.css              ← import this always; sets defaults
  dark.theme.css          ← DEFAULT: full color + font token set
  light.theme.css         ← only props divergent from dark
  woodlike.theme.css      ← only props divergent from dark
  (add more as needed)
```

#### Density/shape themes → `--se-selected-density`

Controls spacing, border-radius, sizing — independent from color themes:

```text
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

Visual hierarchy and semantic hierarchy must match: when we add floating layers, accessibility semantics and keyboard behavior are required alongside visual elevation cues.

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
