import { Routes } from '@angular/router';
import { Layout } from '@app/layout/layout';
import { isAuthenticatedGuard, isNotAuthenticatedGuard } from '@app/auth/guards';

export const routes: Routes = [
  // Rutas de autenticación (NO autenticado)
  {
    canMatch: [isNotAuthenticatedGuard],
    title: "Auth",
    path: 'auth',
    loadChildren: () => import('@app/auth/auth.routes')
  },
  // Rutas principales (autenticado)
  {
    canMatch: [isAuthenticatedGuard],
    title: "ToDo's App",
    path: '',
    component: Layout,
    loadChildren: () => import('@app/tasks/tasks.routes')

  },
  // Ruta por defecto
  {
    title: "Redirecting...",
    path: "**",
    redirectTo: "auth/login",
    pathMatch: "full"
  }
];