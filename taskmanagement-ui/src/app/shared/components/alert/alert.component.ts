import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

export type AlertType = 'success' | 'warning' | 'error';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" [class]="'alert alert-' + type + ' slide-in-up'">
      {{ message }}
      <button 
        *ngIf="dismissible" 
        class="close-btn" 
        (click)="dismiss()"
        aria-label="Close alert"
      >
        &times;
      </button>
    </div>
  `,
  styles: [`
    .alert {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      opacity: 0.7;
      transition: var(--transition-normal);
    }
    
    .close-btn:hover {
      opacity: 1;
    }
  `]
})
export class AlertComponent implements OnInit {
  @Input() message = '';
  @Input() type: AlertType = 'success';
  @Input() dismissible = true;
  @Input() autoDismiss = false;
  @Input() dismissTime = 5000; // 5 seconds
  
  visible = true;
  
  ngOnInit(): void {
    if (this.autoDismiss) {
      setTimeout(() => {
        this.dismiss();
      }, this.dismissTime);
    }
  }
  
  dismiss(): void {
    this.visible = false;
  }
}