import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../core/services/task.service';
import { PersonService } from '../../core/services/person.service';
import { Task } from '../../core/models/task.model';
import { PersonResponse } from '../../core/models/person.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container fade-in">
      <div class="welcome-section">
        <h1>Welcome to Task & Person Manager</h1>
        <p>Manage your team and tasks efficiently with our simple yet powerful application.</p>
      </div>
      
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h2>{{ personCount }}</h2>
            <p>People</p>
          </div>
          <a routerLink="/persons" class="stat-link">View All</a>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <h2>{{ taskCount }}</h2>
            <p>Tasks</p>
          </div>
          <a routerLink="/tasks" class="stat-link">View All</a>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🚀</div>
          <div class="stat-info">
            <h2>{{ pendingTaskCount }}</h2>
            <p>Pending Tasks</p>
          </div>
          <a routerLink="/tasks" class="stat-link">View Tasks</a>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-info">
            <h2>{{ completedTaskCount }}</h2>
            <p>Completed Tasks</p>
          </div>
          <a routerLink="/tasks" class="stat-link">View Tasks</a>
        </div>
      </div>
      
      <div class="actions-section">
        <a routerLink="/persons/new" class="action-card">
          <h3>Add New Person</h3>
          <p>Register a new team member to your organization.</p>
        </a>
        
        <a routerLink="/tasks/new" class="action-card">
          <h3>Create New Task</h3>
          <p>Add a new task and assign it to a team member.</p>
        </a>
      </div>
      
      <div class="recent-section">
        <div class="recent-tasks">
          <div class="section-header">
            <h2>Recent Tasks</h2>
            <a routerLink="/tasks" class="btn btn-sm">View All</a>
          </div>
          
          <div *ngIf="loadingTasks" class="text-center p-4">
            <div class="spinner"></div>
          </div>
          
          <div *ngIf="!loadingTasks && recentTasks.length === 0" class="empty-state">
            <p>No tasks found.</p>
            <a routerLink="/tasks/new" class="btn btn-primary mt-2">Create Task</a>
          </div>
          
          <div *ngIf="!loadingTasks && recentTasks.length > 0" class="recent-list">
            <div *ngFor="let task of recentTasks; let i = index" 
                 class="recent-item slide-in-up" 
                 [style.animation-delay.ms]="i * 50">
              <div class="recent-item-header">
                <a [routerLink]="['/tasks', task.id]" class="recent-item-title">{{ task.title }}</a>
                <span [class]="'badge badge-' + getStatusClass(task.status)">{{ task.status }}</span>
              </div>
              <div class="recent-item-meta">
                <span [class]="'badge badge-' + getPriorityClass(task.priority)">{{ task.priority }}</span>
                <span *ngIf="task.personName">Assigned to: {{ task.personName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .welcome-section {
      text-align: center;
      margin-bottom: var(--space-8);
      padding: var(--space-8) 0;
    }
    
    .welcome-section h1 {
      margin-bottom: var(--space-3);
      font-size: 2.5rem;
      color: var(--color-primary);
    }
    
    .welcome-section p {
      font-size: 1.25rem;
      color: var(--color-neutral-600);
      max-width: 700px;
      margin: 0 auto;
    }
    
    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: var(--space-4);
      margin-bottom: var(--space-8);
    }
    
    .stat-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--space-4);
      box-shadow: var(--shadow-md);
      display: flex;
      flex-direction: column;
      transition: var(--transition-normal);
      position: relative;
      overflow: hidden;
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
    }
    
    .stat-icon {
      font-size: 2.5rem;
      margin-bottom: var(--space-3);
    }
    
    .stat-info {
      margin-bottom: var(--space-3);
    }
    
    .stat-info h2 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: var(--space-1);
      color: var(--color-neutral-900);
    }
    
    .stat-info p {
      color: var(--color-neutral-500);
      font-size: 1rem;
      margin: 0;
    }
    
    .stat-link {
      color: var(--color-primary);
      text-decoration: none;
      font-weight: 500;
      margin-top: auto;
      transition: var(--transition-normal);
    }
    
    .stat-link:hover {
      color: var(--color-primary-dark);
    }
    
    .actions-section {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-4);
      margin-bottom: var(--space-8);
    }
    
    .action-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--space-6);
      box-shadow: var(--shadow-md);
      text-decoration: none;
      color: var(--color-neutral-800);
      border-left: 4px solid var(--color-primary);
      transition: var(--transition-normal);
    }
    
    .action-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
      border-left-width: 8px;
    }
    
    .action-card h3 {
      color: var(--color-primary);
      margin-bottom: var(--space-2);
      font-size: 1.5rem;
    }
    
    .action-card p {
      color: var(--color-neutral-600);
      margin: 0;
    }
    
    .recent-section {
      margin-bottom: var(--space-8);
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
    }
    
    .recent-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    
    .recent-item {
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--space-4);
      box-shadow: var(--shadow-sm);
      transition: var(--transition-normal);
      border: 1px solid var(--color-neutral-200);
    }
    
    .recent-item:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      border-color: var(--color-primary-light);
    }
    
    .recent-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-2);
    }
    
    .recent-item-title {
      font-weight: 600;
      color: var(--color-neutral-900);
      text-decoration: none;
    }
    
    .recent-item-title:hover {
      color: var(--color-primary);
    }
    
    .recent-item-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      color: var(--color-neutral-600);
    }
    
    .empty-state {
      text-align: center;
      padding: var(--space-6);
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }
    
    @media (max-width: 768px) {
      .welcome-section {
        padding: var(--space-4) 0;
      }
      
      .welcome-section h1 {
        font-size: 2rem;
      }
      
      .welcome-section p {
        font-size: 1rem;
      }
      
      .stat-card, .action-card {
        padding: var(--space-3);
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  personCount = 0;
  taskCount = 0;
  pendingTaskCount = 0;
  completedTaskCount = 0;
  
  recentTasks: Task[] = [];
  loadingTasks = true;
  
  constructor(
    private taskService: TaskService,
    private personService: PersonService
  ) {}
  
  ngOnInit(): void {
    this.loadStats();
    this.loadRecentTasks();
  }
  
  loadStats(): void {
    this.personService.getPersons(0, 1).subscribe({
      next: (response: PersonResponse) => {
        this.personCount = response.totalElements;
      },
      error: (error) => {
        console.error('Error loading person stats', error);
      }
    });
    
    this.taskService.getTasks(0, 100).subscribe({
      next: (response) => {
        this.taskCount = response.totalElements;
        
        // Calculate task stats
        if (response.content && response.content.length > 0) {
          this.pendingTaskCount = response.content.filter(task => 
            task.status === 'TODO' || task.status === 'IN_PROGRESS'
          ).length;
          
          this.completedTaskCount = response.content.filter(task => 
            task.status === 'COMPLETED'
          ).length;
        }
      },
      error: (error) => {
        console.error('Error loading task stats', error);
      }
    });
  }
  
  loadRecentTasks(): void {
    this.loadingTasks = true;
    
    this.taskService.getTasks(0, 5).subscribe({
      next: (response) => {
        this.recentTasks = response.content;
        this.loadingTasks = false;
      },
      error: (error) => {
        console.error('Error loading recent tasks', error);
        this.loadingTasks = false;
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
}