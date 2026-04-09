import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-html-kitchen-sink',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './html-kitchen-sink.html',
  styleUrl: './html-kitchen-sink.css',
})
export class HtmlKitchenSink {}
