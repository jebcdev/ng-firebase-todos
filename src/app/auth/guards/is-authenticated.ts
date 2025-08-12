import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@app/auth/services/auth';
import { map, take } from 'rxjs/operators';
import { from } from 'rxjs';
import { Auth, authState } from '@angular/fire/auth';

export const isAuthenticatedGuard: CanMatchFn = (route, segments) => {
  const auth = inject(Auth);
  const router = inject(Router);
  
  // Espera a que Firebase confirme el estado de autenticación
  return authState(auth).pipe(
    take(1), // Solo toma el primer valor (estado actual)
    map(user => {
      if (user) {
        return true; // Usuario autenticado, permite acceso
      } else {
        router.navigate(['/auth/login']);
        return false; // No autenticado, redirige
      }
    })
  );
};