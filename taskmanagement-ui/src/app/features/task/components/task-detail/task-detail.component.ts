import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../../../core/services/task.service';
import { Task, TaskStatus } from '../../../../core/models/task.model';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmationDialogComponent, AlertComponent],
  template: `
    <div class="container fade-in">
      <div class="detail-header">
        <div>
          <h1 *ngIf="!loading && task">{{ task.title }}</h1>
          <h1 *ngIf="loading" class="loading-placeholder">Loading task details...</h1>
        </div>
        <div class="detail-actions">
          <a routerLink="/tasks" class="btn">Back to List</a>
          <a *ngIf="!loading && task" [routerLink]="['/tasks', task.id, 'edit']" class="btn btn-secondary">
            Edit
          </a>
          <button *ngIf="!loading && task" class="btn btn-danger" (click)="confirmDelete()">
            Delete
          </button>
        </div>
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
          <div *ngIf="loading" class="text-center p-4">
            <div class="spinner"></div>
            <p class="mt-2">Loading task details...</p>
          </div>
          
          <div *ngIf="!loading && task" class="task-details">
            <div class="task-header">
              <div class="task-badges">
                <span [class]="'badge badge-' + getStatusClass(task.status)">{{ task.status }}</span>
                <span [class]="'badge badge-' + getPriorityClass(task.priority)">{{ task.priority }}</span>
                <span *ngIf="task.dueDate" [class]="'badge ' + (isOverdue(task.dueDate) ? 'badge-error' : 'badge-secondary')">
                  Due: {{ task.dueDate | date:'mediumDate' }}
                </span>
              </div>
            </div>
            
            <div class="detail-section">
              <h2>Description</h2>
              <p *ngIf="task.description" class="task-description">{{ task.description }}</p>
              <p *ngIf="!task.description" class="text-muted">No description provided.</p>
            </div>
            
            <div class="detail-section">
              <h2>Details</h2>
              <div class="detail-grid">
                <div class="detail-item">
                  <strong>Status:</strong>
                  <span [class]="'text-' + getStatusClass(task.status)">{{ task.status }}</span>
                </div>
                <div class="detail-item">
                  <strong>Priority:</strong>
                  <span [class]="'text-' + getPriorityClass(task.priority)">{{ task.priority }}</span>
                </div>
                <div class="detail-item">
                  <strong>Due Date:</strong>
                  <span [class.text-error]="task.dueDate && isOverdue(task.dueDate)">
                    {{ task.dueDate ? (task.dueDate | date:'medium') : 'Not set' }}
                  </span>
                </div>
                <div class="detail-item">
                  <strong>Assigned To:</strong>
                  <span *ngIf="task.personId && task.personName">
                    <a [routerLink]="['/persons', task.personId]">{{ task.personName }}</a>
                  </span>
                  <span *ngIf="!task.personId">Unassigned</span>
                </div>
                <div class="detail-item" *ngIf="task.createdAt">
                  <strong>Created:</strong>
                  <span>{{ task.createdAt | date:'medium' }}</span>
                </div>
                <div class="detail-item" *ngIf="task.updatedAt">
                  <strong>Last Updated:</strong>
                  <span>{{ task.updatedAt | date:'medium' }}</span>
                </div>
              </div>
            </div>
            
            <div class="detail-actions-footer">
              <a [routerLink]="['/tasks', task.id, 'edit']" class="btn btn-secondary">
                Edit Task
              </a>
              <button *ngIf="task.status !== 'COMPLETED'" class="btn btn-success" (click)="markAsCompleted()">
                Mark as Completed
              </button>
              <button *ngIf="task.status !== 'CANCELLED'" class="btn btn-danger" (click)="markAsCancelled()">
                Cancel Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <app-confirmation-dialog
      [isOpen]="showDeleteDialog"
      title="Delete Task"
      [message]="'Are you sure you want to delete the task: ' + (task?.title || '') + '?'"
      confirmText="Delete"
      confirmButtonClass="btn-danger"
      (confirm)="deleteTask()"
      (cancel)="cancelDelete()"
    ></app-confirmation-dialog>
    
    <app-confirmation-dialog
      [isOpen]="showStatusDialog"
      [title]="statusDialogTitle"
      [message]="statusDialogMessage"
      confirmText="Confirm"
      [confirmButtonClass]="statusDialogButtonClass"
      (confirm)="confirmStatusChange()"
      (cancel)="cancelStatusChange()"
    ></app-confirmation-dialog>
  `,
  styles: [`
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
    }
    
    .detail-actions {
      display: flex;
      gap: var(--space-2);
    }
    
    .task-header {
      margin-bottom: var(--space-4);
    }
    
    .task-badges {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }
    
    .task-description {
      font-size: 1rem;
      line-height: 1.6;
      white-space: pre-line;
    }
    
    .detail-section {
      margin-bottom: var(--space-6);
    }
    
    .detail-section h2 {
      font-size: 1.25rem;
      margin-bottom: var(--space-3);
      padding-bottom: var(--space-2);
      border-bottom: 1px solid var(--color-neutral-200);
    }
    
    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-4);
    }
    
    .detail-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }
    
    .detail-actions-footer {
      display: flex;
      gap: var(--space-3);
      margin-top: var(--space-6);
      padding-top: var(--space-4);
      border-top: 1px solid var(--color-neutral-200);
    }
    
    .text-muted {
      color: var(--color-neutral-500);
      font-style: italic;
    }
    
    .loading-placeholder {
      color: var(--color-neutral-400);
      animation: pulse 1.5s infinite;
    }
    
    .text-primary { color: var(--color-primary); }
    .text-secondary { color: var(--color-secondary); }
    .text-success { color: var(--color-success); }
    .text-warning { color: var(--color-warning-dark); }
    .text-error { color: var(--color-error); }
    
    @media (max-width: 768px) {
      .detail-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-3);
      }
      
      .detail-grid {
        grid-template-columns: 1fr;
      }
      
      .detail-actions-footer {
        flex-direction: column;
      }
    }
  `]
})
export class TaskDetailComponent implements OnInit {
  taskId!: number;
  task: Task | null = null;
  
