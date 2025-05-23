import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../../core/services/task.service';
import { PersonService } from '../../../../core/services/person.service';
import { Task, TaskPriority, TaskStatus } from '../../../../core/models/task.model';
import {Person, PersonResponse} from '../../../../core/models/person.model';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertComponent],
  template: `
    <div class="container fade-in">
      <div class="form-header">
        <h1>{{ isEditMode ? 'Edit Task' : 'Add New Task' }}</h1>
        <button class="btn" (click)="goBack()">Back to List</button>
      </div>
      
      <app-alert 
        *ngIf="showAlert"
        [message]="alertMessage"
        [type]="alertType"
        (dismiss)="showAlert = false"
      ></app-alert>
      
      <div class="card">
        <div class="card-body">
          <div *ngIf="loading" class="text-center p-4">
            <div class="spinner"></div>
            <p class="mt-2">{{ isEditMode ? 'Loading task details...' : 'Preparing form...' }}</p>
          </div>
          
          <form *ngIf="!loading" [formGroup]="taskForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="taskName">Task Title *</label>
              <input 
                type="text" 
                id="taskName" 
                formControlName="taskName" 
                class="form-control" 
                [class.is-invalid]="isInvalid('taskName')"
              >
              <div *ngIf="isInvalid('taskName')" class="error-message">
                <span *ngIf="taskForm.get('taskName')?.errors?.['required']">
                  Task taskName is required.
                </span>
              </div>
            </div>
            
            <!-- <div class="form-group">
              <label for="description">Description</label>
              <textarea 
                id="description" 
                formControlName="description" 
                class="form-control" 
                rows="3"
                placeholder="Optional"
              ></textarea>
            </div> -->
            
            <div class="form-row">
              <div class="form-group">
                <label for="status">Status *</label>
                <select 
                  id="status" 
                  formControlName="status" 
                  class="form-control" 
                  [class.is-invalid]="isInvalid('status')"
                >
                  <option [value]="'To Do'">To Do</option>
                  <option [value]="'Pending'">In Progress</option>
                  <option [value]="'Done'">Completed</option>
                  <option [value]="'COMPLETED'">Completed</option>
                  <!-- <option [value]="TaskStatus.CANCELLED">Cancelled</option> -->
                </select>
                <div *ngIf="isInvalid('status')" class="error-message">
                  <span *ngIf="taskForm.get('status')?.errors?.['required']">
                    Status is required.
                  </span>
                </div>
              </div>
              
              <!-- <div class="form-group">
                <label for="priority">Priority *</label>
                <select 
                  id="priority" 
                  formControlName="priority" 
                  class="form-control" 
                  [class.is-invalid]="isInvalid('priority')"
                >
                  <option [value]="TaskPriority.LOW">Low</option>
                  <option [value]="TaskPriority.MEDIUM">Medium</option>
                  <option [value]="TaskPriority.HIGH">High</option>
                  <option [value]="TaskPriority.URGENT">Urgent</option>
                </select>
                <div *ngIf="isInvalid('priority')" class="error-message">
                  <span *ngIf="taskForm.get('priority')?.errors?.['required']">
                    Priority is required.
                  </span>
                </div>
              </div> -->
            </div>
            
            <div class="form-row">
              <!-- <div class="form-group">
                <label for="dueDate">Due Date</label>
                <input 
                  type="date" 
                  id="dueDate" 
                  formControlName="dueDate" 
                  class="form-control"
                >
              </div> -->
              
              <div class="form-group">
                <label for="assignPersonName">Assign To</label>
                <select 
                  id="assignPersonName" 
                  formControlName="assignPersonName" 
                  class="form-control"
                  (change)="handleSelect($event)"
                >
                  <option [value]="null">-- Unassigned --</option>
                  <option *ngFor="let person of persons" [value]="person.name">
                    {{ person.name }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="form-actions">
              <button
                type="button"
                class="btn"
                (click)="goBack()"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="taskForm.invalid || saving"
              >
                <span *ngIf="saving" class="spinner-sm mr-2"></span>
                {{ isEditMode ? 'Update Task' : 'Create Task' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
    }
    
    .form-row {
      display: flex;
      gap: var(--space-4);
      margin-bottom: var(--space-4);
    }
    
    .form-row .form-group {
      flex: 1;
    }
    
    .error-message {
      color: var(--color-error);
      font-size: 0.875rem;
      margin-top: var(--space-1);
    }
    
    .is-invalid {
      border-color: var(--color-error);
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-3);
      margin-top: var(--space-6);
    }
    
    .spinner-sm {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border: 0.15rem solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s linear infinite;
      vertical-align: middle;
    }
    
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode = false;
  taskId: number | null = null;
  loading = true;
  saving = false;
  
  persons: Person[] = [];
  
  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;
  
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'warning' | 'error' = 'success';
  
  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private personService: PersonService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.initForm();
    this.loadPersons();
    
    // Get the taskId from the route if in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null && id !== 'new') {
      this.isEditMode = true;
      this.taskId = +id;
      this.loadTask();
    }
    // else {
    //   // Check if personId is provided in query params (for assigning task directly)
    //   this.route.queryParams.subscribe(params => {
    //     console.log("New task ID: ", params);
    //     if (params['personId']) {
    //       this.taskForm.patchValue({
    //         personId: +params['personId']
    //       });
    //     }
    //   });
    //
    //   this.loading = false;
    // }
  }

  handlePersonIdFromRoute(person: any): void {
      // Check if personId is provided in query params (for assigning task directly)
      this.route.queryParams.subscribe(params => {
        console.log("New task ID: ", params);
        if (params['personId']) {
          const selectedPerson: any = this.persons.find(person => person.id === +params['personId']);
          const person: any = {
            name: selectedPerson.name,
            id: selectedPerson.id,
            email: selectedPerson.email,
            phone: selectedPerson.phone
          }
          console.log("Person: ", person);
          this.taskForm.patchValue({
            assignPersonName: selectedPerson.name,
            person: person
          });
          this.loading = false;
        }
      });
  }

  handleSelect(event: Event): void {
    // alert('Selected');
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    const selectedPerson = this.persons.find(person => person.name === selectedValue);
    if (selectedPerson) {
      this.taskForm.patchValue({
        person: selectedPerson
      });
    }
  }
  
  initForm(): void {
    this.taskForm = this.fb.group({
      taskName: ['', [Validators.required]],
      // description: [''],
      status: [TaskStatus.TODO, [Validators.required]],
      // priority: [TaskPriority.MEDIUM, [Validators.required]],
      // dueDate: [''],
      person: [null],
      assignPersonName: [''],
    });
  }
  
  loadPersons(): void {
    this.personService.getPersons(0, 100).subscribe({
      next: (response) => {
        console.log('Persons loaded:', response);
        this.persons = response.content;
        this.handlePersonIdFromRoute(this.persons);
      },
      error: (error) => {
        console.error('Error loading persons', error);
        this.showAlertMessage('Failed to load persons for assignment. Please try again later.', 'warning');
      }
    });
  }
  
  loadTask(): void {
    if (!this.taskId) return;
    
    this.taskService.getTask(this.taskId).subscribe({
      next: (task: Task) => {
        console.log('Task loaded:', task);
        // Format the date to YYYY-MM-DD for the date input
        const formattedTask = {
          ...task,
          dueDate: task.dueDate ? this.formatDateForInput(task.dueDate) : ''
        };
        console.log('Formatted Task:', formattedTask);
        
        this.taskForm.patchValue(formattedTask);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading task', error);
        this.showAlertMessage('Failed to load task details. Please try again later.', 'error');
        this.loading = false;
      }
    });
  }
  
  onSubmit(): void {
    if (this.taskForm.invalid || this.saving) return;
    
    this.saving = true;
    const taskData = this.prepareTaskData();

    console.log('Task Data:', taskData);
    
    if (this.isEditMode && this.taskId) {
      this.updateTask(taskData);
    } else {
      this.createTask(taskData);
    }
  }
  
  prepareTaskData(): Omit<Task, 'id'> {
    const formValue = this.taskForm.value;
    
    // Create a new person object without todos if person exists
    const cleanedPerson = formValue.person ? {
      id: formValue.person.id,
      name: formValue.person.name,
      email: formValue.person.email,
      phone: formValue.person.phone,
    } : null;
    // delete cleanedPerson.person.todos;
    return {
      id: this.taskId || 0,
      ...formValue,
      person: cleanedPerson
    };
  }
  
  createTask(taskData: Omit<Task, 'id'>): void {
    this.taskService.createTask(taskData).subscribe({
      next: (createdTask) => {
        this.saving = false;
        this.router.navigate(['/tasks', createdTask.id], { 
          state: { message: 'Task created successfully!' } 
        });
      },
      error: (error) => {
        console.error('Error creating task', error);
        this.showAlertMessage('Failed to create task. Please try again later.', 'error');
        this.saving = false;
      }
    });
  }
  
  updateTask(taskData: Omit<Task, 'id'>): void {
    if (!this.taskId) return;
    
    this.taskService.updateTask(this.taskId, taskData).subscribe({
      next: (updatedTask) => {
        this.saving = false;
        this.router.navigate(['/tasks', updatedTask.id], { 
          state: { message: 'Task updated successfully!' } 
        });
      },
      error: (error) => {
        console.error('Error updating task', error);
        this.showAlertMessage('Failed to update task. Please try again later.', 'error');
        this.saving = false;
      }
    });
  }
  
  isInvalid(controlName: string): boolean {
    const control = this.taskForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
  
  goBack(): void {
    if (this.isEditMode && this.taskId) {
      this.router.navigate(['/tasks', this.taskId]);
    } else {
      this.router.navigate(['/tasks']);
    }
  }
  
  showAlertMessage(message: string, type: 'success' | 'warning' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
  }
  
  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
}