import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../../../core/services/task.service';
import { Task, TaskResponse, TaskStatus } from '../../../../core/models/task.model';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    ConfirmationDialogComponent, 
    PaginationComponent,
    AlertComponent
  ],
  template: `
    <div class="container fade-in">
      <div class="list-header">
        <h1>Tasks</h1>
        <a routerLink="/tasks/new" class="btn btn-primary">
          Add New Task
        </a>
      </div>
      
      <app-alert 
        *ngIf="showAlert"
        [message]="alertMessage"
        [type]="alertType"
        [autoDismiss]="true"
        (dismiss)="showAlert = false"
      ></app-alert>
      
      <div class="card mb-4">
        <div class="card-body">
          <div class="filter-controls mb-4">
            <div class="d-flex justify-content-between align-items-center flex-wrap">
              <div class="filter-group">
                <label for="statusFilter" class="mr-2">Status:</label>
                <select id="statusFilter" class="form-control form-control-sm" 
                  (change)="onStatusFilterChange($event)">
                  <option value="ALL">All Statuses</option>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
          
          <div *ngIf="loading" class="text-center p-4">
            <div class="spinner"></div>
            <p class="mt-2">Loading tasks...</p>
          </div>
          
          <div *ngIf="!loading && tasks.length === 0" class="text-center p-4">
            <p>No tasks found. Click "Add New Task" to create one.</p>
          </div>
          
          <div *ngIf="!loading && tasks.length > 0" class="tasks-grid">
            <div *ngFor="let task of tasks; let i = index" class="task-card slide-in-up" [style.animation-delay.ms]="i * 50">
              <div class="task-card-header">
                <span [class]="'badge badge-' + getStatusClass(task.status)">{{ task.status }}</span>
                <span [class]="'badge badge-' + getPriorityClass(task.priority)">{{ task.priority }}</span>
              </div>
              <h3 class="task-title">
                <a [routerLink]="['/tasks', task.id]">{{ task.title }}</a>
              </h3>
              <p *ngIf="task.description" class="task-description">{{ 
                task.description.length > 80 ? task.description.substring(0, 80) + '...' : task.description 
              }}</p>
              <div class="task-meta">
                <div *ngIf="task.personName" class="task-assignee">
                  <strong>Assigned to:</strong> {{ task.personName }}
                </div>
                <div *ngIf="task.dueDate" class="task-due-date" [class.overdue]="isOverdue(task.dueDate)">
                  <strong>Due:</strong> {{ task.dueDate | date:'mediumDate' }}
                </div>
              </div>
              <div class="task-actions">
                <a [routerLink]="['/tasks', task.id]" class="btn btn-sm">
                  View
                </a>
                <a [routerLink]="['/tasks', task.id, 'edit']" class="btn btn-sm btn-secondary">
                  Edit
                </a>
                <button class="btn btn-sm btn-danger" (click)="confirmDelete(task)">
                  Delete
                </button>
              </div>
            </div>
          </div>
          
          <app-pagination
            [currentPage]="currentPage"
            [totalPages]="totalPages"
            (pageChange)="onPageChange($event)"
          ></app-pagination>
        </div>
      </div>
    </div>
    
    <app-confirmation-dialog
      [isOpen]="showDeleteDialog"
      title="Delete Task"
      [message]="'Are you sure you want to delete task: ' + (taskToDelete?.title || '') + '?'"
      confirmText="Delete"
      confirmButtonClass="btn-danger"
      (confirm)="deleteTask()"
      (cancel)="cancelDelete()"
    ></app-confirmation-dialog>
  `,
  styles: [`
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
    }
    
    .filter-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .filter-group {
      display: flex;
      align-items: center;
    }
    
    .filter-group .form-control {
      width: auto;
      min-width: 150px;
    }
    
    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-4);
    }
    
    .task-card {
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--color-neutral-200);
      padding: var(--space-4);
      display: flex;
      flex-direction: column;
      transition: var(--transition-normal);
    }
    
    .task-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      border-color: var(--color-primary-light);
    }
    
    .task-card-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--space-3);
    }
    
    .task-title {
      margin-bottom: var(--space-2);
      font-size: 1.25rem;
    }
    
    .task-title a {
      color: var(--color-neutral-800);
      text-decoration: none;
      transition: var(--transition-normal);
    }
    
    .task-title a:hover {
      color: var(--color-primary);
    }
    
    .task-description {
      margin-bottom: var(--space-3);
      color: var(--color-neutral-600);
      font-size: 0.9rem;
      flex-grow: 1;
    }
    
    .task-meta {
      margin-bottom: var(--space-3);
      font-size: 0.85rem;
    }
    
    .task-assignee, .task-due-date {
      margin-bottom: var(--space-1);
    }
    
    .overdue {
      color: var(--color-error);
    }
    
    .task-actions {
      display: flex;
      gap: var(--space-2);
      margin-top: auto;
      padding-top: var(--space-3);
      border-top: 1px solid var(--color-neutral-200);
    }
    
    @media (max-width: 768px) {
      .list-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
      }
      
      .filter-controls {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
      }
      
      .tasks-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = true;
  currentPage = 0;
  pageSize = 12;
  totalPages = 0;
  totalElements = 0;
  
  statusFilter: string = 'ALL';
  
  showDeleteDialog = false;
  taskToDelete: Task | null = null;
  
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'warning' | 'error' = 'success';
  
  constructor(private taskService: TaskService) {}
  
  ngOnInit(): void {
    this.loadTasks();
  }
  
  loadTasks(): void {
    this.loading = true;
    
    this.taskService.getTasks(this.currentPage, this.pageSize).subscribe({
      next: (response: TaskResponse) => {
        this.tasks = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        
        // Apply status filter if it's set
        if (this.statusFilter !== 'ALL') {
          this.tasks = this.tasks.filter(task => task.status === this.statusFilter);
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tasks', error);
        this.showAlertMessage('Failed to load tasks. Please try again later.', 'error');
        this.loading = false;
      }
    });
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTasks();
  }
  
  onStatusFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.statusFilter = select.value;
    this.currentPage = 0; // Reset to first page
    this.loadTasks();
  }
  
  confirmDelete(task: Task): void {
    this.taskToDelete = task;
    this.showDeleteDialog = true;
  }
  
  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.taskToDelete = null;
  }
  
  deleteTask(): void {
    if (!this.taskToDelete || !this.taskToDelete.id) return;
    
    const taskId = this.taskToDelete.id;
    const taskTitle = this.taskToDelete.title;
    
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.showAlertMessage(`Task "${taskTitle}" has been deleted successfully.`, 'success');
        
        // Reload if page is empty (except first page)
        if (this.tasks.length === 0 && this.currentPage > 0) {
          this.currentPage--;
          this.loadTasks();
        }
      },
      error: (error) => {
        console.error('Error deleting task', error);
        this.showAlertMessage(`Failed to delete task "${taskTitle}". Please try again later.`, 'error');
      },
      complete: () => {
        this.showDeleteDialog = false;
        this.taskToDelete = null;
      }
    });
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'TODO': return 'secondary';
      case 'IN_PROGRESS': return 'primary';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'secondary';
    }
  }
  
  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'LOW': return 'secondary';
      case 'MEDIUM': return 'accent';
      case 'HIGH': return 'warning';
      case 'URGENT': return 'error';
      default: return 'secondary';
    }
  }
  
  isOverdue(dueDate: string): boolean {
    return new Date(dueDate) < new Date();
  }
  
  showAlertMessage(message: string, type: 'success' | 'warning' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }
}