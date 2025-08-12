import { User } from "@app/auth/interfaces";

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  user:User
  title: string;
  description?: string;
  status: TaskStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface TaskQueryParams {
  status?: TaskStatus;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface TaskServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}