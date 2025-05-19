import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RepaymentService } from '../../services/repayment.service';
import { CreditService } from '../../services/credit.service';
import { Credit } from '../../models/credit.model';
import { Repayment } from '../../models/repayment.model';

@Component({
  selector: 'app-repayment-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Repayments</h2>
    </div>
    
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            Filter by Credit
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="creditFilter" class="form-label">Select Credit</label>
              <select id="creditFilter" class="form-select" [formControl]="creditFilter">
                <option value="">All Credits</option>
                <option *ngFor="let credit of credits" [value]="credit.id">
                  ID: {{ credit.id }} - {{ credit.amount | currency:'USD' }} ({{ credit.type }})
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="loading" class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    
    <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
    
    <div class="card" *ngIf="!loading">
      <div class="table-responsive">
        <table class="table table-striped table-hover mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Credit ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let repayment of filteredRepayments">
              <td>{{ repayment.id }}</td>
              <td>
                <a [routerLink]="['/credits', repayment.creditId]">
                  {{ repayment.creditId }}
                </a>
              </td>
              <td>{{ repayment.date | date:'mediumDate' }}</td>
              <td>{{ repayment.amount | currency:'USD' }}</td>
              <td>{{ repayment.type }}</td>
            </tr>
            <tr *ngIf="filteredRepayments.length === 0">
              <td colspan="5" class="text-center">No repayments found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class RepaymentListComponent implements OnInit {
  repayments: Repayment[] = [];
  filteredRepayments: Repayment[] = [];
  credits: Credit[] = [];
  loading = true;
  error = '';
  
  creditFilter = new FormControl('');
  
  constructor(
    private repaymentService: RepaymentService,
    private creditService: CreditService
  ) { }
  
  ngOnInit(): void {
    this.loadCredits();
    this.loadAllRepayments();
    
    // Setup filters
    this.creditFilter.valueChanges.subscribe((value) => {
      this.filterRepayments(value);
    });
  }
  
  loadCredits(): void {
    this.creditService.getCredits().subscribe({
      next: (data) => {
        this.credits = data;
      },
      error: (err) => {
        console.error('Failed to load credits', err);
      }
    });
  }
  
  loadAllRepayments(): void {
    // In a real application, we might have an endpoint to get all repayments
    // Here we're loading credits first, then loading repayments for each credit
    this.loading = true;
    
    this.creditService.getCredits().subscribe({
      next: (credits) => {
        if (credits.length === 0) {
          this.loading = false;
          return;
        }
        
        let loadedCount = 0;
        const allRepayments: Repayment[] = [];
        
        credits.forEach(credit => {
          this.repaymentService.getRepaymentsByCreditId(credit.id!).subscribe({
            next: (repayments) => {
              allRepayments.push(...repayments);
              loadedCount++;
              
              if (loadedCount === credits.length) {
                this.repayments = allRepayments;
                this.filteredRepayments = allRepayments;
                this.loading = false;
              }
            },
            error: () => {
              loadedCount++;
              if (loadedCount === credits.length) {
                this.repayments = allRepayments;
                this.filteredRepayments = allRepayments;
                this.loading = false;
              }
            }
          });
        });
      },
      error: (err) => {
        this.error = 'Failed to load repayments. Please try again later.';
        this.loading = false;
        console.error(err);
      }
    });
  }
  
  filterRepayments(creditId: string | null): void {
    if (!creditId) {
      this.filteredRepayments = this.repayments;
      return;
    }
    
    this.filteredRepayments = this.repayments.filter(
      repayment => repayment.creditId === Number(creditId)
    );
  }
}
