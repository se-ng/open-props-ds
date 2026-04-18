# Iteration Plan

Work top-to-bottom within each phase. Start each session by re-indexing with jCodeMunch and jDocMunch, then read this file, markdown/session-1-learnings.md, and markdown/session-2-learnings.md.

**Learnings docs:** markdown/session-1-learnings.md, markdown/session-2-learnings.md

---

## Status (updated April 17, 2026)

| Item | Status |
| --- | --- |
| Monorepo scaffolded | done |
| Packages pinned to exact versions | done |
| semantic-release + commitlint + husky | done |
| Optional reset layer (copyable baseline) | in progress |
| Semantic token model (surface/text/link/etc.) | in progress |
| CSS theme file stubs | in progress |
| html-kitchen-sink component | done |
| ThemeService | done |
| Showcase theme-switcher UI | done |
| a11y pipeline | pending |
| ESLint + contributing guide | pending |
| GitHub Actions CI | pending |
| Bundle budgets | pending |
| YubiKey/GPG CI fix | pending |
| First real component | pending |

---

## Phase 1 - Foundations

### Step 1: Optional reset + semantic token foundation

Files: projects/ng-open-ui/src/styles/

Goals:

- Provide an optional reset stylesheet inspired by Open Props normalize semantics,
  but maintained by this library (not imported verbatim).
- Keep reset in its own dedicated cascade layer so consumers can copy/fork it and
  replace it with their own version without breaking component/theme layers.
- Move toward semantic token naming as the primary contract (surface/text/link/etc.),
  with DS-specific aliases only where needed.

Deliverables:

- Add a standalone reset file (working name: reset.css) with low-specificity,
  semantic baseline rules for typography, forms, media, focus, and spacing primitives.
- Define/reset layer order explicitly in preset.css so precedence is predictable.
  Target order: reset → base → scheme → density.
- Expand base.theme.css to define semantic primitives used by reset and components:
  --surface-1..4, --text-1..2, --link, --link-visited, --focus-ring,
  plus any required supporting tokens.
- Keep current se-* tokens as compatibility aliases during transition, then phase out
  once components consume semantic tokens directly.
- Update light/dark/woodlike theme files to override semantic tokens first,
  not component-specific values.
- Ensure the reset remains optional for consumers (separate import path from preset).

Acceptance:

- Consumers can choose either:
  1) preset only
  2) preset + library reset
  3) preset + their own reset
- Kitchen sink renders correctly in dark/light + density variants with no token gaps.
- Reset styles can be removed/replaced without breaking theme switching behavior.

Session 2 decisions:

- Density tokens were renamed from numeric scale tokens to role-based tokens.
- Control padding is part of the density contract via `--space-control-inline` and `--space-control-block`.
- Checkbox/radio option groups intentionally default to horizontal wrapped layout in reset for desktop-first baseline behavior.
- Theme review decisions and follow-up critique are captured in markdown/session-2-learnings.md.

---

### Step 2: ThemeService (done)

File: projects/ng-open-ui/src/lib/theme.service.ts

Signal-based service (providedIn root, inject(), Angular 22+).
Two independent axes:

```ts
setScheme(scheme: ColorScheme)    // sets --se-selected-scheme on :root inline style
resetScheme()                     // removes override; OS preference takes over
setDensity(density: DensityScheme)
resetDensity()
currentScheme: Signal<ColorScheme>
currentDensity: Signal<DensityScheme>
```

Types:

  ColorScheme = 'dark' | 'light' | 'woodlike' (expand as themes are added)
  DensityScheme = 'normal' | 'compact' | 'spacious' | 'mobile'

Export from public-api.ts.
Add a theme-switcher UI to the showcase app header to exercise it live.

---

### Step 3: ESLint + Contributing guide

Files: eslint.config.js, CONTRIBUTING.md

ESLint:

- Install @angular-eslint/eslint-plugin and @angular-eslint/eslint-plugin-template
- Configure component-selector to allow native element attribute selectors
  (button[se], input[se]) in addition to the se- prefix element pattern.
  Rule: { type: ["element", "attribute"], prefix: "se", style: "kebab-case" }

CONTRIBUTING.md:

- Component API conventions (native hosts, CSS attr selectors, no classnames)
- When to add Angular input vs rely on HTML attribute
- ViewEncapsulation.Emulated always
- Conventional Commits enforced (commitlint will reject bad commits)
- axe audit required in every component spec

---

### Step 4: a11y testing pipeline

- Install axe-core and an axe integration for Vitest
- Add axe helper utility in projects/ng-open-ui/src/testing/
- Every component spec must call expectNoAxeViolations(fixture)
- Add axe call to the kitchen-sink spec

---

### Step 5: GitHub Actions CI

File: .github/workflows/ci.yml

Jobs:

1. install   - pnpm install --frozen-lockfile
2. lint      - commitlint on PR title, ESLint
3. build     - ng build ng-open-ui && ng build showcase
4. test      - ng test (includes axe)
5. bundle    - fail if any component exceeds 5 kb gzipped
6. release   - semantic-release on push to main

IMPORTANT: CI must set git config commit.gpgsign false because semantic-release
commits back to the repo and the YubiKey touch requirement will block it.
See markdown/session-1-learnings.md section "YubiKey / GPG signing".

---

## Phase 2 - First components

Work through components in this order (simplest to most complex):

1. button[se]
   - Selector: button[se]
   - Variants via CSS attr selector: [variant="primary"], [variant="ghost"] etc.
   - Size via attr selector: [size="sm"], [size="lg"]
   - No Angular inputs needed (all CSS-driven)
   - Content: ng-content for label + optional icon slots

2. a[se] (link)
3. input[se] (text, email, number, etc.)
4. textarea[se]
5. select[se]
6. label[se]
7. se-field (label + input + error message wrapper - no native equivalent)
8. se-card
9. se-badge

Each component needs:

- Component file + CSS file (no inline styles)
- Unit test with axe audit
- Entry in html-kitchen-sink to show it live

---

## Phase 3 - Publishing prep

- Update ng-open-ui/package.json: set name to @se-ng/ng-open-ui, add peerDependencies
  (angular 22+, open-props), sideEffects: ["*.css"]
- Export CSS files from the library build (configure ng-package.json assets)
- Update README with consumer install + usage instructions
- Set up CHANGELOG.md (semantic-release will manage it after first release)
- Tag v0.1.0

---

## Notes for future sessions

- jdocmunch should index Open Props docs and Angular 22 docs at session start.
  Use it to retrieve specific sections rather than reading full files.
- jcodemunch will be useful once Phase 2 starts and we have real component code.
- Storybook: revisit when @storybook/angular supports Angular 22+.
  Check: npm info @storybook/angular peerDependencies | grep angular
- The @container style() query approach for theming is modern (2025+).
  If browser support becomes a concern, fallback is :root[data-scheme="dark"] attr selectors.
