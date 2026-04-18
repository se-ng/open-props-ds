import { ChangeDetectionStrategy, Component } from '@angular/core';

// Styles are loaded globally via src/styles/components.css.
// Do not add styleUrl/styles in this component decorator.
// This component is intentionally kept internal for now (not exported in public-api.ts).
// Keep it as a staging point for future host behavior/directive evolution.
@Component({
  selector: 'se-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
})
export class SePanelComponent {}
