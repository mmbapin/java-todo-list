import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PersonService } from '../../../../core/services/person.service';
import { TaskService } from '../../../../core/services/task.service';
import { Person } from '../../../../core/models/person.model';
import { Task } from '../../../../core/models/task.model';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
	selector: 'app-person-detail',
	standalone: true,
	imports: [CommonModule, RouterLink, ConfirmationDialogComponent, AlertComponent],
	template: `
		<div class="container fade-in">
			<div class="detail-header">
				<div>
					<h1 *ngIf="!loading && person">{{ person.firstName }} {{ person.lastName }}</h1>
					<h1 *ngIf="loading" class="loading-placeholder">Loading person details...</h1>
				</div>
				<div class="detail-actions">
					<a routerLink="/persons" class="btn">Back to List</a>
					<a *ngIf="!loading && person" [routerLink]="['/persons', person.id, 'edit']" class="btn btn-secondary">
						Edit
					</a>
					<button *ngIf="!loading && person" class="btn btn-danger" (click)="confirmDelete()">Delete</button>
				</div>
			</div>

			<app-alert
				*ngIf="showAlert"
				[message]="alertMessage"
				[type]="alertType"
				[autoDismiss]="true"
				(dismiss)="showAlert = false"
			></app-alert>

			<div class="content-grid">
				<div class="card person-details">
					<div class="card-header">
						<h2>Person Information</h2>
					</div>
					<div class="card-body">
						<div *ngIf="loading" class="text-center p-4">
							<div class="spinner"></div>
							<p class="mt-2">Loading person details...</p>
						</div>

						<div *ngIf="!loading && person">
							<div class="detail-item">
								<strong>Full Name:</strong>
								<span>{{ person.name }}</span>
							</div>
							<div class="detail-item">
								<strong>Email:</strong>
								<span>{{ person.email }}</span>
							</div>
							<div class="detail-item">
								<strong>Phone:</strong>
								<span>{{ person.phone || 'Not provided' }}</span>
							</div>
							<div class="detail-item">
								<strong>Address:</strong>
								<span>{{ person.address || 'Not provided' }}</span>
							</div>
							<div *ngIf="person.createdAt" class="detail-item">
								<strong>Created At:</strong>
								<span>{{ person.createdAt | date : 'medium' }}</span>
							</div>
							<div *ngIf="person.updatedAt" class="detail-item">
								<strong>Last Updated:</strong>
								<span>{{ person.updatedAt | date : 'medium' }}</span>
							</div>
						</div>
					</div>
				</div>

				<div class="card person-tasks">
					<div class="card-header d-flex justify-content-between align-items-center">
						<h2>Assigned Tasks</h2>
						<a
							*ngIf="!loading && person"
							[routerLink]="['/tasks/new']"
							[queryParams]="{ personId: person.id }"
							class="btn btn-sm btn-primary"
						>
							Add Task
						</a>
					</div>
					<div class="card-body">
						<div *ngIf="loadingTasks" class="text-center p-4">
							<div class="spinner"></div>
							<p class="mt-2">Loading tasks...</p>
						</div>

						<div *ngIf="!loadingTasks && tasks.length === 0" class="text-center p-4">
							<p>No tasks assigned to this person.</p>
							<a
								*ngIf="person"
								[routerLink]="['/tasks/new']"
								[queryParams]="{ personId: person.id }"
								class="btn btn-primary mt-3"
							>
								Assign a Task
							</a>
						</div>

						<div *ngIf="!loadingTasks && tasks.length > 0" class="tasks-list">
							<div
								*ngFor="let task of tasks; let i = index"
								class="task-item slide-in-up"
								[style.animation-delay.ms]="i * 50"
							>
								<div class="task-header">
									<a [routerLink]="['/tasks', task.id]" class="task-title">{{ task.title }}</a>
									<span [class]="'badge badge-' + getStatusClass(task.status)">{{ task.status }}</span>
								</div>
								<p *ngIf="task.description" class="task-description">{{ task.description }}</p>
								<div class="task-footer">
									<span [class]="'badge badge-' + getPriorityClass(task.priority)">{{ task.priority }}</span>
									<span *ngIf="task.dueDate" class="task-due-date">
										Due: {{ task.dueDate | date : 'mediumDate' }}
									</span>
									<div class="task-actions">
										<a [routerLink]="['/tasks', task.id]" class="btn btn-sm">View</a>
										<a [routerLink]="['/tasks', task.id, 'edit']" class="btn btn-sm btn-secondary">Edit</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<app-confirmation-dialog
			[isOpen]="showDeleteDialog"
			title="Delete Person"
			[message]="'Are you sure you want to delete ' + (person?.firstName || '') + ' ' + (person?.lastName || '') + '?'"
			confirmText="Delete"
			confirmButtonClass="btn-danger"
			(confirm)="deletePerson()"
			(cancel)="cancelDelete()"
		></app-confirmation-dialog>
	`,
	styles: [
		`
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

			.content-grid {
				display: grid;
				grid-template-columns: 1fr 1.5fr;
				gap: var(--space-4);
				margin-bottom: var(--space-4);
			}

			.person-details,
			.person-tasks {
				height: 100%;
			}

			.detail-item {
				display: flex;
				margin-bottom: var(--space-3);
				border-bottom: 1px solid var(--color-neutral-200);
				padding-bottom: var(--space-3);
			}

			.detail-item:last-child {
				border-bottom: none;
				margin-bottom: 0;
			}

			.detail-item strong {
				width: 120px;
				flex-shrink: 0;
			}

			.tasks-list {
				display: flex;
				flex-direction: column;
				gap: var(--space-3);
			}

			.task-item {
				border: 1px solid var(--color-neutral-200);
				border-radius: var(--radius-md);
				padding: var(--space-3);
				transition: var(--transition-normal);
			}

			.task-item:hover {
				border-color: var(--color-primary-light);
				box-shadow: var(--shadow-sm);
			}

			.task-header {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				margin-bottom: var(--space-2);
			}

			.task-title {
				font-weight: 600;
				color: var(--color-neutral-900);
				text-decoration: none;
				font-size: 1.1rem;
			}

			.task-title:hover {
				color: var(--color-primary);
			}

			.task-description {
				color: var(--color-neutral-600);
				margin-bottom: var(--space-2);
				font-size: 0.9rem;
			}

			.task-footer {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.task-due-date {
				color: var(--color-neutral-600);
				font-size: 0.85rem;
			}

			.task-actions {
				display: flex;
				gap: var(--space-1);
			}

			.loading-placeholder {
				color: var(--color-neutral-400);
				animation: pulse 1.5s infinite;
			}

			@media (max-width: 992px) {
				.content-grid {
					grid-template-columns: 1fr;
				}
			}

			@media (max-width: 768px) {
				.detail-header {
					flex-direction: column;
					align-items: flex-start;
					gap: var(--space-3);
				}

				.detail-item {
					flex-direction: column;
				}

				.detail-item strong {
					width: 100%;
					margin-bottom: var(--space-1);
				}

				.task-footer {
					flex-wrap: wrap;
					gap: var(--space-2);
				}
			}
		`,
	],
})
export class PersonDetailComponent implements OnInit {
	personId!: number;
	person: Person | null = null;
	tasks: Task[] = [];

