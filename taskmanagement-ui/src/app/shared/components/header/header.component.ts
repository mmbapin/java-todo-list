import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <a routerLink="/">Task & Person Manager</a>
          </div>
          
          <nav class="nav">
            <ul class="nav-list">
              <li class="nav-item">
                <a routerLink="/" 
                   routerLinkActive="active" 
                   [routerLinkActiveOptions]="{exact: true}">Home</a>
              </li>
              <li class="nav-item">
                <a routerLink="/persons" 
                   routerLinkActive="active" 
                   [routerLinkActiveOptions]="{exact: true}">Persons</a>
              </li>
              <li class="nav-item">
                <a routerLink="/tasks" 
                   routerLinkActive="active" 
                   [routerLinkActiveOptions]="{exact: true}">Tasks</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: white;
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 0;
      z-index: 100;
      transition: var(--transition-normal);
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 4rem;
    }
    
    .logo a {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-primary);
      text-decoration: none;
      transition: var(--transition-normal);
    }
    
    .logo a:hover {
      color: var(--color-primary-dark);
    }
    
    .nav-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: var(--space-6);
    }
    
    .nav-item a {
      display: inline-block;
      padding: var(--space-2) 0;
      color: var(--color-neutral-700);
      font-weight: 500;
      text-decoration: none;
      position: relative;
      transition: var(--transition-normal);
    }
    
    .nav-item a::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--color-primary);
      transition: var(--transition-normal);
    }
    
    .nav-item a:hover {
      color: var(--color-primary);
    }
    
    .nav-item a:hover::after,
    .nav-item a.active::after {
      width: 100%;
    }
    
    .nav-item a.active {
      color: var(--color-primary);
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        height: auto;
        padding: var(--space-2) 0;
      }
      
      .logo {
        margin-bottom: var(--space-2);
      }
      
      .nav-list {
        gap: var(--space-4);
      }
    }
  `]
})
export class HeaderComponent {}