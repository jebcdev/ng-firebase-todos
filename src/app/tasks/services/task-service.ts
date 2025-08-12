import { Injectable, inject, signal, computed } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  Timestamp,
  writeBatch
} from '@angular/fire/firestore';
import { Observable, from, map, catchError, throwError, switchMap } from 'rxjs';
import { AuthService } from '@app/auth/services/auth';
import { CreateTaskData, Task, TaskQueryParams, TaskServiceResult, TaskStatus, UpdateTaskData } from '@app/tasks/interfaces';
import { toast } from 'ngx-sonner';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly firestore = inject(Firestore);
  private readonly authService = inject(AuthService);

  // Señales para el estado del servicio
  private readonly _isLoading = signal(false);
  private readonly _tasks = signal<Task[]>([]);

  // Señales públicas computadas
  readonly isLoading = computed(() => this._isLoading());
  readonly tasks = computed(() => this._tasks());

  // Tareas filtradas por estado
  readonly pendingTasks = computed(() =>
    this._tasks().filter(task => task.status === 'pending')
  );
  readonly inProgressTasks = computed(() =>
    this._tasks().filter(task => task.status === 'in-progress')
  );
  readonly completedTasks = computed(() =>
    this._tasks().filter(task => task.status === 'completed')
  );

  // Estadísticas
  readonly taskStats = computed(() => {
    const tasks = this._tasks();
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length
    };
  });

  /**
   * Obtiene todas las tareas del usuario autenticado con filtros opcionales
   * 
   * @param params - Parámetros de consulta opcionales
   * @returns Observable con el resultado de la operación
   * 
   * @example
   * ```typescript
   * // Obtener todas las tareas
   * this.taskService.getAllTasks().subscribe(result => {
   *   if (result.success) {
   *     console.log('Tareas:', result.data);
   *   }
   * });
   * 
   * // Obtener solo tareas pendientes
   * this.taskService.getAllTasks({ status: 'pending' }).subscribe(result => {
   *   console.log('Tareas pendientes:', result.data);
   * });
   * ```
   */
  getAllTasks(params?: TaskQueryParams): Observable<TaskServiceResult<Task[]>> {
    const currentUser = this.authService.currentUser();

    if (!currentUser) {
      return throwError(() => ({ success: false, error: 'Usuario no autenticado' }));
    }

    this._isLoading.set(true);

    try {
      const tasksCollection = collection(this.firestore, 'tasks');

      // Crear consulta base más simple para evitar índices compuestos
      let q = query(
        tasksCollection,
        where('userId', '==', currentUser.id)
      );

      // Si hay filtro de estado, aplicarlo sin isActive para evitar índice compuesto
      if (params?.status) {
        q = query(q, where('status', '==', params.status));
      } else {
        // Solo aplicar isActive si no hay otros filtros
        q = query(q, where('isActive', '==', true));
      }

      // Aplicar ordenamiento solo si no hay filtros que requieran índices compuestos
      if (!params?.status) {
        const sortBy = params?.sortBy || 'createdAt';
        const sortOrder = params?.sortOrder || 'desc';
        q = query(q, orderBy(sortBy, sortOrder));
      }

      return from(getDocs(q)).pipe(
        map(snapshot => {
          let tasks: Task[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              user: currentUser,
              title: data['title'],
              description: data['description'] || '',
              status: data['status'],
              isActive: data['isActive'],
              createdAt: data['createdAt']?.toDate() || new Date(),
              updatedAt: data['updatedAt']?.toDate() || new Date()
            } as Task;
          });

          // Filtrar tareas activas manualmente si no se aplicó en la consulta
          if (params?.status) {
            tasks = tasks.filter(task => task.isActive);
          }

          // Aplicar ordenamiento manual si no se aplicó en la consulta
          if (params?.status) {
            const sortBy = params?.sortBy || 'createdAt';
            const sortOrder = params?.sortOrder || 'desc';
            tasks.sort((a, b) => {
              const aValue = a[sortBy as keyof Task];
              const bValue = b[sortBy as keyof Task];

              if (aValue instanceof Date && bValue instanceof Date) {
                return sortOrder === 'desc' ? bValue.getTime() - aValue.getTime() : aValue.getTime() - bValue.getTime();
              }

              if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'desc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
              }

              return 0;
            });
          }

          // Aplicar límite si se especifica
          const limitedTasks = params?.limit ? tasks.slice(0, params.limit) : tasks;

          this._tasks.set(limitedTasks);
          this._isLoading.set(false);

          return {
            success: true,
            data: limitedTasks
          };
        }),
        catchError(error => {
          this._isLoading.set(false);
          console.error('Error obteniendo tareas:', error);
          return throwError(() => ({
            success: false,
            error: 'Error al cargar las tareas'
          }));
        })
      );
    } catch (error) {
      this._isLoading.set(false);
      return throwError(() => ({
        success: false,
        error: 'Error al consultar las tareas'
      }));
    }
  }

  /**
   * Obtiene una tarea específica por ID
   * 
   * @param taskId - ID de la tarea a obtener
   * @returns Observable con el resultado de la operación
   * 
   * @example
   * ```typescript
   * this.taskService.getTaskById('task-id-123').subscribe(result => {
   *   if (result.success) {
   *     console.log('Tarea encontrada:', result.data);
   *   }
   * });
   * ```
   */
  getTaskById(taskId: string): Observable<TaskServiceResult<Task>> {
    const currentUser = this.authService.currentUser();

    if (!currentUser) {
      return throwError(() => ({ success: false, error: 'Usuario no autenticado' }));
    }

    this._isLoading.set(true);

    const taskDoc = doc(this.firestore, 'tasks', taskId);

    return from(getDoc(taskDoc)).pipe(
      map(docSnapshot => {
        if (!docSnapshot.exists()) {
          throw new Error('Tarea no encontrada');
        }

        const data = docSnapshot.data();

        // Verificar que la tarea pertenece al usuario actual
        if (data['userId'] !== currentUser.id) {
          throw new Error('No tienes permiso para ver esta tarea');
        }

        const task: Task = {
          id: docSnapshot.id,
          user: currentUser,
          title: data['title'],
          description: data['description'] || '',
          status: data['status'],
          isActive: data['isActive'],
          createdAt: data['createdAt']?.toDate() || new Date(),
          updatedAt: data['updatedAt']?.toDate() || new Date()
        };

        this._isLoading.set(false);

        return {
          success: true,
          data: task
        };
      }),
      catchError(error => {
        this._isLoading.set(false);
        console.error('Error obteniendo tarea:', error);
        return throwError(() => ({
          success: false,
          error: error.message || 'Error al cargar la tarea'
        }));
      })
    );
  }

  /**
   * Crea una nueva tarea para el usuario autenticado
   * 
   * @param taskData - Datos de la nueva tarea
   * @returns Observable con el resultado de la operación
   * 
   * @example
   * ```typescript
   * this.taskService.createNewTask({
   *   title: 'Nueva tarea',
   *   description: 'Descripción de la tarea',
   *   status: 'pending'
   * }).subscribe(result => {
   *   if (result.success) {
   *     console.log('Tarea creada:', result.data);
   *   }
   * });
   * ```
   */
  createNewTask(taskData: CreateTaskData): Observable<TaskServiceResult<Task>> {
    const currentUser = this.authService.currentUser();

    if (!currentUser) {
      return throwError(() => ({ success: false, error: 'Usuario no autenticado' }));
    }

    this._isLoading.set(true);

    const tasksCollection = collection(this.firestore, 'tasks');
    const now = Timestamp.now();

    const newTaskData = {
      userId: currentUser.id,
      title: taskData.title.trim(),
      description: taskData.description?.trim() || '',
      status: taskData.status || 'pending',
      isActive: true,
      createdAt: now,
      updatedAt: now
    };

    return from(addDoc(tasksCollection, newTaskData)).pipe(
      map(docRef => {
        const newTask: Task = {
          id: docRef.id,
          user: currentUser,
          title: newTaskData.title,
          description: newTaskData.description,
          status: newTaskData.status,
          isActive: newTaskData.isActive,
          createdAt: now.toDate(),
          updatedAt: now.toDate()
        };

        // Actualizar el estado local
        const currentTasks = this._tasks();
        this._tasks.set([newTask, ...currentTasks]);
        this._isLoading.set(false);

        toast.success('Tarea creada', {
          description: `"${newTask.title}" ha sido creada exitosamente`
        });

        return {
          success: true,
          data: newTask
        };
      }),
      catchError(error => {
        this._isLoading.set(false);
        console.error('Error creando tarea:', error);

        toast.error('Error al crear tarea', {
          description: 'No se pudo crear la tarea. Intenta nuevamente.'
        });

        return throwError(() => ({
          success: false,
          error: 'Error al crear la tarea'
        }));
      })
    );
  }

  /**
   * Actualiza una tarea existente
   * 
   * @param taskId - ID de la tarea a actualizar
   * @param updateData - Datos a actualizar
   * @returns Observable con el resultado de la operación
   * 
   * @example
   * ```typescript
   * this.taskService.updateTaskById('task-id-123', {
   *   title: 'Título actualizado',
   *   status: 'completed'
   * }).subscribe(result => {
   *   if (result.success) {
   *     console.log('Tarea actualizada:', result.data);
   *   }
   * });
   * ```
   */
  updateTaskById(taskId: string, updateData: UpdateTaskData): Observable<TaskServiceResult<Task>> {
    const currentUser = this.authService.currentUser();

    if (!currentUser) {
      return throwError(() => ({ success: false, error: 'Usuario no autenticado' }));
    }

    this._isLoading.set(true);

    // Primero verificar que la tarea existe y pertenece al usuario
    return this.getTaskById(taskId).pipe(
      map(getResult => {
        if (!getResult.success || !getResult.data) {
          throw new Error('Tarea no encontrada');
        }
        return getResult.data;
      }),
      switchMap(existingTask => {
        const taskDoc = doc(this.firestore, 'tasks', taskId);
        const updatePayload: any = {
          updatedAt: Timestamp.now()
        };

        // Solo actualizar campos que se proporcionaron
        if (updateData.title !== undefined) {
          updatePayload.title = updateData.title.trim();
        }
        if (updateData.description !== undefined) {
          updatePayload.description = updateData.description.trim();
        }
        if (updateData.status !== undefined) {
          updatePayload.status = updateData.status;
        }

        return from(updateDoc(taskDoc, updatePayload)).pipe(
          map(() => {
            const updatedTask: Task = {
              ...existingTask,
              title: updatePayload.title || existingTask.title,
              description: updatePayload.description !== undefined ? updatePayload.description : existingTask.description,
              status: updatePayload.status || existingTask.status,
              updatedAt: updatePayload.updatedAt.toDate()
            };

            // Actualizar el estado local
            const currentTasks = this._tasks();
            const updatedTasks = currentTasks.map(task =>
              task.id === taskId ? updatedTask : task
            );
            this._tasks.set(updatedTasks);
            this._isLoading.set(false);

            toast.success('Tarea actualizada', {
              description: `"${updatedTask.title}" ha sido actualizada`
            });

            return {
              success: true,
              data: updatedTask
            };
          })
        );
      }),
      catchError(error => {
        this._isLoading.set(false);
        console.error('Error actualizando tarea:', error);

        toast.error('Error al actualizar tarea', {
          description: 'No se pudo actualizar la tarea. Intenta nuevamente.'
        });

        return throwError(() => ({
          success: false,
          error: error.message || 'Error al actualizar la tarea'
        }));
      })
    );
  }

  /**
   * Marca una tarea como inactiva (eliminación lógica)
   * 
   * @param taskId - ID de la tarea a eliminar
   * @returns Observable con el resultado de la operación
   * 
   * @example
   * ```typescript
   * this.taskService.deleteTaskById('task-id-123').subscribe(result => {
   *   if (result.success) {
   *     console.log('Tarea eliminada exitosamente');
   *   }
   * });
   * ```
   */
  deleteTaskById(taskId: string): Observable<TaskServiceResult<boolean>> {
    const currentUser = this.authService.currentUser();

    if (!currentUser) {
      return throwError(() => ({ success: false, error: 'Usuario no autenticado' }));
    }

    this._isLoading.set(true);

    // Verificar que la tarea existe y pertenece al usuario
    return this.getTaskById(taskId).pipe(
      map(getResult => {
        if (!getResult.success || !getResult.data) {
          throw new Error('Tarea no encontrada');
        }
        return getResult.data;
      }),
      switchMap(existingTask => {
        const taskDoc = doc(this.firestore, 'tasks', taskId);
        const updatePayload = {
          isActive: false,
          updatedAt: Timestamp.now()
        };

        return from(updateDoc(taskDoc, updatePayload)).pipe(
          map(() => {
            // Remover del estado local
            const currentTasks = this._tasks();
            const filteredTasks = currentTasks.filter(task => task.id !== taskId);
            this._tasks.set(filteredTasks);
            this._isLoading.set(false);

            toast.success('Tarea eliminada', {
              description: `"${existingTask.title}" ha sido eliminada`
            });

            return {
              success: true,
              data: true
            };
          })
        );
      }),
      catchError(error => {
        this._isLoading.set(false);
        console.error('Error eliminando tarea:', error);

        toast.error('Error al eliminar tarea', {
          description: 'No se pudo eliminar la tarea. Intenta nuevamente.'
        });

        return throwError(() => ({
          success: false,
          error: error.message || 'Error al eliminar la tarea'
        }));
      })
    );
  }

  /**
   * Refresca la lista de tareas desde Firestore
   */
  refreshTasks(params?: TaskQueryParams): void {
    this.getAllTasks(params).subscribe({
      next: (result) => {
        if (!result.success) {
          console.error('Error refrescando tareas:', result.error);
        }
      },
      error: (error) => {
        console.error('Error inesperado refrescando tareas:', error);
      }
    });
  }

  /**
   * Limpia el estado local de tareas
   */
  clearTasks(): void {
    this._tasks.set([]);
  }
}