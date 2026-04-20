import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BadgeComponent } from '../../../../ng-open-ui/src/lib/badge/badge.component';
import { SeDialogComponent } from '../../../../ng-open-ui/src/lib/dialog/dialog.component';

@Component({
  selector: 'app-components-kitchen-sink',
  imports: [BadgeComponent, SeDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './components-kitchen-sink.html',
  styleUrl: './components-kitchen-sink.css',
})
export class ComponentsKitchenSink {
  readonly dialogOpen = signal(false);
  readonly dialogResult = signal('No action yet');

  handleDialogClosed(result: string): void {
    this.dialogResult.set(result || 'dismissed');
  }

  openDialog(): void {
    this.dialogOpen.set(true);
  }
}
