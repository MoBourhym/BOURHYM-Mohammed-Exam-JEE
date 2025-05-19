import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CreditService } from '../../services/credit.service';
import { Credit, CreditStatus } from '../../models/credit.model';

@Component({
  selector: 'app-credit-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Credits</h2>
      <a routerLink="/credits/new" class="btn btn-primary">
        <i class="bi bi-plus-circle"></i> New Credit
      </a>
    </div>
    
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            Filter Credits
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="statusFilter" class="form-label">Credit Status</label>
              <select id="statusFilter" class="form-select" [formControl]="statusFilter">
                <option value="">All Statuses</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            
            <div class="mb-3">
              <label for="typeFilter" class="form-label">Credit Type</label>
              <select id="typeFilter" class="form-select" [formControl]="typeFilter">
                <option value="">All Types</option>
                <option value="PERSONAL">Personal</option>
                <option value="REAL_ESTATE">Real Estate</option>
                <option value="PROFESSIONAL">Professional</option>
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
              <th>Type</th>
              <th>Amount</th>
              <th>Duration (months)</th>
              <th>Interest Rate</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let credit of filteredCredits">
              <td>{{ credit.id }}</td>
              <td>{{ credit.type }}</td>
              <td>{{ credit.amount | currency:'USD' }}</td>
              <td>{{ credit.duration }}</td>
              <td>{{ credit.interestRate | percent:'1.2' }}</td>
              <td>
                <span [ngClass]="getStatusClass(credit.status)" class="badge">
                  {{ credit.status }}
                </span>
              </td>
              <td>
                <div class="btn-group" role="group">
                  <a [routerLink]="['/credits', credit.id]" class="btn btn-sm btn-outline-primary">
                    View
                  </a>
                </div>
              </td>
            </tr>
            <tr *ngIf="filteredCredits.length === 0">
              <td colspan="7" class="text-center">No credits found</td>
            </tr>
          </tbody>
        </table>
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
export class CreditListComponent implements OnInit {
  credits: Credit[] = [];
  filteredCredits: Credit[] = [];
  loading = true;
  error = '';
  
  statusFilter = new FormControl('');
  typeFilter = new FormControl('');
  
  constructor(private creditService: CreditService) { }
  
  ngOnInit(): void {
    this.loadCredits();
    
    // Setup filters
    this.statusFilter.valueChanges.subscribe(() => this.applyFilters());
    this.typeFilter.valueChanges.subscribe(() => this.applyFilters());
  }
  
  loadCredits(): void {
    this.loading = true;
    this.creditService.getCredits().subscribe({
      next: (data) => {
        this.credits = data;
        this.filteredCredits = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load credits. Please try again later.';
        this.loading = false;
        console.error(err);
      }
    });
  }
  
  applyFilters(): void {
    const statusValue = this.statusFilter.value;
    const typeValue = this.typeFilter.value;
    
    this.filteredCredits = this.credits.filter(credit => {
      const matchesStatus = !statusValue || credit.status === statusValue;
      const matchesType = !typeValue || credit.type === typeValue;
      return matchesStatus && matchesType;
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
}
