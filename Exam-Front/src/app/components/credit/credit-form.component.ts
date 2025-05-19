import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { CreditService } from '../../services/credit.service';
import { Client } from '../../models/client.model';
import { CreditStatus, PropertyType } from '../../models/credit.model';
import { PersonalCredit } from '../../models/personal-credit.model';
import { RealEstateCredit } from '../../models/real-estate-credit.model';
import { ProfessionalCredit } from '../../models/professional-credit.model';

@Component({
  selector: 'app-credit-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>New Credit</h2>
      <button class="btn btn-outline-secondary" (click)="goBack()">
        <i class="bi bi-arrow-left"></i> Back
      </button>
    </div>

    <div class="alert alert-info mb-4">
      <i class="bi bi-info-circle me-2"></i>
      Select a credit type to continue. Each credit type has specific requirements.
    </div>
    
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">Credit Information</h5>
      </div>
      <div class="card-body">
        <form [formGroup]="creditForm" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label for="creditType" class="form-label">Credit Type</label>
            <select id="creditType" class="form-select" formControlName="type" (change)="onCreditTypeChange()">
              <option value="">Select Credit Type</option>
              <option value="PERSONAL">Personal Credit</option>
              <option value="REAL_ESTATE">Real Estate Credit</option>
              <option value="PROFESSIONAL">Professional Credit</option>
            </select>
            <div *ngIf="submitted && f['type'].errors" class="text-danger">
              <small *ngIf="f['type'].errors['required']">Credit type is required</small>
            </div>
          </div>

          <div class="mb-3">
            <label for="clientId" class="form-label">Client</label>
            <select id="clientId" class="form-select" formControlName="clientId">
              <option value="">Select Client</option>
              <option *ngFor="let client of clients" [value]="client.id">
                {{ client.name }} ({{ client.email }})
              </option>
            </select>
            <div *ngIf="submitted && f['clientId'].errors" class="text-danger">
              <small *ngIf="f['clientId'].errors['required']">Client is required</small>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
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
                >
              </div>
              <div *ngIf="submitted && f['amount'].errors" class="text-danger">
                <small *ngIf="f['amount'].errors['required']">Amount is required</small>
                <small *ngIf="f['amount'].errors['min']">Amount must be greater than 0</small>
                <small *ngIf="f['amount'].errors['pattern']">Amount must be a valid number with up to 2 decimal places</small>
              </div>
            </div>
            
            <div class="col-md-6 mb-3">
              <label for="duration" class="form-label">Duration (months)</label>
              <input 
                type="number" 
                id="duration" 
                class="form-control" 
                formControlName="duration" 
                placeholder="12"
              >
              <div *ngIf="submitted && f['duration'].errors" class="text-danger">
                <small *ngIf="f['duration'].errors['required']">Duration is required</small>
                <small *ngIf="f['duration'].errors['min']">Duration must be at least 1 month</small>
                <small *ngIf="f['duration'].errors['max']">Duration must not exceed 360 months</small>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="interestRate" class="form-label">Interest Rate</label>
              <div class="input-group">
                <input 
                  type="number" 
                  id="interestRate" 
                  class="form-control" 
                  formControlName="interestRate" 
                  placeholder="0.05" 
                  step="0.001"
                >
                <span class="input-group-text">%</span>
              </div>
              <div *ngIf="submitted && f['interestRate'].errors" class="text-danger">
                <small *ngIf="f['interestRate'].errors['required']">Interest rate is required</small>
                <small *ngIf="f['interestRate'].errors['min']">Interest rate must be greater than 0</small>
                <small *ngIf="f['interestRate'].errors['max']">Interest rate must not exceed 30%</small>
              </div>
            </div>
            
            <div class="col-md-6 mb-3">
              <label for="startDate" class="form-label">Start Date</label>
              <input 
                type="date" 
                id="startDate" 
                class="form-control" 
                formControlName="startDate"
              >
              <div *ngIf="submitted && f['startDate'].errors" class="text-danger">
                <small *ngIf="f['startDate'].errors['required']">Start date is required</small>
                <small *ngIf="f['startDate'].errors['pastDate']">Start date cannot be in the past</small>
              </div>
            </div>
          </div>

          <!-- Personal Credit specific fields -->
          <div *ngIf="selectedCreditType === 'PERSONAL'" class="mb-3">
            <label for="motif" class="form-label">Motif / Reason</label>
            <textarea 
              id="motif" 
              class="form-control" 
              formControlName="motif" 
              rows="3"
              placeholder="Please specify the reason for this personal credit"
            ></textarea>
            <div *ngIf="submitted && f['motif'] && f['motif'].errors" class="text-danger">
              <small *ngIf="f['motif'].errors?.['required']">Motif is required</small>
            </div>
          </div>

          <!-- Real Estate Credit specific fields -->
          <div *ngIf="selectedCreditType === 'REAL_ESTATE'" class="mb-3">
            <label for="propertyType" class="form-label">Property Type</label>
            <select id="propertyType" class="form-select" formControlName="propertyType">
              <option value="">Select Property Type</option>
              <option value="APARTMENT">Apartment</option>
              <option value="HOUSE">House</option>
              <option value="COMMERCIAL">Commercial</option>
            </select>
            <div *ngIf="submitted && f['propertyType'] && f['propertyType'].errors" class="text-danger">
              <small *ngIf="f['propertyType'].errors?.['required']">Property type is required</small>
            </div>
          </div>

          <!-- Professional Credit specific fields -->
          <div *ngIf="selectedCreditType === 'PROFESSIONAL'">
            <div class="mb-3">
              <label for="reason" class="form-label">Business Reason</label>
              <textarea 
                id="reason" 
                class="form-control" 
                formControlName="reason" 
                rows="3"
                placeholder="Please specify the business reason for this credit"
              ></textarea>
              <div *ngIf="submitted && f['reason'] && f['reason'].errors" class="text-danger">
                <small *ngIf="f['reason'].errors?.['required']">Business reason is required</small>
              </div>
            </div>
            
            <div class="mb-3">
              <label for="companyName" class="form-label">Company Name</label>
              <input 
                type="text" 
                id="companyName" 
                class="form-control" 
                formControlName="companyName" 
                placeholder="Enter company name"
              >
              <div *ngIf="submitted && f['companyName'] && f['companyName'].errors" class="text-danger">
                <small *ngIf="f['companyName'].errors?.['required']">Company name is required</small>
              </div>
            </div>
          </div>

          <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
          
          <div class="d-grid gap-2 mt-4">
            <button type="submit" class="btn btn-primary" [disabled]="loading">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
              Create Credit
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CreditFormComponent implements OnInit {
  creditForm: FormGroup;
  clients: Client[] = [];
  selectedCreditType: string = '';
  submitted = false;
  loading = false;
  error = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private creditService: CreditService,
    private router: Router
  ) {
    // Initialize with common fields and enhanced validation
    this.creditForm = this.formBuilder.group({
      type: ['', Validators.required],
      clientId: ['', Validators.required],
      amount: [null, [
        Validators.required, 
        Validators.min(1),
        Validators.pattern(/^\d+(\.\d{1,2})?$/) // Allow only numbers with up to 2 decimal places
      ]],
      duration: [null, [
        Validators.required, 
        Validators.min(1),
        Validators.max(360) // Maximum 30 years (in months)
      ]],
      interestRate: [null, [
        Validators.required, 
        Validators.min(0.01),
        Validators.max(30) // Maximum reasonable interest rate
      ]],
      startDate: [new Date().toISOString().split('T')[0], [
        Validators.required,
        this.futureDateValidator()
      ]]
    });
  }

  // Custom validator to ensure date is not in the past
  futureDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
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
  
  ngOnInit(): void {
    this.loadClients();
  }
  
  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (err) => {
        this.error = 'Failed to load clients. Please try again later.';
        console.error(err);
      }
    });
  }
  
  onCreditTypeChange(): void {
    const selectedType = this.creditForm.get('type')?.value;
    this.selectedCreditType = selectedType;
    
    // Remove previous type-specific controls
    this.creditForm.removeControl('motif');
    this.creditForm.removeControl('propertyType');
    this.creditForm.removeControl('reason');
    this.creditForm.removeControl('companyName');
    
    // Add controls based on selected type
    if (selectedType === 'PERSONAL') {
      this.creditForm.addControl('motif', this.formBuilder.control('', Validators.required));
    } else if (selectedType === 'REAL_ESTATE') {
      this.creditForm.addControl('propertyType', this.formBuilder.control('', Validators.required));
    } else if (selectedType === 'PROFESSIONAL') {
      this.creditForm.addControl('reason', this.formBuilder.control('', Validators.required));
      this.creditForm.addControl('companyName', this.formBuilder.control('', Validators.required));
    }
  }
  
  get f() { return this.creditForm.controls; }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.creditForm.invalid) {
      return;
    }
    
    this.loading = true;
    const formData = this.creditForm.value;
    
    // Format the data for API
    const baseData = {
      amount: formData.amount,
      duration: formData.duration,
      interestRate: formData.interestRate / 100, // Convert to decimal for API
      startDate: new Date(formData.startDate),
      clientId: Number(formData.clientId),
      status: CreditStatus.IN_PROGRESS
    };
    
    // Create the appropriate credit object based on type
    let serviceCall;
    
    switch (formData.type) {
      case 'PERSONAL':
        const personalCredit = new PersonalCredit({
          ...baseData,
          motif: formData.motif
        });
        serviceCall = this.creditService.createPersonalCredit(personalCredit);
        break;
        
      case 'REAL_ESTATE':
        const realEstateCredit = new RealEstateCredit({
          ...baseData,
          propertyType: formData.propertyType
        });
        serviceCall = this.creditService.createRealEstateCredit(realEstateCredit);
        break;
        
      case 'PROFESSIONAL':
        const professionalCredit = new ProfessionalCredit({
          ...baseData,
          reason: formData.reason,
          companyName: formData.companyName
        });
        serviceCall = this.creditService.createProfessionalCredit(professionalCredit);
        break;
    }
    
    if (serviceCall) {
      // Use type assertion to resolve union type issue
      (serviceCall as any).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/credits']);
        },
        error: (error: any) => {
          this.error = 'Failed to create credit. Please try again.';
          this.loading = false;
          console.error(error);
        }
      });
    }
  }
  
  goBack(): void {
    this.router.navigate(['/credits']);
  }
}
