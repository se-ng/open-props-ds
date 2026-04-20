import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component } from '@angular/core';
import { BadgeComponent } from 'ng-open-ui';

@Component({
  selector: 'app-components-kitchen-sink',
  imports: [BadgeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './components-kitchen-sink.html',
  styleUrl: './components-kitchen-sink.css',
})
export class ComponentsKitchenSink {}
