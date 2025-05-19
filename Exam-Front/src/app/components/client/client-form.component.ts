import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgClass],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>{{ isEditMode ? 'Edit Client' : 'Create New Client' }}</h2>
    </div>
    
    <div *ngIf="loading" class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    
    <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
    
    <div class="card" *ngIf="!loading">
      <div class="card-body">
        <form [formGroup]="clientForm" (ngSubmit)="onSubmit()">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="firstName" class="form-label">First Name</label>
              <input 
                type="text" 
                class="form-control" 
                id="firstName" 
                formControlName="firstName"
                [ngClass]="{'is-invalid': submitted && f['firstName'].errors}"
              >
              <div *ngIf="submitted && f['firstName'].errors" class="invalid-feedback">
                <div *ngIf="f['firstName'].errors['required']">First Name is required</div>
                <div *ngIf="f['firstName'].errors['minlength']">First Name must be at least 2 characters</div>
                <div *ngIf="f['firstName'].errors['maxlength']">First Name must not exceed 50 characters</div>
              </div>
            </div>
            
            <div class="col-md-6 mb-3">
              <label for="lastName" class="form-label">Last Name</label>
              <input 
                type="text" 
                class="form-control" 
                id="lastName" 
                formControlName="lastName"
                [ngClass]="{'is-invalid': submitted && f['lastName'].errors}"
              >
              <div *ngIf="submitted && f['lastName'].errors" class="invalid-feedback">
                <div *ngIf="f['lastName'].errors['required']">Last Name is required</div>
                <div *ngIf="f['lastName'].errors['minlength']">Last Name must be at least 2 characters</div>
                <div *ngIf="f['lastName'].errors['maxlength']">Last Name must not exceed 50 characters</div>
              </div>
            </div>
          </div>
          
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="email" class="form-label">Email</label>
              <input 
                type="email" 
                class="form-control" 
                id="email" 
                formControlName="email"
                [ngClass]="{'is-invalid': submitted && f['email'].errors}"
              >
              <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">
                <div *ngIf="f['email'].errors['required']">Email is required</div>
                <div *ngIf="f['email'].errors['email']">Email must be valid</div>
              </div>
            </div>
            
            <div class="col-md-6 mb-3">
              <label for="phone" class="form-label">Phone Number</label>
              <input 
                type="tel" 
                class="form-control" 
                id="phone" 
                formControlName="phone"
                [ngClass]="{'is-invalid': submitted && f['phone'].errors}"
                placeholder="e.g. 123-456-7890"
              >
              <div *ngIf="submitted && f['phone'].errors" class="invalid-feedback">
                <div *ngIf="f['phone'].errors['required']">Phone number is required</div>
                <div *ngIf="f['phone'].errors['pattern']">Phone number must be in a valid format</div>
              </div>
            </div>
          </div>
          
          <div class="mb-3">
            <label for="address" class="form-label">Address</label>
            <textarea 
              class="form-control" 
              id="address" 
              formControlName="address"
              [ngClass]="{'is-invalid': submitted && f['address'].errors}"
              rows="3"
            ></textarea>
            <div *ngIf="submitted && f['address'].errors" class="invalid-feedback">
              <div *ngIf="f['address'].errors['required']">Address is required</div>
              <div *ngIf="f['address'].errors['minlength']">Address must be at least 5 characters</div>
              <div *ngIf="f['address'].errors['maxlength']">Address must not exceed 200 characters</div>
            </div>
          </div>
          
          <div class="d-flex justify-content-between mt-4">
            <button type="button" class="btn btn-secondary" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="submitting">
              <span *ngIf="submitting" class="spinner-border spinner-border-sm me-1"></span>
              {{ isEditMode ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class ClientFormComponent implements OnInit {
  clientForm: FormGroup;
  isEditMode = false;
  loading = false;
  submitting = false;
  submitted = false;
  error = '';
  clientId?: number;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService
  ) {
    this.clientForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$|^\d{10}$|^\(\d{3}\)\s?\d{3}-\d{4}$/)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]
    });
  }
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.clientId = +id;
      this.loading = true;
      
      this.clientService.getClient(this.clientId).subscribe({
        next: (client) => {
          this.clientForm.patchValue(client);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load client details. Please try again later.';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
  
  get f() { return this.clientForm.controls; }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.clientForm.invalid) {
      return;
    }
    
    this.submitting = true;
    
    const client: Client = {
      ...this.clientForm.value
    };
    
    if (this.isEditMode && this.clientId) {
      client.id = this.clientId;
      
      this.clientService.updateClient(client).subscribe({
        next: (updatedClient) => {
          this.router.navigate(['/clients', updatedClient.id]);
        },
        error: (err) => {
          this.error = 'Failed to update client. Please try again later.';
          this.submitting = false;
          console.error(err);
        }
      });
    } else {
      this.clientService.createClient(client).subscribe({
        next: (createdClient) => {
          this.router.navigate(['/clients', createdClient.id]);
        },
        error: (err) => {
          this.error = 'Failed to create client. Please try again later.';
          this.submitting = false;
          console.error(err);
        }
      });
    }
  }
  
  goBack(): void {
    if (this.isEditMode && this.clientId) {
      this.router.navigate(['/clients', this.clientId]);
    } else {
      this.router.navigate(['/clients']);
    }
  }
}
