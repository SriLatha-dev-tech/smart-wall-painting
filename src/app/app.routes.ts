import { Routes } from '@angular/router';

import { Login } from './login/login';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard').then(
        m => m.Dashboard
      ),
    canActivate: [authGuard]
  },

  {
    path: 'upload-room',
    loadComponent: () =>
      import('./upload-room/upload-room').then(
        m => m.UploadRoomComponent
      ),
    canActivate: [authGuard]
  },

  {
  path: 'wall-selection',
  loadComponent: () =>
    import('./wall-selection/wall-selection').then(
      m => m.WallSelection
    ),
  canActivate: [authGuard]
},
  {
    path: 'colour-preview',
    loadComponent: () =>
      import('./colour-preview/colour-preview').then(
        m => m.ColourPreview
      ),
    canActivate: [authGuard]
  },

  {
    path: 'saved-designs',
    loadComponent: () =>
      import('./saved-designs/saved-designs').then(
        m => m.SavedDesigns
      ),
    canActivate: [authGuard]
  }
];

