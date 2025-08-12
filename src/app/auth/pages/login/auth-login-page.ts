import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/services/auth';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'auth-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-login-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthLoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Señales del servicio para el template
  isLoading = this.authService.isLoading;

  /**
   * Maneja el login con email y contraseña
   */
  onEmailLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      this.authService.loginWithEmail({ email, password }).subscribe({
        next: (result) => {
          if (result.success) {
            toast.success('¡Bienvenido de vuelta!', {
              description: 'Has iniciado sesión correctamente'
            });
            this.router.navigate(['/']);
          } else {
            toast.error('Error al iniciar sesión', {
              description: this.getErrorMessage(result.error)
            });
          }
        },
        error: (error) => {
          console.error('Error inesperado:', error);
          toast.error('Error inesperado', {
            description: 'Ocurrió un problema. Intenta nuevamente.'
          });
        }
      });
    } else {
      this.markAllFieldsAsTouched();
      toast.warning('Formulario incompleto', {
        description: 'Por favor completa todos los campos correctamente'
      });
    }
  }

  /**
   * Maneja el login con Google
   */
  onGoogleLogin(): void {
    this.authService.signInWithGoogle().subscribe({
      next: (result) => {
        if (result.success) {
          toast.success('¡Bienvenido!', {
            description: 'Has iniciado sesión con Google correctamente'
          });
          this.router.navigate(['/']);
        } else {
          toast.error('Error con Google', {
            description: this.getErrorMessage(result.error)
          });
        }
      },
      error: (error) => {
        console.error('Error inesperado con Google:', error);
        toast.error('Error con Google', {
          description: 'No se pudo conectar con Google. Intenta nuevamente.'
        });
      }
    });
  }

  /**
   * Convierte códigos de error de Firebase en mensajes amigables
   */
  private getErrorMessage(error: any): string {
    const errorCode = error?.code || error?.message || error;
    
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'No existe una cuenta con este email',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-email': 'Email inválido',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'auth/popup-closed-by-user': 'Ventana de Google cerrada por el usuario',
      'auth/cancelled-popup-request': 'Proceso de Google cancelado',
      'auth/popup-blocked': 'Popup bloqueado por el navegador'
    };

    return errorMessages[errorCode] || 'Error desconocido. Intenta nuevamente.';
  }

  /**
   * Marca todos los campos como tocados para mostrar errores
   */
  private markAllFieldsAsTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `Mínimo ${minLength} caracteres`;
      }
    }
    
    return '';
  }

  /**
   * Verifica si un campo tiene errores
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }
}

export default AuthLoginPage;