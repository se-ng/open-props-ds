# Session 1 Learnings — Architecture & Setup

> Date: 2026-04-09  
> Covers: all decisions made and patterns agreed in session 1 before any component code was written.

---

## MCP Tooling

- **jCodeMunch** is wired globally (`~/.copilot/mcp-config.json`) and in the repo (`.copilot/mcp.json`). It will index source once we have `.ts` files to work with — the first `ng generate component` pass triggered it but found nothing yet.
- **jDocMunch** (`jdocmunch-mcp`) was installed via pip (`pip3 install jdocmunch-mcp --break-system-packages`). It is wired in both the global config and the repo `.copilot/mcp.json`. Use it to index Open Props docs and Angular docs at the start of each session to avoid dumping raw documentation into context.
- Repo-level MCP config lives at `.copilot/mcp.json` — Copilot CLI picks this up automatically when working inside the repo.

---

## Project Identity

| Setting | Value |
|---|---|
| npm package name | `@se-ng/ng-open-ui` |
| Angular selector prefix | `se` |
| Angular version | 22 (`next`) — track latest, no legacy burden |
| Package manager | pnpm with `save-exact=true` in `.npmrc` |
| Repo name | `open-props-ds` |

---

## CSS Architecture

### Two-axis theme system

Two independent CSS custom properties drive all theming:

| Property | Purpose | Default |
|---|---|---|
| `--se-selected-scheme` | Color + font theme | `dark` |
| `--se-selected-density` | Spacing + shape (radii, sizing) | `normal` |

### How the switch works

```css
/* preset.css sets the defaults */
:root {
  --se-selected-scheme: dark;
  --se-selected-density: normal;
}

/* OS preference overrides the default */
@media (prefers-color-scheme: light) {
  :root { --se-selected-scheme: light; }
}
```

The Angular `ThemeService` overrides via `document.documentElement.style.setProperty()`.  
**Inline styles beat `@media`** — so removing the inline style automatically restores OS preference.  
No class toggling, no `data-*` attributes needed.

### Theme files

Each theme lives in its own file. **The default theme file is the full base**; all others only contain divergent props.

```
projects/ng-open-ui/src/styles/
  preset.css              ← always import this; sets defaults + imports dark + normal
  dark.theme.css          ← DEFAULT color theme; full Open Props token set
  light.theme.css         ← divergent props only (vs dark)
  woodlike.theme.css      ← divergent props only (vs dark) — TODO
  normal.density.css      ← DEFAULT density; full spacing/radius token set
  compact.density.css     ← divergent props only
  spacious.density.css    ← divergent props only
  mobile.density.css      ← divergent props only — TODO
```

Consumers import `preset.css` always, then only the extra theme files their app needs.

### CSS style queries

Theme files use `@container style()` queries to react to the custom properties:

```css
@container style(--se-selected-scheme: dark) {
  :root { /* dark tokens */ }
}
```

Browser support: Chrome 111+, Safari 17.2+, Firefox 128+ — safe for Angular 22+ target audience.

### ViewEncapsulation

All components use **`ViewEncapsulation.Emulated`** (Angular default).  
- Custom properties pierce Angular's `_nghost`/`_ngcontent` attribute scoping naturally.  
- `ViewEncapsulation.None` avoided — too risky for consumers who aren't CSS power users.  
- `ViewEncapsulation.ShadowDom` avoided — breaks Open Props token flow without `::part()` API overhead.

---

## Component API Conventions

### Native element hosts

Use the native HTML element as the host selector wherever a semantic native element exists:

```ts
@Component({ selector: 'button[se]', ... })   // ✅
@Component({ selector: 'se-button', ... })     // ❌ — no native equivalent needed
```

`se-` prefix **only** for elements with no native semantic equivalent (e.g. `<se-card>`, `<se-chip>`).

### Styling

- CSS **attribute selectors** do the styling work: `[variant="primary"] { ... }`
- **No classnames** added by the library.
- `ViewEncapsulation.Emulated` keeps component styles scoped without classname pollution.

### Angular inputs

Angular `input()` signals **only when JS/state is actually needed**.  
For everything else, plain HTML attributes + CSS attr selectors are sufficient.

```html
<!-- Pure CSS — no Angular input needed -->
<button se variant="primary" size="lg">Click me</button>

<!-- Angular input needed — JS has to react to this -->
<se-accordion [open]="isOpen" />
```

### Content projection

Use `<ng-content>` for content slots. Named selects (`select="[sePrefix]"`) for icon/addon slots where needed.

---

## Release & Quality Tooling

| Tool | Purpose |
|---|---|
| `semantic-release` | Automated versioning + CHANGELOG from commit messages |
| `@semantic-release/git` | Commits `CHANGELOG.md` + bumped `package.json` back to `main` |
| `commitlint` + `@commitlint/config-conventional` | Enforces Conventional Commits format |
| `husky` (commit-msg hook) | Rejects non-conforming commits locally |

### Conventional commit types in use

`feat` `fix` `docs` `chore` `refactor` `test` `style` `perf` `ci` `build`  
Breaking changes: `feat!` or `BREAKING CHANGE:` footer.

### YubiKey / GPG signing

Git signing uses a YubiKey (physical touch required). This **will block CI**.  
Workaround for now: `git commit --no-gpg-sign`.  
CI fix needed: `git config commit.gpgsign false` scoped to the GitHub Actions environment, or a dedicated CI signing key without touch policy.

---

## Bundle Size Budget

Strict: **CI fails if any single component's CSS + JS exceeds 5 kb gzipped.**  
To be configured in `angular.json` per-project budgets and enforced in GitHub Actions.

---

## Accessibility

- Target: **WCAG AA** minimum on every component.
- Native element hosts give correct ARIA roles for free.
- `axe-core` must run in every Vitest unit test.
- Storybook (`@storybook/addon-a11y`) deferred — not compatible with Angular 22 yet.

---

## What Was Deferred

- **Storybook** — `@storybook/angular@latest` declares `< 22.0.0` peer dep range. Revisit once officially supported.
- **CSS-only package** — Angular-only for now.
- **`mobile.density.css`** — stub not yet created; add alongside other density themes.
- **`woodlike.theme.css`** and other color variants from argyleink's pen — to be populated when fleshing out `dark.theme.css` fully.
- **Full Open Props token mapping** — `dark.theme.css` and `normal.density.css` contain placeholder tokens. Full mapping is next session's work.
