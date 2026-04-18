import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'html-kitchen-sink',
    pathMatch: 'full',
  },
  {
    path: 'html-kitchen-sink',
    loadComponent: () =>
      import('./html-kitchen-sink/html-kitchen-sink').then(
        (m) => m.HtmlKitchenSink
      ),
  },
  {
    path: 'components-kitchen-sink',
    loadComponent: () =>
      import('./components-kitchen-sink/components-kitchen-sink').then(
        (m) => m.ComponentsKitchenSink
      ),
  },
  {
    path: 'kitchen-sink',
    redirectTo: 'html-kitchen-sink',
    pathMatch: 'full',
  },
];
