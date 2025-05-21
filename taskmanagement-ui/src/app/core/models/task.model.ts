export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  personId?: number;
  personName?: string; // For display purposes
  createdAt?: string;
  updatedAt?: string;
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface TaskResponse {
  content: Task[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export class TaskCreate implements Omit<Task, 'id' | 'createdAt' | 'updatedAt'> {
  title: string = '';
  description: string = '';
  status: TaskStatus = TaskStatus.TODO;
  priority: TaskPriority = TaskPriority.MEDIUM;
  dueDate?: string;
  personId?: number;
}