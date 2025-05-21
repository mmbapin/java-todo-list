import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <div class="page-container">
      <app-header></app-header>
      
      <main class="content-container">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="footer">
        <div class="container">
          <p>&copy; {{ currentYear }} Task & Person Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .footer {
      background-color: var(--color-neutral-800);
      color: white;
      padding: var(--space-4) 0;
      text-align: center;
      font-size: 0.875rem;
    }
  `]
})
export class AppComponent {
  currentYear = new Date().getFullYear();
}