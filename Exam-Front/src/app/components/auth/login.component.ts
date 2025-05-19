import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ErrorMessageComponent } from '../shared/error-message.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErrorMessageComponent],
  template: `
    <h3 class="text-center mb-4">Login</h3>

    <app-error-message [message]="error"></app-error-message>
    
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input 
          type="text" 
          id="username" 
          formControlName="username" 
          class="form-control" 
          [ngClass]="{'is-invalid': submitted && f['username'].errors}"
        />
        <div *ngIf="submitted && f['username'].errors" class="invalid-feedback">
          <div *ngIf="f['username'].errors['required']">Username is required</div>
          <div *ngIf="f['username'].errors['minlength']">Username must be at least 3 characters</div>
          <div *ngIf="f['username'].errors['maxlength']">Username cannot exceed 25 characters</div>
          <div *ngIf="f['username'].errors['pattern']">Username can only contain letters, numbers, dots, underscores and hyphens</div>
        </div>
      </div>
      
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input 
          type="password" 
          id="password" 
          formControlName="password" 
          class="form-control" 
          [ngClass]="{'is-invalid': submitted && f['password'].errors}"
        />
        <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
          <div *ngIf="f['password'].errors['required']">Password is required</div>
          <div *ngIf="f['password'].errors['minlength']">Password must be at least 6 characters</div>
          <div *ngIf="f['password'].errors['pattern']">Password must include uppercase, lowercase, number and special character</div>
        </div>
      </div>
      
      <div class="d-grid gap-2">
        <button class="btn btn-primary" type="submit" [disabled]="loading">
          <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
          Login
        </button>
      </div>
    </form>
  `,
  styles: []
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(25),
        Validators.pattern(/^[a-zA-Z0-9._-]+$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]]
    });
  }
  
  get f() { 
    return this.loginForm.controls; 
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.loginForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.authService.login(this.f['username'].value, this.f['password'].value)
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          this.error = err.message || 'Invalid credentials';
          this.loading = false;
        }
      });
  }
}
