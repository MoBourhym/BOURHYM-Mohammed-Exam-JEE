import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input 
              type="text" 
              class="form-control" 
              id="name" 
              formControlName="name"
              [ngClass]="{'is-invalid': submitted && f['name'].errors}"
            >
            <div *ngIf="submitted && f['name'].errors" class="invalid-feedback">
              <div *ngIf="f['name'].errors['required']">Name is required</div>
            </div>
          </div>
          
          <div class="mb-3">
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
          
          <div class="d-flex justify-content-between">
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
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
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
