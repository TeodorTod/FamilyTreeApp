import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./features/settings/settings.routes').then(
        (m) => m.settingsRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'onboarding',
    loadChildren: () =>
      import('./features/family-onboarding/family-onboarding.routes').then(
        (m) => m.familyOnboardingRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/home/home.route').then((m) => m.homeRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'member',
    loadChildren: () =>
      import('./features/member/member.routes').then((m) => m.memberRoutes),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
