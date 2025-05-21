import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { PersonListComponent } from './features/person/components/person-list/person-list.component';
import { PersonFormComponent } from './features/person/components/person-form/person-form.component';
import { PersonDetailComponent } from './features/person/components/person-detail/person-detail.component';
import { TaskListComponent } from './features/task/components/task-list/task-list.component';
import { TaskFormComponent } from './features/task/components/task-form/task-form.component';
import { TaskDetailComponent } from './features/task/components/task-detail/task-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  
  // Person routes
  { path: 'persons', component: PersonListComponent },
  { path: 'persons/new', component: PersonFormComponent },
  { path: 'persons/:id', component: PersonDetailComponent },
  { path: 'persons/:id/edit', component: PersonFormComponent },
  
  // Task routes
  { path: 'tasks', component: TaskListComponent },
  { path: 'tasks/new', component: TaskFormComponent },
  { path: 'tasks/:id', component: TaskDetailComponent },
  { path: 'tasks/:id/edit', component: TaskFormComponent },
  
  // Fallback route
  { path: '**', redirectTo: '' }
];