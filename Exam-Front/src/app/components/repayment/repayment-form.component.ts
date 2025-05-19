import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RepaymentService } from '../../services/repayment.service';
import { CreditService } from '../../services/credit.service';
import { Repayment, RepaymentStatus } from '../../models/repayment.model';
import { Credit } from '../../models/credit.model';
import { ErrorMessageComponent } from '../shared/error-message.component';

@Component({
  selector: 'app-repayment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErrorMessageComponent],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>{{ isEditMode ? 'Edit Repayment' : 'Add Repayment' }}</h2>
      <button class="btn btn-outline-secondary" (click)="goBack()">
        <i class="bi bi-arrow-left"></i> Back
      </button>
    </div>
    
    <app-error-message [message]="error"></app-error-message>

    <div *ngIf="loading" class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    
    <div class="card" *ngIf="!loading">
      <div class="card-body">
        <form [formGroup]="repaymentForm" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label for="amount" class="form-label">Amount</label>
            <div class="input-group">
              <span class="input-group-text">$</span>
              <input 
                type="number" 
                id="amount" 
                class="form-control" 
                formControlName="amount" 
                placeholder="0.00" 
                step="0.01"
                [ngClass]="{'is-invalid': submitted && f['amount'].errors}"
              >
              <div *ngIf="submitted && f['amount'].errors" class="invalid-feedback">
                <div *ngIf="f['amount'].errors['required']">Amount is required</div>
                <div *ngIf="f['amount'].errors['min']">Amount must be greater than 0</div>
                <div *ngIf="f['amount'].errors['pattern']">Amount must be a valid number with up to 2 decimal places</div>
              </div>
            </div>
          </div>
          
          <div class="mb-3">
            <label for="dueDate" class="form-label">Due Date</label>
            <input 
              type="date" 
              id="dueDate" 
              class="form-control" 
              formControlName="dueDate"
              [ngClass]="{'is-invalid': submitted && f['dueDate'].errors}"
            >
            <div *ngIf="submitted && f['dueDate'].errors" class="invalid-feedback">
              <div *ngIf="f['dueDate'].errors['required']">Due date is required</div>
              <div *ngIf="f['dueDate'].errors['pastDate']">Due date cannot be in the past</div>
            </div>
          </div>
          
          <div class="mb-3">
            <label for="status" class="form-label">Status</label>
            <select 
              id="status" 
              class="form-select" 
              formControlName="status"
              [ngClass]="{'is-invalid': submitted && f['status'].errors}"
            >
              <option value="">Select Status</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="LATE">Late</option>
            </select>
            <div *ngIf="submitted && f['status'].errors" class="invalid-feedback">
              <div *ngIf="f['status'].errors['required']">Status is required</div>
            </div>
          </div>
          
          <div class="mb-3" *ngIf="f['status'].value === 'PAID'">
            <label for="paymentDate" class="form-label">Payment Date</label>
            <input 
              type="date" 
              id="paymentDate" 
              class="form-control" 
              formControlName="paymentDate"
              [ngClass]="{'is-invalid': submitted && f['paymentDate'].errors}"
            >
            <div *ngIf="submitted && f['paymentDate'].errors" class="invalid-feedback">
              <div *ngIf="f['paymentDate'].errors['required']">Payment date is required for paid status</div>
            </div>
          </div>
          
          <div class="d-grid gap-2 mt-4">
            <button type="submit" class="btn btn-primary" [disabled]="submitting">
              <span *ngIf="submitting" class="spinner-border spinner-border-sm me-1"></span>
              {{ isEditMode ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class RepaymentFormComponent implements OnInit {
  repaymentForm: FormGroup;
  isEditMode = false;
  loading = false;
  submitting = false;
  submitted = false;
  error = '';
  repaymentId?: number;
  creditId?: number;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private repaymentService: RepaymentService,
    private creditService: CreditService
  ) {
    this.repaymentForm = this.formBuilder.group({
      amount: ['', [
        Validators.required, 
        Validators.min(0.01),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]],
      dueDate: [new Date().toISOString().split('T')[0], [
        Validators.required,
        this.futureDateValidator()
      ]],
      status: ['PENDING', Validators.required],
      paymentDate: ['']
    });
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.creditId = +params['creditId'];
      const id = params['id'];
      
      if (id && id !== 'new') {
        this.isEditMode = true;
        this.repaymentId = +id;
        this.loading = true;
        
        this.repaymentService.getRepayment(this.repaymentId).subscribe({
          next: (repayment) => {
            // Format dates for form
            const formattedRepayment = {
              ...repayment,
              dueDate: this.formatDateForInput(repayment.dueDate),
              paymentDate: repayment.paymentDate ? this.formatDateForInput(repayment.paymentDate) : ''
            };
            
            this.repaymentForm.patchValue(formattedRepayment);
            this.loading = false;
            
            // Add conditional validators based on status
            this.updatePaymentDateValidator();
          },
          error: (err) => {
            this.error = 'Failed to load repayment details. Please try again later.';
            this.loading = false;
            console.error(err);
          }
        });
      }
    });

    // Listen for status changes to update validators
    this.repaymentForm.get('status')?.valueChanges.subscribe(status => {
      this.updatePaymentDateValidator();
    });
  }
  
  updatePaymentDateValidator(): void {
    const status = this.repaymentForm.get('status')?.value;
    if (status === 'PAID') {
      this.repaymentForm.get('paymentDate')?.setValidators(Validators.required);
    } else {
      this.repaymentForm.get('paymentDate')?.clearValidators();
    }
    this.repaymentForm.get('paymentDate')?.updateValueAndValidity();
  }
  
  // Custom validator to ensure date is not in the past
  futureDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const inputDate = new Date(control.value);
      const today = new Date();
      
      // Reset hours to compare only dates
      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);
      
      if (inputDate < today) {
        return { 'pastDate': true };
      }
      
      return null;
    };
  }
  
  formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().substring(0, 10);
  }
  
  get f() { return this.repaymentForm.controls; }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.repaymentForm.invalid) {
      return;
    }
    
    this.submitting = true;
    
    const formData = this.repaymentForm.value;
    const repayment: Repayment = {
      amount: +formData.amount,
      dueDate: new Date(formData.dueDate),
      status: formData.status as RepaymentStatus,
      creditId: this.creditId as number,
      paymentDate: formData.paymentDate ? new Date(formData.paymentDate) : null
    };
    
    if (this.isEditMode && this.repaymentId) {
      repayment.id = this.repaymentId;
      
      this.repaymentService.updateRepayment(repayment).subscribe({
        next: () => {
          this.router.navigate(['/credits', this.creditId, 'repayments']);
        },
        error: (err) => {
          this.error = 'Failed to update repayment. Please try again later.';
          this.submitting = false;
          console.error(err);
        }
      });
    } else {
      this.repaymentService.createRepayment(repayment).subscribe({
        next: () => {
          this.router.navigate(['/credits', this.creditId, 'repayments']);
        },
        error: (err) => {
          this.error = 'Failed to create repayment. Please try again later.';
          this.submitting = false;
          console.error(err);
        }
      });
    }
  }
  
  goBack(): void {
    if (this.creditId) {
      this.router.navigate(['/credits', this.creditId, 'repayments']);
    } else {
      this.router.navigate(['/credits']);
    }
  }
}
