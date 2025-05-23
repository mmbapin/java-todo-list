import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskResponse } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/todos';
  private apiUrl_task = 'http://localhost:8080/api';

  // /persons/{personId}/todos
  constructor(private http: HttpClient) {}

  getTasks(page: number = 0, size: number = 10): Observable<TaskResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<TaskResponse>(this.apiUrl, { params });
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    console.log('Creating task:', task);
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: number, task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTasksByPerson(personId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl_task}/persons/${personId}/todos`);
  }
}