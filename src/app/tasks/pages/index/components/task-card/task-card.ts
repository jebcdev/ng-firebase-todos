import { ChangeDetectionStrategy, Component, input, output, signal, ElementRef, inject, HostListener } from '@angular/core';
import { Task, TaskStatus } from '@app/tasks/interfaces';

@Component({
  selector: 'task-card',
  imports: [],
  templateUrl: './task-card.html',
  styles: `
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCard {
  private elementRef = inject(ElementRef);

  task = input.required<Task>();

  // Outputs para eventos
  editTask = output<Task>();
  deleteTask = output<Task>();
  changeStatus = output<{ task: Task; newStatus: TaskStatus }>();

  // Estado del menú
  showMenu = signal(false);
  menuPosition = signal<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right');

  /**
   * Cierra el menú cuando se hace scroll
   */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (this.showMenu()) {
      this.showMenu.set(false);
    }
  }

  /**
   * Cierra el menú cuando se redimensiona la ventana
   */
  @HostListener('window:resize', [])
  onWindowResize(): void {
    if (this.showMenu()) {
      this.showMenu.set(false);
    }
  }

  /**
   * Obtiene la clase CSS para el borde de la card según el estado
   */
  getCardBorderClass(): string {
    const status = this.task().status;
    const baseClass = 'border-l-4';

    switch (status) {
      case 'pending':
        return `${baseClass} border-l-yellow-500`;
      case 'in-progress':
        return `${baseClass} border-l-blue-500`;
      case 'completed':
        return `${baseClass} border-l-green-500`;
      default:
        return `${baseClass} border-l-gray-500`;
    }
  }

  /**
   * Obtiene la clase CSS para el badge de estado
   */
  getStatusBadgeClass(): string {
    const status = this.task().status;

    switch (status) {
      case 'pending':
        return 'bg-yellow-600 text-yellow-100';
      case 'in-progress':
        return 'bg-blue-600 text-blue-100';
      case 'completed':
        return 'bg-green-600 text-green-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  }

  /**
   * Obtiene el texto del estado en español
   */
  getStatusText(): string {
    const status = this.task().status;

    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'in-progress':
        return 'En Progreso';
      case 'completed':
        return 'Completada';
      default:
        return 'Desconocido';
    }
  }

  /**
   * Formatea una fecha para mostrar
   */
  getFormattedDate(date: Date): string {
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric'
      });
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    }
  }

  /**
   * Maneja el toggle del menú de acciones
   */
  onMenuToggle(event: Event): void {
    event.stopPropagation();

    if (!this.showMenu()) {
      this.calculateMenuPosition();
    }

    this.showMenu.set(!this.showMenu());
  }

  /**
   * Calcula la mejor posición para el menú según la posición de la card
   */
  private calculateMenuPosition(): void {
    try {
      const cardElement = this.elementRef.nativeElement;
      const rect = cardElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calcular si hay espacio suficiente a la derecha para el menú (160px de ancho)
      const hasRightSpace = (viewportWidth - rect.right) >= 160;

      // Calcular si hay espacio suficiente abajo para el menú (120px de alto)
      const hasBottomSpace = (viewportHeight - rect.bottom) >= 120;

      // Determinar la mejor posición (preferir bottom-right)
      if (hasBottomSpace) {
        this.menuPosition.set(hasRightSpace ? 'bottom-right' : 'bottom-left');
      } else {
        this.menuPosition.set(hasRightSpace ? 'top-right' : 'top-left');
      }
    } catch (error) {
      // Fallback a posición por defecto
      this.menuPosition.set('bottom-right');
    }
  }  /**
   * Obtiene las clases CSS para posicionar el menú
   */
  getMenuPositionClass(): string {
    const position = this.menuPosition();
    switch (position) {
      case 'bottom-right':
        return 'right-0 top-full mt-1';
      case 'bottom-left':
        return 'left-0 top-full mt-1';
      case 'top-right':
        return 'right-0 bottom-full mb-1';
      case 'top-left':
        return 'left-0 bottom-full mb-1';
      default:
        return 'right-0 top-full mt-1';
    }
  }

  /**
   * Emite evento para editar la tarea
   */
  onEdit(): void {
    this.editTask.emit(this.task());
    this.showMenu.set(false);
  }

  /**
   * Emite evento para cambiar el estado de la tarea
   */
  onChangeStatus(): void {
    const currentStatus = this.task().status;
    let newStatus: TaskStatus;

    // Ciclo de estados: pending -> in-progress -> completed -> pending
    switch (currentStatus) {
      case 'pending':
        newStatus = 'in-progress';
        break;
      case 'in-progress':
        newStatus = 'completed';
        break;
      case 'completed':
        newStatus = 'pending';
        break;
      default:
        newStatus = 'pending';
    }

    this.changeStatus.emit({ task: this.task(), newStatus });
    this.showMenu.set(false);
  }

  /**
   * Emite evento para eliminar la tarea
   */
  onDelete(): void {
    this.deleteTask.emit(this.task());
    this.showMenu.set(false);
  }
}
