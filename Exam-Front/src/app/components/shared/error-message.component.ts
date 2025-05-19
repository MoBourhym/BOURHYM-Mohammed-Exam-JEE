import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message" class="alert alert-danger alert-dismissible fade show" role="alert">
      <div class="d-flex align-items-center">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        <div>{{ message }}</div>
      </div>
      <button type="button" class="btn-close" aria-label="Close" (click)="clear()"></button>
    </div>
  `,
  styles: []
})
export class ErrorMessageComponent {
  @Input() message: string = '';

  clear(): void {
    this.message = '';
  }
}
