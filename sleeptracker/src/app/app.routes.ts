import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },  {
    path: 'log-sleep',
    loadComponent: () => import('./pages/log-sleep/log-sleep.page').then( m => m.LogSleepPage)
  },
  {
    path: 'log-sleepiness',
    loadComponent: () => import('./pages/log-sleepiness/log-sleepiness.page').then( m => m.LogSleepinessPage)
  },

];
