import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PersonService } from '../../../../core/services/person.service';
import { Person, PersonResponse } from '../../../../core/models/person.model';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-person-list',
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
        <h1>Persons</h1>
        <a routerLink="/persons/new" class="btn btn-primary">
          Add New Person
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
          <div *ngIf="loading" class="text-center p-4">
            <div class="spinner"></div>
            <p class="mt-2">Loading persons...</p>
          </div>
          
          <div *ngIf="!loading && persons.length === 0" class="text-center p-4">
            <p>No persons found. Click "Add New Person" to create one.</p>
          </div>
          
          <div *ngIf="!loading && persons.length > 0" class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let person of persons; let i = index" class="slide-in-up" [style.animation-delay.ms]="i * 50">
                  <td>{{ person.name }}</td>
                  <td>{{ person.email }}</td>
                  <td>{{ person.phone || '-' }}</td>
                  <td class="actions">
                    <a [routerLink]="['/persons', person.id]" class="btn btn-sm">
                      View
                    </a>
                    <a [routerLink]="['/persons', person.id, 'edit']" class="btn btn-sm btn-secondary">
                      Edit
                    </a>
                    <button class="btn btn-sm btn-danger" (click)="confirmDelete(person)">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
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
      title="Delete Person"
      [message]="'Are you sure you want to delete ' + (personToDelete?.firstName || '') + ' ' + (personToDelete?.lastName || '') + '?'"
      confirmText="Delete"
      confirmButtonClass="btn-danger"
      (confirm)="deletePerson()"
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
    
    .table-responsive {
      overflow-x: auto;
    }
    
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-2);
    }
    
    @media (max-width: 768px) {
      .list-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
      }
      
      .actions {
        flex-direction: column;
        align-items: flex-end;
        gap: var(--space-1);
      }
      
      .actions .btn {
        width: 80px;
      }
    }
  `]
})
export class PersonListComponent implements OnInit {
  persons: Person[] = [];
  loading = true;
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  
  showDeleteDialog = false;
  personToDelete: Person | null = null;
  
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'warning' | 'error' = 'success';
  
  constructor(private personService: PersonService) {}
  
  ngOnInit(): void {
    this.loadPersons();
  }
  
  loadPersons(): void {
    this.loading = true;
    
    this.personService.getPersons(this.currentPage, this.pageSize).subscribe({
      next: (response: PersonResponse) => {
        this.persons = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading persons', error);
        this.showAlertMessage('Failed to load persons. Please try again later.', 'error');
        this.loading = false;
      }
    });
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPersons();
  }
  
  confirmDelete(person: Person): void {
    this.personToDelete = person;
    this.showDeleteDialog = true;
  }
  
  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.personToDelete = null;
  }
  
  deletePerson(): void {
    if (!this.personToDelete || !this.personToDelete.id) return;
    
    const personId = this.personToDelete.id;
    const personName = `${this.personToDelete.firstName} ${this.personToDelete.lastName}`;
    
    this.personService.deletePerson(personId).subscribe({
      next: () => {
        this.persons = this.persons.filter(p => p.id !== personId);
        this.showAlertMessage(`${personName} has been deleted successfully.`, 'success');
        
        // Reload if page is empty (except first page)
        if (this.persons.length === 0 && this.currentPage > 0) {
          this.currentPage--;
          this.loadPersons();
        }
      },
      error: (error) => {
        console.error('Error deleting person', error);
        this.showAlertMessage(`Failed to delete ${personName}. Please try again later.`, 'error');
      },
      complete: () => {
        this.showDeleteDialog = false;
        this.personToDelete = null;
      }
    });
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