import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination-container" *ngIf="totalPages > 1">
      <ul class="pagination">
        <li [class.disabled]="currentPage === 0">
          <button 
            class="pagination-btn" 
            [disabled]="currentPage === 0" 
            (click)="onPageChange(0)"
          >
            &laquo;
          </button>
        </li>
        <li [class.disabled]="currentPage === 0">
          <button 
            class="pagination-btn" 
            [disabled]="currentPage === 0" 
            (click)="onPageChange(currentPage - 1)"
          >
            &lsaquo;
          </button>
        </li>
        
        <ng-container *ngFor="let page of getVisiblePages()">
          <li *ngIf="page !== -1; else ellipsis">
            <button 
              class="pagination-btn" 
              [class.active]="page === currentPage"
              (click)="onPageChange(page)"
            >
              {{ page + 1 }}
            </button>
          </li>
          <ng-template #ellipsis>
            <li class="ellipsis">...</li>
          </ng-template>
        </ng-container>
        
        <li [class.disabled]="currentPage === totalPages - 1">
          <button 
            class="pagination-btn" 
            [disabled]="currentPage === totalPages - 1" 
            (click)="onPageChange(currentPage + 1)"
          >
            &rsaquo;
          </button>
        </li>
        <li [class.disabled]="currentPage === totalPages - 1">
          <button 
            class="pagination-btn" 
            [disabled]="currentPage === totalPages - 1" 
            (click)="onPageChange(totalPages - 1)"
          >
            &raquo;
          </button>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .pagination-container {
      display: flex;
      justify-content: center;
      margin-top: var(--space-4);
    }
    
    .pagination {
      display: flex;
      list-style: none;
      padding: 0;
      margin: 0;
      gap: var(--space-1);
      align-items: center;
    }
    
    .pagination-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 2rem;
      height: 2rem;
      padding: 0 var(--space-2);
      border: 1px solid var(--color-neutral-300);
      background-color: white;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: var(--transition-normal);
    }
    
    .pagination-btn:hover:not([disabled]) {
      background-color: var(--color-primary-light);
      border-color: var(--color-primary);
      color: var(--color-primary-dark);
    }
    
    .pagination-btn.active {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
      color: white;
    }
    
    .pagination-btn[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .ellipsis {
      padding: 0 var(--space-2);
      color: var(--color-neutral-500);
    }
    
    .disabled {
      opacity: 0.5;
    }
  `]
})
export class PaginationComponent {
  @Input() currentPage = 0;
  @Input() totalPages = 0;
  @Input() visiblePageCount = 5;
  
  @Output() pageChange = new EventEmitter<number>();
  
  getVisiblePages(): number[] {
    const pages: number[] = [];
    
    if (this.totalPages <= this.visiblePageCount) {
      // If we have fewer pages than the visible count, show all pages
      for (let i = 0; i < this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);
      
      let startPage = Math.max(1, this.currentPage - Math.floor(this.visiblePageCount / 2));
      let endPage = Math.min(this.totalPages - 2, startPage + this.visiblePageCount - 3);
      
      // Adjust start page if end page is too close to the end
      startPage = Math.max(1, Math.min(startPage, this.totalPages - this.visiblePageCount + 1));
      
      // Add ellipsis after first page if there's a gap
      if (startPage > 1) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Add visible page numbers
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if there's a gap
      if (endPage < this.totalPages - 2) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Always show last page
      pages.push(this.totalPages - 1);
    }
    
    return pages;
  }
  
  onPageChange(page: number): void {
    if (page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}