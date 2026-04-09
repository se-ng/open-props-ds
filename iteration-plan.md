# Iteration Plan

Work top-to-bottom within each phase. Start each session by re-indexing with jCodeMunch and jDocMunch, then read this file and markdown/session-1-learnings.md.

**Learnings doc:** markdown/session-1-learnings.md

---

## Status (end of session 1)

| Item | Status |
|---|---|
| Monorepo scaffolded | done |
| Packages pinned to exact versions | done |
| semantic-release + commitlint + husky | done |
| CSS theme file stubs | in progress |
| html-kitchen-sink component | done |
| ThemeService | pending |
| a11y pipeline | pending |
| ESLint + contributing guide | pending |
| GitHub Actions CI | pending |
| Bundle budgets | pending |
| YubiKey/GPG CI fix | pending |
| First real component | pending |

---

## Phase 1 - Foundations

### Step 1: Fill out CSS theme tokens

Files: projects/ng-open-ui/src/styles/

- Populate dark.theme.css with full Open Props color + font scale (dark)
  Use --gray-*, --blue-*, --violet-*, --font-*, --text-* from Open Props.
  Reference argyleink CodePen XWaYyWe for multi-theme structure.
- Populate normal.density.css with full Open Props --size-* and --radius-* scale
- Fill divergent props for light.theme.css, compact.density.css, spacious.density.css
- Add mobile.density.css stub
- Add woodlike.theme.css and other color variants from argyleink pen

Acceptance: ng serve showcase shows the kitchen-sink visually styled, dark default,
OS light-mode respected, no fallback values visible.

---

### Step 2: ThemeService

File: projects/ng-open-ui/src/lib/theme.service.ts

Signal-based service (providedIn root, inject(), Angular 22+).
Two independent axes:

  setScheme(scheme: ColorScheme)    sets --se-selected-scheme on :root inline style
  resetScheme()                     removes override; OS preference takes over
  setDensity(density: DensityScheme)
  resetDensity()
  currentScheme: Signal<ColorScheme>
  currentDensity: Signal<DensityScheme>

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
