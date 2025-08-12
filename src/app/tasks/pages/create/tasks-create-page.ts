import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '@app/tasks/services';
import { CreateTaskData, TaskStatus } from '@app/tasks/interfaces';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'tasks-create-page',
  imports: [ReactiveFormsModule],
  templateUrl: './tasks-create-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksCreatePage {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private router = inject(Router);

  createTaskForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    status: ['pending', [Validators.required]]
  });

  // Señales del servicio para el template
  isLoading = this.taskService.isLoading;

  // Opciones de estado disponibles
  statusOptions: { value: TaskStatus; label: string; color: string }[] = [
    { value: 'pending', label: 'Pendiente', color: 'text-yellow-400' },
    { value: 'in-progress', label: 'En Progreso', color: 'text-blue-400' },
    { value: 'completed', label: 'Completada', color: 'text-green-400' }
  ];

  /**
   * Maneja la creación de una nueva tarea
   */
  onCreateTask(): void {
    if (this.createTaskForm.valid) {
      const formData = this.createTaskForm.value;

      const taskData: CreateTaskData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || '',
        status: formData.status
      };

      this.taskService.createNewTask(taskData).subscribe({
        next: (result) => {
          if (result.success) {
            toast.success('¡Tarea creada exitosamente!', {
              description: `"${result.data?.title}" ha sido agregada a tu lista`
            });
            this.router.navigate(['/tasks']);
          } else {
            toast.error('Error al crear tarea', {
              description: result.error || 'No se pudo crear la tarea'
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
   * Cancela la creación y regresa a la lista
   */
  onCancel(): void {
    if (this.hasUnsavedChanges()) {
      if (confirm('¿Estás seguro de que quieres cancelar? Se perderán los datos ingresados.')) {
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
    const formValues = this.createTaskForm.value;
    return !!(formValues.title?.trim() || formValues.description?.trim());
  }

  /**
   * Marca todos los campos como tocados para mostrar errores
   */
  private markAllFieldsAsTouched(): void {
    Object.keys(this.createTaskForm.controls).forEach(key => {
      this.createTaskForm.get(key)?.markAsTouched();
    });
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  getFieldError(fieldName: string): string {
    const field = this.createTaskForm.get(fieldName);

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
    const field = this.createTaskForm.get(fieldName);
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
   * Obtiene la clase CSS para el estado seleccionado
   */
  getSelectedStatusColor(): string {
    const selectedStatus = this.createTaskForm.get('status')?.value;
    const statusOption = this.statusOptions.find(option => option.value === selectedStatus);
    return statusOption?.color || 'text-gray-400';
  }

  /**
   * Obtiene el label del estado seleccionado
   */
  getSelectedStatusLabel(): string {
    const selectedStatus = this.createTaskForm.get('status')?.value;
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
    const status = this.createTaskForm.get('status')?.value;
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
    const status = this.createTaskForm.get('status')?.value;
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
}
export default TasksCreatePage;