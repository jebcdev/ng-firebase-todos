import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/services/auth';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'auth-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-register-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthRegisterPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Señales del servicio para el template
  isLoading = this.authService.isLoading;

  /**
   * Maneja el registro con email y contraseña
   */
  onEmailRegister(): void {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      
      this.authService.registerWithEmail({ name, email, password }).subscribe({
        next: (result) => {
          if (result.success) {
            toast.success('¡Cuenta creada exitosamente!', {
              description: `Bienvenido ${name}, tu cuenta ha sido registrada`
            });
            this.router.navigate(['/']);
          } else {
            toast.error('Error al crear cuenta', {
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
   * Maneja el registro con Google
   */
  onGoogleRegister(): void {
    this.authService.signInWithGoogle().subscribe({
      next: (result) => {
        if (result.success) {
          toast.success('¡Registro exitoso!', {
            description: 'Te has registrado con Google correctamente'
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
      'auth/email-already-in-use': 'Este email ya está registrado',
      'auth/invalid-email': 'Email inválido',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/weak-password': 'La contraseña es muy débil',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'auth/popup-closed-by-user': 'Ventana de Google cerrada por el usuario',
      'auth/cancelled-popup-request': 'Proceso de Google cancelado',
      'auth/popup-blocked': 'Popup bloqueado por el navegador',
      'auth/account-exists-with-different-credential': 'Ya existe una cuenta con este email'
    };

    return errorMessages[errorCode] || 'Error desconocido. Intenta nuevamente.';
  }

  /**
   * Marca todos los campos como tocados para mostrar errores
   */
  private markAllFieldsAsTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    
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
    const field = this.registerForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }
}

export default AuthRegisterPage;