import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '@app/auth/services';

@Component({
  selector: 'layout-header',
  imports: [RouterLink],
  template: `
    <header class="w-full sticky top-0 z-30 bg-gray-800 text-gray-100 h-16 flex items-center justify-between px-4 lg:px-6 shadow-lg border-b border-gray-700">
      <nav class="w-full flex items-center justify-between">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <a routerLink="/" class="text-xl lg:text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors duration-200">
            📝 ToDo's App
          </a>
        </div>


        <!-- User Menu - Solo si está autenticado -->
        @if (isAuthenticated()) {
          <div class="flex items-center space-x-4">
            <!-- User Info -->
            <div class="hidden sm:flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-semibold">
                {{ getUserInitials() }}
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-200">{{ currentUser()?.name }}</span>
                <span class="text-xs text-gray-400">{{ currentUser()?.email }}</span>
              </div>
            </div>

            <!-- Admin Badge -->
            @if (isAdmin()) {
              <span class="hidden lg:inline-flex px-2 py-1 text-xs font-medium bg-yellow-600 text-yellow-100 rounded-full">
                Admin
              </span>
            }

            <!-- Logout Button -->
            <button 
              (click)="onLogout()" 
              [disabled]="isLoading()"
              class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (isLoading()) {
                <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              } @else {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              }
              <span class="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        } @else {
          <!-- Auth Links - Solo si NO está autenticado -->
          <div class="flex items-center space-x-4">
            <a 
              routerLink="/auth/login" 
              class="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
            >
              Iniciar Sesión
            </a>
            <a 
              routerLink="/auth/register" 
              class="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Registrarse
            </a>
          </div>
        }

        <!-- Mobile Menu Button - Solo si está autenticado -->
        @if (isAuthenticated()) {
          <button 
            (click)="toggleMobileMenu()"
            class="md:hidden flex items-center p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        }
      </nav>

      <!-- Mobile Menu - Solo si está autenticado -->
      @if (isAuthenticated() && showMobileMenu) {
        <div class="absolute top-16 left-0 right-0 bg-gray-800 border-t border-gray-700 md:hidden">
          <div class="px-4 py-2 space-y-2">
            <!-- User Info Mobile -->
            <div class="flex items-center space-x-3 py-3 border-b border-gray-700">
              <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-sm font-semibold">
                {{ getUserInitials() }}
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-200">{{ currentUser()?.name }}</span>
                <span class="text-xs text-gray-400">{{ currentUser()?.email }}</span>
                @if (isAdmin()) {
                  <span class="inline-flex px-2 py-1 text-xs font-medium bg-yellow-600 text-yellow-100 rounded-full w-fit mt-1">
                    Admin
                  </span>
                }
              </div>
            </div>
            
            <!-- Navigation Links Mobile -->
            <a routerLink="/todos" (click)="closeMobileMenu()" class="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200">
              Mis Tareas
            </a>
            <a routerLink="/dashboard" (click)="closeMobileMenu()" class="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200">
              Dashboard
            </a>
            
            <!-- Logout Mobile -->
            <button 
              (click)="onLogout()" 
              [disabled]="isLoading()"
              class="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              @if (isLoading()) {
                <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              } @else {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              }
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      }
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHeader {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Señales del servicio
  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;
  isAdmin = this.authService.isAdmin;
  isLoading = this.authService.isLoading;

  // Estado del menú móvil
  showMobileMenu = false;

  /**
   * Maneja el logout del usuario
   */
  onLogout(): void {
    this.authService.logout().subscribe({
      next: (result) => {
        if (result.success) {
          this.router.navigate(['/auth/login']);
          this.closeMobileMenu();
        } else {
          console.error('Error al cerrar sesión:', result.error);
        }
      },
      error: (error) => {
        console.error('Error inesperado al cerrar sesión:', error);
      }
    });
  }

  /**
   * Obtiene las iniciales del usuario para el avatar
   */
  getUserInitials(): string {
    const user = this.currentUser();
    if (!user?.name) return 'U';
    
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  /**
   * Alterna la visibilidad del menú móvil
   */
  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  /**
   * Cierra el menú móvil
   */
  closeMobileMenu(): void {
    this.showMobileMenu = false;
  }
}