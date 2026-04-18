import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-components-kitchen-sink',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './components-kitchen-sink.html',
  styleUrl: './components-kitchen-sink.css',
})
export class ComponentsKitchenSink {}
