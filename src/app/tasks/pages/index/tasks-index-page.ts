import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '@app/tasks/services';
import { TaskCard } from './components/task-card/task-card';
import { Task, TaskStatus, TaskQueryParams } from '@app/tasks/interfaces';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'tasks-index-page',
  imports: [TaskCard, RouterLink],
  templateUrl: './tasks-index-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksIndexPage implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);

  // Señales del servicio
  tasks = this.taskService.tasks;
  isLoading = this.taskService.isLoading;
  taskStats = this.taskService.taskStats;

  // Filtros locales
  selectedFilter = signal<TaskStatus | 'all'>('all');
  searchTerm = signal('');

  // Tareas filtradas computadas
  filteredTasks = (): Task[] => {
    let tasks = this.tasks();

    // Filtrar por estado
    if (this.selectedFilter() !== 'all') {
      tasks = tasks.filter(task => task.status === this.selectedFilter());
    }

    // Filtrar por término de búsqueda
    const search = this.searchTerm().toLowerCase().trim();
    if (search) {
      tasks = tasks.filter(task =>
        task.title.toLowerCase().includes(search) ||
        task.description?.toLowerCase().includes(search)
      );
    }

    return tasks;
  };

  ngOnInit(): void {
    this.loadTasks();
  }

  /**
   * Carga las tareas desde el servicio
   */
  loadTasks(): void {
    const params: TaskQueryParams = {
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };

    this.taskService.getAllTasks(params).subscribe({
      next: (result) => {
        if (!result.success) {
          toast.error('Error al cargar tareas', {
            description: result.error || 'No se pudieron cargar las tareas'
          });
        }
      },
      error: (error) => {
        console.error('Error cargando tareas:', error);
        toast.error('Error inesperado', {
          description: 'Ocurrió un problema al cargar las tareas'
        });
      }
    });
  }

  /**
   * Maneja la edición de una tarea
   */
  onEditTask(task: Task): void {
    this.router.navigate(['/edit', task.id]);
  }

  /**
   * Maneja el cambio de estado de una tarea
   */
  onChangeTaskStatus(event: { task: Task; newStatus: TaskStatus }): void {
    const { task, newStatus } = event;

    this.taskService.updateTaskById(task.id, { status: newStatus }).subscribe({
      next: (result) => {
        if (result.success) {
          toast.success('Estado actualizado', {
            description: `"${task.title}" ahora está ${this.getStatusText(newStatus)}`
          });
        } else {
          toast.error('Error al actualizar', {
            description: result.error || 'No se pudo cambiar el estado'
          });
        }
      },
      error: (error) => {
        console.error('Error cambiando estado:', error);
        toast.error('Error inesperado', {
          description: 'No se pudo cambiar el estado de la tarea'
        });
      }
    });
  }

  /**
   * Maneja la eliminación de una tarea
   */
  onDeleteTask(task: Task): void {
    if (confirm(`¿Estás seguro de que quieres eliminar "${task.title}"?`)) {
      this.taskService.deleteTaskById(task.id).subscribe({
        next: (result) => {
          if (!result.success) {
            toast.error('Error al eliminar', {
              description: result.error || 'No se pudo eliminar la tarea'
            });
          }
          // El toast de éxito ya se muestra en el servicio
        },
        error: (error) => {
          console.error('Error eliminando tarea:', error);
          toast.error('Error inesperado', {
            description: 'No se pudo eliminar la tarea'
          });
        }
      });
    }
  }

  /**
   * Actualiza el filtro de estado
   */
  onFilterChange(filter: TaskStatus | 'all'): void {
    this.selectedFilter.set(filter);
  }

  /**
   * Actualiza el término de búsqueda
   */
  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  /**
   * Refresca la lista de tareas
   */
  onRefresh(): void {
    this.taskService.refreshTasks();
    toast.info('Actualizando...', {
      description: 'Refrescando lista de tareas'
    });
  }

  /**
   * Convierte el estado a texto en español
   */
  private getStatusText(status: TaskStatus): string {
    switch (status) {
      case 'pending':
        return 'pendiente';
      case 'in-progress':
        return 'en progreso';
      case 'completed':
        return 'completada';
      default:
        return 'desconocido';
    }
  }
}
export default TasksIndexPage;