import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'kitchen-sink',
    pathMatch: 'full',
  },
  {
    path: 'kitchen-sink',
    loadComponent: () =>
      import('./html-kitchen-sink/html-kitchen-sink').then(
        (m) => m.HtmlKitchenSink
      ),
  },
];
