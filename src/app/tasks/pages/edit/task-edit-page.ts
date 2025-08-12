
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TaskService } from '@app/tasks/services';
import { Task, UpdateTaskData, TaskStatus } from '@app/tasks/interfaces';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'task-edit-page',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './task-edit-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskEditPage implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Señales del componente
  private readonly _currentTask = signal<Task | null>(null);
  private readonly _isLoadingTask = signal(false);

  // Señales públicas
  readonly currentTask = this._currentTask.asReadonly();
  readonly isLoadingTask = this._isLoadingTask.asReadonly();

  // Señales del servicio para el template
  isLoading = this.taskService.isLoading;

  editTaskForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    status: ['pending', [Validators.required]]
  });

  // Opciones de estado disponibles
  statusOptions: { value: TaskStatus; label: string; color: string }[] = [
    { value: 'pending', label: 'Pendiente', color: 'text-yellow-400' },
    { value: 'in-progress', label: 'En Progreso', color: 'text-blue-400' },
    { value: 'completed', label: 'Completada', color: 'text-green-400' }
  ];

  ngOnInit(): void {
    this.loadTask();
  }

  /**
   * Carga la tarea a editar
   */
  private loadTask(): void {
    const taskId = this.route.snapshot.paramMap.get('taskId');

    if (!taskId) {
      toast.error('Error', { description: 'ID de tarea no válido' });
      this.router.navigate(['/tasks']);
      return;
    }

    this._isLoadingTask.set(true);

    this.taskService.getTaskById(taskId).subscribe({
      next: (result) => {
        if (result.success && result.data) {
          this._currentTask.set(result.data);
          this.populateForm(result.data);
        } else {
          toast.error('Error al cargar tarea', {
            description: result.error || 'No se pudo cargar la tarea'
          });
          this.router.navigate(['/tasks']);
        }
        this._isLoadingTask.set(false);
      },
      error: (error) => {
        console.error('Error cargando tarea:', error);
        toast.error('Error inesperado', {
          description: 'No se pudo cargar la tarea'
        });
        this.router.navigate(['/tasks']);
        this._isLoadingTask.set(false);
      }
    });
  }

  /**
   * Popula el formulario con los datos de la tarea
   */
  private populateForm(task: Task): void {
    this.editTaskForm.patchValue({
      title: task.title,
      description: task.description,
      status: task.status
    });
  }

  /**
   * Maneja la actualización de la tarea
   */
  onUpdateTask(): void {
    const currentTask = this._currentTask();

    if (!currentTask) {
      toast.error('Error', { description: 'No se encontró la tarea a actualizar' });
      return;
    }

    if (this.editTaskForm.valid) {
      const formData = this.editTaskForm.value;

      const updateData: UpdateTaskData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || '',
        status: formData.status
      };

      this.taskService.updateTaskById(currentTask.id, updateData).subscribe({
        next: (result) => {
          if (result.success) {
            toast.success('¡Tarea actualizada exitosamente!', {
              description: `"${result.data?.title}" ha sido actualizada`
            });
            this.router.navigate(['/tasks']);
          } else {
            toast.error('Error al actualizar tarea', {
              description: result.error || 'No se pudo actualizar la tarea'
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
        description: 'Por favor completa todos los campos requeridos correctamente'
      });
    }
  }

  /**
   * Cancela la edición y regresa a la lista
   */
  onCancel(): void {
    if (this.hasUnsavedChanges()) {
      if (confirm('¿Estás seguro de que quieres cancelar? Se perderán los cambios realizados.')) {
        this.router.navigate(['/tasks']);
      }
    } else {
      this.router.navigate(['/tasks']);
    }
  }

  /**
   * Verifica si hay cambios sin guardar
   */
  private hasUnsavedChanges(): boolean {
    const currentTask = this._currentTask();
    if (!currentTask) return false;

    const formValues = this.editTaskForm.value;
    return (
      formValues.title?.trim() !== currentTask.title ||
      formValues.description?.trim() !== currentTask.description ||
      formValues.status !== currentTask.status
    );
  }

  /**
   * Marca todos los campos como tocados para mostrar errores
   */
  private markAllFieldsAsTouched(): void {
    Object.keys(this.editTaskForm.controls).forEach(key => {
      this.editTaskForm.get(key)?.markAsTouched();
    });
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  getFieldError(fieldName: string): string {
    const field = this.editTaskForm.get(fieldName);

    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `Mínimo ${minLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        return `Máximo ${maxLength} caracteres`;
      }
    }

    return '';
  }

  /**
   * Verifica si un campo tiene errores
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.editTaskForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }

  /**
   * Obtiene la etiqueta amigable para un campo
   */
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'title': 'Título',
      'description': 'Descripción',
      'status': 'Estado'
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Obtiene el label del estado seleccionado
   */
  getSelectedStatusLabel(): string {
    const selectedStatus = this.editTaskForm.get('status')?.value;
    const statusOption = this.statusOptions.find(option => option.value === selectedStatus);
    return statusOption?.label || 'Desconocido';
  }

  /**
   * Obtiene la fecha actual formateada
   */
  getCurrentDateFormatted(): string {
    return new Date().toLocaleDateString('es-ES');
  }

  /**
   * Obtiene la clase CSS para el borde de la preview card
   */
  getPreviewBorderClass(): string {
    const status = this.editTaskForm.get('status')?.value;
    switch (status) {
      case 'pending':
        return 'border-l-yellow-500';
      case 'in-progress':
        return 'border-l-blue-500';
      case 'completed':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  }

  /**
   * Obtiene la clase CSS para el badge de estado en la preview
   */
  getPreviewBadgeClass(): string {
    const status = this.editTaskForm.get('status')?.value;
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
   * Obtiene la fecha de actualización formateada
   */
  getLastUpdatedFormatted(): string {
    const currentTask = this._currentTask();
    if (currentTask?.updatedAt) {
      return currentTask.updatedAt.toLocaleDateString('es-ES');
    }
    return '';
  }
}

export default TaskEditPage;