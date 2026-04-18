import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ThemeService, ColorScheme, DensityScheme } from '../../../ng-open-ui/src/public-api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <nav>
        <a routerLink="/html-kitchen-sink">HTML Kitchen Sink</a>
        <a routerLink="/components-kitchen-sink">Components Kitchen Sink</a>
      </nav>
      <div class="theme-switcher">
        <fieldset>
          <legend>Scheme</legend>
          @for (scheme of schemes; track scheme) {
            <label>
              <input
                type="radio"
                name="scheme"
                [value]="scheme"
                [checked]="theme.currentScheme() === scheme"
                (change)="theme.setScheme(scheme)"
              />
              {{ scheme }}
            </label>
          }
        </fieldset>
        <fieldset>
          <legend>Density</legend>
          @for (density of densities; track density) {
            <label>
              <input
                type="radio"
                name="density"
                [value]="density"
                [checked]="theme.currentDensity() === density"
                (change)="theme.setDensity(density)"
              />
              {{ density }}
            </label>
          }
        </fieldset>
      </div>
    </header>
    <main>
      <router-outlet />
    </main>
  `,
  styleUrl: './app.css',
})
export class App {
  readonly theme = inject(ThemeService);
  readonly schemes: ColorScheme[] = ['dark', 'light', 'woodlike'];
  readonly densities: DensityScheme[] = ['normal', 'compact', 'spacious', 'mobile'];
}

