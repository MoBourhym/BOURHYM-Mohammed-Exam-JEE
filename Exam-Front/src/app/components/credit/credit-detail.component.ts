import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreditService } from '../../services/credit.service';
import { RepaymentService } from '../../services/repayment.service';
import { Credit, CreditStatus, RepaymentType } from '../../models/credit.model';
import { Repayment } from '../../models/repayment.model';

@Component({
  selector: 'app-credit-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Credit Details</h2>
      <div>
        <button class="btn btn-outline-secondary me-2" (click)="goBack()">
          <i class="bi bi-arrow-left"></i> Back
        </button>
      </div>
    </div>

    <div *ngIf="loading" class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    
    <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
    
    <div class="row" *ngIf="!loading && credit">
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-header d-flex justify-content-between">
            <h5 class="mb-0">Credit Information</h5>
            <span [ngClass]="getStatusClass(credit.status)" class="badge">{{ credit.status }}</span>
          </div>
          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between">
                <span>ID:</span>
                <span class="fw-bold">{{ credit.id }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span>Type:</span>
                <span class="fw-bold">{{ credit.type }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span>Amount:</span>
                <span class="fw-bold">{{ credit.amount | currency:'USD' }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span>Duration:</span>
                <span class="fw-bold">{{ credit.duration }} months</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span>Interest Rate:</span>
                <span class="fw-bold">{{ credit.interestRate | percent:'1.2' }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span>Start Date:</span>
                <span class="fw-bold">{{ credit.startDate | date:'mediumDate' }}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Additional information based on credit type -->
        <div class="card mb-4" *ngIf="credit.type === 'PERSONAL'">
          <div class="card-header">
            <h5 class="mb-0">Personal Credit Details</h5>
          </div>
          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between">
                <span>Motif:</span>
                <span class="fw-bold">{{ credit.motif }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="card mb-4" *ngIf="credit.type === 'REAL_ESTATE'">
          <div class="card-header">
            <h5 class="mb-0">Real Estate Credit Details</h5>
          </div>
          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between">
                <span>Property Type:</span>
                <span class="fw-bold">{{ credit.propertyType }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="card mb-4" *ngIf="credit.type === 'PROFESSIONAL'">
          <div class="card-header">
            <h5 class="mb-0">Professional Credit Details</h5>
          </div>
          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between">
                <span>Reason:</span>
                <span class="fw-bold">{{ credit.reason }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span>Company Name:</span>
                <span class="fw-bold">{{ credit.companyName }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Repayments</h5>
            <button 
              *ngIf="credit.status === 'ACCEPTED'" 
              class="btn btn-sm btn-success" 
              data-bs-toggle="modal" 
              data-bs-target="#addRepaymentModal">
              Add Repayment
            </button>
          </div>
          <div class="card-body">
            <div *ngIf="loadingRepayments" class="text-center my-3">
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            
            <div *ngIf="repaymentError" class="alert alert-danger">{{ repaymentError }}</div>
            
            <div class="table-responsive">
              <table class="table table-sm" *ngIf="!loadingRepayments">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let repayment of repayments">
                    <td>{{ repayment.date | date:'mediumDate' }}</td>
                    <td>{{ repayment.amount | currency:'USD' }}</td>
                    <td>{{ repayment.type }}</td>
                  </tr>
                  <tr *ngIf="repayments.length === 0">
                    <td colspan="3" class="text-center">No repayments yet</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-6">
            <div class="card mb-4">
              <div class="card-body text-center">
                <h5>Total Repaid</h5>
                <h3 class="text-success">{{ totalRepaid | currency:'USD' }}</h3>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card mb-4">
              <div class="card-body text-center">
                <h5>Remaining Amount</h5>
                <h3 class="text-primary">{{ remainingAmount | currency:'USD' }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Repayment Modal -->
    <div class="modal fade" id="addRepaymentModal" tabindex="-1" aria-labelledby="addRepaymentModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form [formGroup]="repaymentForm" (ngSubmit)="onSubmitRepayment()">
            <div class="modal-header">
              <h5 class="modal-title" id="addRepaymentModalLabel">Add Repayment</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div *ngIf="repaymentSubmitError" class="alert alert-danger">{{ repaymentSubmitError }}</div>
              
              <div class="mb-3">
                <label for="repaymentType" class="form-label">Repayment Type</label>
                <select id="repaymentType" class="form-select" formControlName="type">
                  <option [value]="RepaymentType.MONTHLY">Monthly</option>
                  <option [value]="RepaymentType.EARLY">Early</option>
                </select>
              </div>
              
              <div class="mb-3">
                <label for="repaymentAmount" class="form-label">Amount</label>
                <input type="number" id="repaymentAmount" class="form-control" formControlName="amount" placeholder="0.00" step="0.01">
                <div *ngIf="repaymentForm.get('amount')?.touched && repaymentForm.get('amount')?.errors" class="text-danger">
                  <small *ngIf="repaymentForm.get('amount')?.errors?.['required']">Amount is required</small>
                  <small *ngIf="repaymentForm.get('amount')?.errors?.['min']">Amount must be greater than 0</small>
                </div>
              </div>
              
              <div class="mb-3">
                <label for="repaymentDate" class="form-label">Date</label>
                <input type="date" id="repaymentDate" class="form-control" formControlName="date">
                <div *ngIf="repaymentForm.get('date')?.touched && repaymentForm.get('date')?.errors" class="text-danger">
                  <small *ngIf="repaymentForm.get('date')?.errors?.['required']">Date is required</small>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="repaymentForm.invalid || submittingRepayment">
                <span *ngIf="submittingRepayment" class="spinner-border spinner-border-sm me-1"></span>
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .badge {
      padding: 0.5em 0.8em;
    }
    .bg-success {
      background-color: #28a745;
    }
    .bg-danger {
      background-color: #dc3545;
    }
    .bg-warning {
      background-color: #ffc107;
      color: #212529;
    }
  `]
})
export class CreditDetailComponent implements OnInit {
  credit: any;
  repayments: Repayment[] = [];
  loading = true;
  loadingRepayments = true;
  error = '';
  repaymentError = '';
  repaymentSubmitError = '';
  totalRepaid = 0;
  remainingAmount = 0;
  RepaymentType = RepaymentType; // Make enum available in the template
  
  repaymentForm: FormGroup;
  submittingRepayment = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private creditService: CreditService,
    private repaymentService: RepaymentService,
    private formBuilder: FormBuilder
  ) {
    this.repaymentForm = this.formBuilder.group({
      type: [RepaymentType.MONTHLY, Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      date: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const creditId = Number(params.get('id'));
      if (creditId) {
        this.loadCredit(creditId);
      }
    });
  }
  
  loadCredit(id: number): void {
    this.loading = true;
    this.creditService.getCredit(id).subscribe({
      next: (data) => {
        this.credit = data;
        this.loading = false;
        this.loadRepayments(id);
        this.loadTotalRepaid(id);
        this.loadRemainingAmount(id);
      },
      error: (err) => {
        this.error = 'Failed to load credit details. Please try again later.';
        this.loading = false;
        console.error(err);
      }
    });
  }
  
  loadRepayments(creditId: number): void {
    this.loadingRepayments = true;
    this.repaymentService.getRepaymentsByCreditId(creditId).subscribe({
      next: (data) => {
        this.repayments = data;
        this.loadingRepayments = false;
      },
      error: (err) => {
        this.repaymentError = 'Failed to load repayments.';
        this.loadingRepayments = false;
        console.error(err);
      }
    });
  }
  
  loadTotalRepaid(creditId: number): void {
    this.repaymentService.getTotalRepaidAmount(creditId).subscribe({
      next: (data) => {
        this.totalRepaid = data;
      },
      error: (err) => {
        console.error('Failed to load total repaid amount', err);
      }
    });
  }
  
  loadRemainingAmount(creditId: number): void {
    this.repaymentService.getRemainingAmount(creditId).subscribe({
      next: (data) => {
        this.remainingAmount = data;
      },
      error: (err) => {
        console.error('Failed to load remaining amount', err);
      }
    });
  }
  
  onSubmitRepayment(): void {
    if (this.repaymentForm.invalid) {
      return;
    }
    
    this.submittingRepayment = true;
    this.repaymentSubmitError = '';
    
    const repayment: Repayment = {
      date: new Date(this.repaymentForm.value.date),
      amount: this.repaymentForm.value.amount,
      type: this.repaymentForm.value.type,
      creditId: this.credit.id
    };
    
    // Choose the appropriate service method based on the type
    const serviceMethod = repayment.type === RepaymentType.MONTHLY
      ? this.repaymentService.createMonthlyRepayment(repayment)
      : this.repaymentService.createEarlyRepayment(repayment);
      
    serviceMethod.subscribe({
      next: () => {
        this.submittingRepayment = false;
        this.repaymentForm.reset({
          type: RepaymentType.MONTHLY,
          date: new Date().toISOString().split('T')[0]
        });
        
        // Close modal
        document.getElementById('addRepaymentModal')?.click();
        
        // Reload data
        this.loadRepayments(this.credit.id);
        this.loadTotalRepaid(this.credit.id);
        this.loadRemainingAmount(this.credit.id);
      },
      error: (err) => {
        this.repaymentSubmitError = 'Failed to save repayment. Please try again.';
        this.submittingRepayment = false;
        console.error(err);
      }
    });
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-success';
      case 'REJECTED':
        return 'bg-danger';
      case 'IN_PROGRESS':
      default:
        return 'bg-warning';
    }
  }
  
  goBack(): void {
    this.router.navigate(['/credits']);
  }
}
