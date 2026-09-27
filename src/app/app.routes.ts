import { Routes } from '@angular/router';

import { LoginComponent } from './login/login';
import { AuthGuard } from './auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard').then(
        m => m.Dashboard
      ),
    canActivate: [AuthGuard]
  },

  {
    path: 'upload-room',
    loadComponent: () =>
      import('./upload-room/upload-room').then(
        m => m.UploadRoomComponent
      ),
    canActivate: [AuthGuard]
  },

  {
  path: 'wall-selection',
  loadComponent: () =>
    import('./wall-selection/wall-selection').then(
      m => m.WallSelection
    ),
  canActivate: [AuthGuard]
},
  {
    path: 'colour-preview',
    loadComponent: () =>
      import('./colour-preview/colour-preview').then(
        m => m.ColourPreview
      ),
    canActivate: [AuthGuard]
  },

  {
    path: 'saved-designs',
    loadComponent: () =>
      import('./saved-designs/saved-designs').then(
        m => m.SavedDesigns
      ),
    canActivate: [AuthGuard]
  }
];

