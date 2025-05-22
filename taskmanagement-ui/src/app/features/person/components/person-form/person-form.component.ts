import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../../../../core/services/person.service';
import { Person } from '../../../../core/models/person.model';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
	selector: 'app-person-form',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, AlertComponent],
	template: `
		<div class="container fade-in">
			<div class="form-header">
				<h1>{{ isEditMode ? 'Edit Person' : 'Add New Person' }}</h1>
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
						<p class="mt-2">{{ isEditMode ? 'Loading person details...' : 'Preparing form...' }}</p>
					</div>

					<form *ngIf="!loading" [formGroup]="personForm" (ngSubmit)="onSubmit()">
						<div class="form-row">
							<div class="form-group">
								<label for="name">Name *</label>
								<input
									type="text"
									id="name"
									formControlName="name"
									class="form-control"
									[class.is-invalid]="isInvalid('name')"
								/>
								<div *ngIf="isInvalid('name')" class="error-message">
									<span *ngIf="personForm.get('name')?.errors?.['required']"> Name is required. </span>
								</div>
							</div>

							<!-- <div class="form-group">
                <label for="lastName">Last Name *</label>
                <input 
                  type="text" 
                  id="lastName" 
                  formControlName="lastName" 
                  class="form-control" 
                  [class.is-invalid]="isInvalid('lastName')"
                >
                <div *ngIf="isInvalid('lastName')" class="error-message">
                  <span *ngIf="personForm.get('lastName')?.errors?.['required']">
                    Last name is required.
                  </span>
                </div>
              </div> -->
						</div>

						<div class="form-group">
							<label for="email">Email *</label>
							<input
								type="email"
								id="email"
								formControlName="email"
								class="form-control"
								[class.is-invalid]="isInvalid('email')"
							/>
							<div *ngIf="isInvalid('email')" class="error-message">
								<span *ngIf="personForm.get('email')?.errors?.['required']"> Email is required. </span>
								<span *ngIf="personForm.get('email')?.errors?.['email']"> Please enter a valid email address. </span>
							</div>
						</div>

						<div class="form-group">
							<label for="phone">Phone Number</label>
							<input type="tel" id="phone" formControlName="phone" class="form-control" placeholder="Optional" />
						</div>

						<!-- <div class="form-group">
							<label for="address">Address</label>
							<textarea
								id="address"
								formControlName="address"
								class="form-control"
								rows="3"
								placeholder="Optional"
							></textarea>
						</div> -->

						<div class="form-actions">
							<button type="button" class="btn" (click)="goBack()">Cancel</button>
							<button type="submit" class="btn btn-primary" [disabled]="personForm.invalid || saving">
								<span *ngIf="saving" class="spinner-sm mr-2"></span>
								{{ isEditMode ? 'Update Person' : 'Create Person' }}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
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
		`,
	],
})
export class PersonFormComponent implements OnInit {
	personForm!: FormGroup;
	isEditMode = false;
	personId: number | null = null;
	loading = true;
	saving = false;

	showAlert = false;
	alertMessage = '';
	alertType: 'success' | 'warning' | 'error' = 'success';

	constructor(
		private fb: FormBuilder,
		private personService: PersonService,
		private route: ActivatedRoute,
		private router: Router
	) {}

	ngOnInit(): void {
		this.initForm();

		// Get the personId from the route if in edit mode
		const id = this.route.snapshot.paramMap.get('id');
		console.log('id', id);
		if (id !== null && id !== 'new') {
			this.isEditMode = true;
			this.personId = +id;
			this.loadPerson();
		} else {
			this.loading = false;
		}
	}

	initForm(): void {
		this.personForm = this.fb.group({
			name: ['', [Validators.required]],
			// lastName: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			phone: [''],
			// address: [''],
		});
	}

	loadPerson(): void {
		if (!this.personId) return;

		this.personService.getPerson(this.personId).subscribe({
			next: (person: Person) => {
				this.personForm.patchValue(person);
				this.loading = false;
			},
			error: (error) => {
				console.error('Error loading person', error);
				this.showAlertMessage('Failed to load person details. Please try again later.', 'error');
				this.loading = false;
			},
		});
	}

	onSubmit(): void {
		if (this.personForm.invalid || this.saving) return;

		this.saving = true;
		const personData = this.personForm.value;
		console.log('personData', personData);

		if (this.isEditMode && this.personId) {
			this.updatePerson(personData);
		} else {
			this.createPerson(personData);
		}
	}

	createPerson(personData: Person): void {
		const payload = {
			id: 0,
			name: personData.name,
			email: personData.email,
			phone: personData.phone || '',
		};
		this.personService.createPerson(payload).subscribe({
			next: (createdPerson) => {
				this.saving = false;
				this.router.navigate(['/persons', createdPerson.id], {
					state: { message: 'Person created successfully!' },
				});
			},
			error: (error) => {
				console.error('Error creating person', error);
				this.showAlertMessage('Failed to create person. Please try again later.', 'error');
				this.saving = false;
			},
		});
	}

	updatePerson(personData: Person): void {
		if (!this.personId) return;
		
		const payload = {
			id: this.personId,
			...personData
		};
		console.log('Updating person with ID:', payload);

		this.personService.updatePerson(this.personId, payload).subscribe({
			next: (updatedPerson) => {
				this.saving = false;
				this.router.navigate(['/persons', updatedPerson.id], {
					state: { message: 'Person updated successfully!' },
				});
			},
			error: (error) => {
				console.error('Error updating person', error);
				this.showAlertMessage('Failed to update person. Please try again later.', 'error');
				this.saving = false;
			},
		});
	}

	isInvalid(controlName: string): boolean {
		const control = this.personForm.get(controlName);
		return !!control && control.invalid && (control.dirty || control.touched);
	}

	goBack(): void {
		if (this.isEditMode && this.personId) {
			this.router.navigate(['/persons', this.personId]);
		} else {
			this.router.navigate(['/persons']);
		}
	}

	showAlertMessage(message: string, type: 'success' | 'warning' | 'error'): void {
		this.alertMessage = message;
		this.alertType = type;
		this.showAlert = true;
	}
}