	loading = true;
	loadingTasks = true;

	showDeleteDialog = false;

	showAlert = false;
	alertMessage = '';
	alertType: 'success' | 'warning' | 'error' = 'success';

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private personService: PersonService,
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
			this.personId = +id;
			this.loadPerson();
		} else {
			this.router.navigate(['/persons']);
		}
	}

	loadPerson(): void {
		this.personService.getPerson(this.personId).subscribe({
			next: (person: Person) => {
				this.person = person;
				this.loading = false;
				this.loadTasks();
			},
			error: (error) => {
				console.error('Error loading person', error);
				this.showAlertMessage('Failed to load person details. Please try again later.', 'error');
				this.loading = false;
			},
		});
	}

	loadTasks(): void {
		this.loadingTasks = true;

		this.taskService.getTasksByPerson(this.personId).subscribe({
			next: (tasks: Task[]) => {
				this.tasks = tasks;
				this.loadingTasks = false;
			},
			error: (error) => {
				console.error('Error loading tasks', error);
				this.showAlertMessage('Failed to load tasks. Please try again later.', 'error');
				this.loadingTasks = false;
			},
		});
	}

	confirmDelete(): void {
		this.showDeleteDialog = true;
	}

	cancelDelete(): void {
		this.showDeleteDialog = false;
	}

	deletePerson(): void {
		if (!this.person || !this.person.id) return;

		this.personService.deletePerson(this.person.id).subscribe({
			next: () => {
				this.router.navigate(['/persons'], {
					state: { message: `${this.person?.firstName} ${this.person?.lastName} has been deleted successfully.` },
				});
			},
			error: (error) => {
				console.error('Error deleting person', error);
				this.showAlertMessage('Failed to delete person. Please try again later.', 'error');
				this.showDeleteDialog = false;
			},
		});
	}

	getStatusClass(status: string): string {
		switch (status) {
			case 'TODO':
				return 'secondary';
			case 'IN_PROGRESS':
				return 'primary';
			case 'COMPLETED':
				return 'success';
			case 'CANCELLED':
				return 'error';
			default:
				return 'secondary';
		}
	}

	getPriorityClass(priority: string): string {
		switch (priority) {
			case 'LOW':
				return 'secondary';
			case 'MEDIUM':
				return 'accent';
			case 'HIGH':
				return 'warning';
			case 'URGENT':
				return 'error';
			default:
				return 'secondary';
		}
	}

	showAlertMessage(message: string, type: 'success' | 'warning' | 'error'): void {
		this.alertMessage = message;
		this.alertType = type;
		this.showAlert = true;
	}
}
