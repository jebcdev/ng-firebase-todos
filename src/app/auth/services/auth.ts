import { Injectable, inject, signal, computed } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  User as FirebaseUser,
  AuthError,
  onAuthStateChanged,
  
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
/*  */
import { AuthResult, LoginCredentials, RegisterCredentials, User,UserRole } from "@app/auth/interfaces"
/*  */

/**
 * Servicio de autenticación que maneja el estado del usuario y las operaciones de auth
 * 
 * Funcionalidades principales:
 * - Registro con email/password y Google
 * - Login con email/password y Google  
 * - Logout
 * - Manejo de estados de carga y autenticación
 * - Detección de roles de usuario (admin/user)
 * 
 * @example
 * ```typescript
 * constructor(private authService: AuthService) {
 *   // Verificar si está autenticado
 *   console.log(this.authService.isAuthenticated());
 *   
 *   // Verificar rol
 *   console.log(this.authService.isAdmin());
 *   
 *   // Obtener usuario actual
 *   console.log(this.authService.currentUser());
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly googleProvider = new GoogleAuthProvider();

  // ========================================
  // SEÑALES PRIVADAS - Estado interno
  // ========================================
  
  /** Estado de carga de las operaciones de autenticación */
  private readonly _isLoading = signal(false);
  
  /** Usuario actual autenticado */
  private readonly _currentUser = signal<User | null>(null);
  
  /** Estado de autenticación del usuario */
  private readonly _isAuthenticated = signal(false);

  // ========================================
  // SEÑALES COMPUTADAS PÚBLICAS - Solo lectura
  // ========================================
  
  /** Indica si hay una operación de autenticación en curso */
  readonly isLoading = computed(() => this._isLoading());
  
  /** Usuario actualmente autenticado (null si no hay usuario) */
  readonly currentUser = computed(() => this._currentUser());
  
  /** Indica si el usuario está autenticado */
  readonly isAuthenticated = computed(() => this._isAuthenticated());
  
  /** Indica si el usuario actual tiene rol de administrador */
  readonly isAdmin = computed(() => {
    const user = this._currentUser();
    return user ? user.role === 'admin' : false;
  });
  
  /** Indica si el usuario actual tiene rol de usuario regular */
  readonly isUser = computed(() => {
    const user = this._currentUser();
    return user ? user.role === 'user' : false;
  });

  // ========================================
  // CONSTRUCTOR E INICIALIZACIÓN
  // ========================================
  
  constructor() {
    this.initializeGoogleProvider();
    this.setupAuthStateListener();
  }

  /**
   * Configura el proveedor de Google con los scopes necesarios
   * @private
   */
  private initializeGoogleProvider(): void {
    this.googleProvider.addScope('profile');
    this.googleProvider.addScope('email');
  }

  /**
   * Configura el listener para cambios en el estado de autenticación
   * @private
   */
  private setupAuthStateListener(): void {
    onAuthStateChanged(this.auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const user = this.mapFirebaseUserToUser(firebaseUser);
        this._currentUser.set(user);
        this._isAuthenticated.set(true);
      } else {
        this._currentUser.set(null);
        this._isAuthenticated.set(false);
      }
      this._isLoading.set(false);
    });
  }

  // ========================================
  // MÉTODOS PÚBLICOS - Operaciones de Auth
  // ========================================

  /**
   * Registra un nuevo usuario con email y contraseña
   * 
   * @param credentials - Credenciales de registro (email, password, name opcional)
   * @returns Observable con el resultado de la operación
   * 
   * @example
   * ```typescript
   * this.authService.registerWithEmail({
   *   email: 'user@example.com',
   *   password: 'password123',
   *   name: 'John Doe'
   * }).subscribe(result => {
   *   if (result.success) {
   *     console.log('Usuario registrado:', result.user);
   *   } else {
   *     console.error('Error:', result.error);
   *   }
   * });
   * ```
   */
  registerWithEmail(credentials: RegisterCredentials): Observable<AuthResult> {
    this._isLoading.set(true);
    
    return from(
      createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password)
        .then((userCredential) => {
          const user = this.mapFirebaseUserToUser(userCredential.user, credentials.name);
          this._currentUser.set(user);
          this._isAuthenticated.set(true);
          
          return {
            success: true,
            user
          };
        })
        .catch((error: AuthError) => ({
          success: false,
          error: this.getErrorMessage(error.code)
        }))
        .finally(() => {
          this._isLoading.set(false);
        })
    );
  }

  /**
   * Inicia sesión con email y contraseña
   * 
   * @param credentials - Credenciales de login (email, password)
   * @returns Observable con el resultado de la operación
   * 
   * @example
   * ```typescript
   * this.authService.loginWithEmail({
   *   email: 'user@example.com',
   *   password: 'password123'
   * }).subscribe(result => {
   *   if (result.success) {
   *     console.log('Login exitoso:', result.user);
   *   }
   * });
   * ```
   */
  loginWithEmail(credentials: LoginCredentials): Observable<AuthResult> {
    this._isLoading.set(true);
    
    return from(
      signInWithEmailAndPassword(this.auth, credentials.email, credentials.password)
        .then((userCredential) => {
          const user = this.mapFirebaseUserToUser(userCredential.user);
          this._currentUser.set(user);
          this._isAuthenticated.set(true);
          
          return {
            success: true,
            user
          };
        })
        .catch((error: AuthError) => ({
          success: false,
          error: this.getErrorMessage(error.code)
        }))
        .finally(() => {
          this._isLoading.set(false);
        })
    );
  }

  /**
   * Inicia sesión o registra con Google
   * 
   * @returns Observable con el resultado de la operación
   * 
   * @example
   * ```typescript
   * this.authService.signInWithGoogle().subscribe(result => {
   *   if (result.success) {
   *     console.log('Autenticación con Google exitosa');
   *   }
   * });
   * ```
   */
  signInWithGoogle(): Observable<AuthResult> {
    this._isLoading.set(true);
    
    return from(
      signInWithPopup(this.auth, this.googleProvider)
        .then((userCredential) => {
          const user = this.mapFirebaseUserToUser(userCredential.user);
          this._currentUser.set(user);
          this._isAuthenticated.set(true);
          
          return {
            success: true,
            user
          };
        })
        .catch((error: AuthError) => ({
          success: false,
          error: this.getErrorMessage(error.code)
        }))
        .finally(() => {
          this._isLoading.set(false);
        })
    );
  }

  /**
   * Cierra la sesión del usuario actual
   * 
   * @returns Observable con el resultado de la operación
   * 
   * @example
   * ```typescript
   * this.authService.logout().subscribe(result => {
   *   if (result.success) {
   *     console.log('Logout exitoso');
   *   }
   * });
   * ```
   */
  logout(): Observable<AuthResult> {
    this._isLoading.set(true);
    
    return from(
      signOut(this.auth)
        .then(() => {
          this._currentUser.set(null);
          this._isAuthenticated.set(false);
          
          return {
            success: true
          };
        })
        .catch((error: AuthError) => ({
          success: false,
          error: this.getErrorMessage(error.code)
        }))
        .finally(() => {
          this._isLoading.set(false);
        })
    );
  }

  // ========================================
  // MÉTODOS PRIVADOS - Utilidades
  // ========================================

  /**
   * Convierte un usuario de Firebase a nuestro modelo de User
   * @private
   */
  private mapFirebaseUserToUser(firebaseUser: FirebaseUser, displayName?: string): User {
    return {
      id: firebaseUser.uid,
      name: displayName || firebaseUser.displayName || 'Usuario',
      email: firebaseUser.email || '',
      role: this.determineUserRole(firebaseUser.email || ''),
      isActive: true,
      createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
      updatedAt: new Date()
    };
  }

  /**
   * Determina el rol del usuario basado en el email
   * Por defecto todos son 'user', los admins se pueden configurar aquí
   * @private
   */
  private determineUserRole(email: string): UserRole {
    // Lista de emails de administradores
    const adminEmails = [
      'admin@tuapp.com',
      'tu-email@gmail.com' // Agrega aquí emails de admin
    ];
    
    return adminEmails.includes(email) ? 'admin' : 'user';
  }

  /**
   * Convierte códigos de error de Firebase a mensajes legibles en español
   * @private
   */
  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'Este email ya está registrado',
      'auth/invalid-email': 'Email inválido',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/user-disabled': 'Usuario deshabilitado',
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-credential': 'Credenciales inválidas',
      'auth/popup-closed-by-user': 'Ventana cerrada por el usuario',
      'auth/cancelled-popup-request': 'Solicitud cancelada',
      'auth/popup-blocked': 'Popup bloqueado por el navegador',
      'auth/network-request-failed': 'Error de conexión',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde'
    };

    return errorMessages[errorCode] || 'Error desconocido. Intenta nuevamente.';
  }
}