  loading = true;
  
  showDeleteDialog = false;
  
  showStatusDialog = false;
  statusDialogTitle = '';
  statusDialogMessage = '';
  statusDialogButtonClass = 'btn-primary';
  newStatus: TaskStatus | null = null;
  
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'warning' | 'error' = 'success';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}
  
  ngOnInit(): void {
    // Check for navigation state messages
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation.extras.state as { message: string };
      if (state.message) {
        this.showAlertMessage(state.message, 'success');
      }
    }
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taskId = +id;
      this.loadTask();
    } else {
      this.router.navigate(['/tasks']);
    }
  }
  
  loadTask(): void {
    this.taskService.getTask(this.taskId).subscribe({
      next: (task: Task) => {
        this.task = task;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading task', error);
        this.showAlertMessage('Failed to load task details. Please try again later.', 'error');
        this.loading = false;
      }
    });
  }
  
  confirmDelete(): void {
    this.showDeleteDialog = true;
  }
  
  cancelDelete(): void {
    this.showDeleteDialog = false;
  }
  
  deleteTask(): void {
    if (!this.task || !this.task.id) return;
    
    this.taskService.deleteTask(this.task.id).subscribe({
      next: () => {
        this.router.navigate(['/tasks'], { 
          state: { message: `Task "${this.task?.title}" has been deleted successfully.` } 
        });
      },
      error: (error) => {
        console.error('Error deleting task', error);
        this.showAlertMessage('Failed to delete task. Please try again later.', 'error');
        this.showDeleteDialog = false;
      }
    });
  }
  
  markAsCompleted(): void {
    this.statusDialogTitle = 'Mark Task as Completed';
    this.statusDialogMessage = `Are you sure you want to mark "${this.task?.title}" as completed?`;
    this.statusDialogButtonClass = 'btn-success';
    this.newStatus = 'COMPLETED' as TaskStatus;
    this.showStatusDialog = true;
  }
  
  markAsCancelled(): void {
    this.statusDialogTitle = 'Cancel Task';
    this.statusDialogMessage = `Are you sure you want to cancel the task "${this.task?.title}"?`;
    this.statusDialogButtonClass = 'btn-danger';
    this.newStatus = 'CANCELLED' as TaskStatus;
    this.showStatusDialog = true;
  }
  
  confirmStatusChange(): void {
    if (!this.task || !this.task.id || !this.newStatus) return;
    
    const updatedTask = { ...this.task, status: this.newStatus };
    
    this.taskService.updateTask(this.task.id, updatedTask).subscribe({
      next: (task: Task) => {
        this.task = task;
        const statusText = this.newStatus === 'COMPLETED' ? 'completed' : 'cancelled';
        this.showAlertMessage(`Task has been marked as ${statusText}.`, 'success');
        this.showStatusDialog = false;
        this.newStatus = null;
      },
      error: (error) => {
        console.error('Error updating task status', error);
        this.showAlertMessage('Failed to update task status. Please try again later.', 'error');
        this.showStatusDialog = false;
        this.newStatus = null;
      }
    });
  }
  
  cancelStatusChange(): void {
    this.showStatusDialog = false;
    this.newStatus = null;
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
  }
}