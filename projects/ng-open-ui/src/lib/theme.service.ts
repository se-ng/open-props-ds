import { inject, Injectable, InjectionToken, signal, DOCUMENT } from '@angular/core';

// Built-in values are listed for autocomplete. The `string & {}` tail keeps
// the type open so consumers can register their own theme names without
// losing IntelliSense for the built-ins.
export type ColorScheme = 'dark' | 'light' | 'woodlike' | (string & {});
export type DensityScheme = 'normal' | 'compact' | 'spacious' | 'mobile' | (string & {});

export interface ThemeConfig {
  /** localStorage key used to persist the active color scheme. */
  storageKeyScheme: string;
  /** localStorage key used to persist the active density. */
  storageKeyDensity: string;
}

const DEFAULT_THEME_CONFIG: ThemeConfig = {
  storageKeyScheme: 'se-scheme',
  storageKeyDensity: 'se-density',
};

export const THEME_CONFIG = new InjectionToken<Partial<ThemeConfig>>('ThemeConfig', {
  providedIn: 'root',
  factory: () => ({}),
});

/** Provide a partial config to override only the settings you care about. */
export function provideThemeConfig(config: Partial<ThemeConfig>) {
  return { provide: THEME_CONFIG, useValue: config };
}

/**
 * Manages the two theme axes (color scheme + density) for the application.
 *
 * Activation is driven by data attributes on <html>:
 *   data-scheme="dark|light|woodlike"
 *   data-density="normal|compact|spacious|mobile"
 *
 * Priority (highest → lowest):
 *   1. User's last explicit choice, persisted in localStorage
 *   2. OS / browser preference (prefers-color-scheme)
 *   3. CSS fallback — :root:not([data-scheme]) defaults to dark
 *
 * ## Preventing flash of wrong theme (FOUC)
 *
 * This service sets the data attributes when Angular boots, but that is too
 * late to prevent a brief flash of the wrong theme on first paint. Add this
 * inline script to the very top of <head> in your app's index.html:
 *
 * ```html
 * <script>
 *   (function () {
 *     var s = localStorage.getItem('se-scheme') ||
 *       (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
 *     document.documentElement.dataset.scheme = s;
 *     var d = localStorage.getItem('se-density');
 *     if (d) document.documentElement.dataset.density = d;
 *   })();
 * </script>
 * ```
 *
 * If you override the storage keys via provideThemeConfig(), update the
 * localStorage.getItem() calls in the snippet to match.
 *
 * The script is intentionally tiny and synchronous so it runs before the
 * browser paints a single frame. ThemeService will read the same localStorage
 * values on init and stay in sync.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly config: ThemeConfig = {
    ...DEFAULT_THEME_CONFIG,
    ...inject(THEME_CONFIG),
  };

  private readonly _scheme = signal<ColorScheme>(this.resolveInitialScheme());
  private readonly _density = signal<DensityScheme>(this.resolveInitialDensity());

  readonly currentScheme = this._scheme.asReadonly();
  readonly currentDensity = this._density.asReadonly();

  constructor() {
    // Ensure data attributes are in sync with resolved initial values.
    this.applyScheme(this._scheme());
    this.applyDensity(this._density());
  }

  setScheme(scheme: ColorScheme): void {
    this.writeStorage(this.config.storageKeyScheme, scheme);
    this.applyScheme(scheme);
    this._scheme.set(scheme);
  }

  /** Clears the stored preference; OS setting takes over. */
  resetScheme(): void {
    this.removeStorage(this.config.storageKeyScheme);
    const resolved = this.resolveOsScheme();
    this.applyScheme(resolved);
    this._scheme.set(resolved);
  }

  setDensity(density: DensityScheme): void {
    this.writeStorage(this.config.storageKeyDensity, density);
    this.applyDensity(density);
    this._density.set(density);
  }

  /** Clears the stored preference; density falls back to CSS default (normal). */
  resetDensity(): void {
    this.removeStorage(this.config.storageKeyDensity);
    delete this.document.documentElement.dataset['density'];
    this._density.set('normal');
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private applyScheme(scheme: ColorScheme): void {
    this.document.documentElement.dataset['scheme'] = scheme;
    // color-scheme on :root is handled entirely by the CSS theme files via
    // :root[data-scheme="..."] selectors. The service only sets the attribute.
  }

  private applyDensity(density: DensityScheme): void {
    this.document.documentElement.dataset['density'] = density;
  }

  private resolveInitialScheme(): ColorScheme {
    return (this.readStorage(this.config.storageKeyScheme) as ColorScheme | undefined)
      ?? this.resolveOsScheme();
  }

  private resolveInitialDensity(): DensityScheme {
    return (this.readStorage(this.config.storageKeyDensity) as DensityScheme | undefined)
      ?? 'normal';
  }

  private resolveOsScheme(): ColorScheme {
    return this.document.defaultView
      ?.matchMedia('(prefers-color-scheme: dark)').matches === false
      ? 'light'
      : 'dark';
  }

  // localStorage.getItem returns string | null (browser API) — convert to
  // undefined at the boundary so callers never deal with null.
  private readStorage(key: string): string | undefined {
    try {
      return this.document.defaultView?.localStorage.getItem(key) ?? undefined;
    } catch {
      return undefined;
    }
  }

  private writeStorage(key: string, value: string): void {
    try {
      this.document.defaultView?.localStorage.setItem(key, value);
    } catch { /* storage unavailable — silently ignore */ }
  }

  private removeStorage(key: string): void {
    try {
      this.document.defaultView?.localStorage.removeItem(key);
    } catch { /* storage unavailable — silently ignore */ }
  }
}
