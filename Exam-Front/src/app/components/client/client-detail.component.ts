import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { CreditService } from '../../services/credit.service';
import { Client } from '../../models/client.model';
import { Credit } from '../../models/credit.model';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    
    <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
    
    <div *ngIf="client && !loading">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Client Details</h2>
        <div>
          <a [routerLink]="['/clients', client.id, 'edit']" class="btn btn-secondary me-2">
            Edit Client
          </a>
          <button class="btn btn-danger" (click)="deleteClient()">
            Delete Client
          </button>
        </div>
      </div>
      
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">{{ client.name }}</h5>
          <h6 class="card-subtitle mb-2 text-muted">{{ client.email }}</h6>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Credits</h5>
          <a [routerLink]="['/credits/new']" [queryParams]="{clientId: client.id}" class="btn btn-primary btn-sm">
            Add New Credit
          </a>
        </div>
        <div class="card-body">
          <div *ngIf="loadingCredits" class="text-center">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          
          <div class="table-responsive">
            <table class="table table-striped table-hover mb-0" *ngIf="!loadingCredits">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Duration (months)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let credit of credits">
                  <td>{{ credit.id }}</td>
                  <td>{{ credit.type }}</td>
                  <td>{{ credit.amount | currency:'USD' }}</td>
                  <td>{{ credit.duration }}</td>
                  <td>
                    <span [ngClass]="getStatusClass(credit.status)" class="badge">
                      {{ credit.status }}
                    </span>
                  </td>
                  <td>
                    <a [routerLink]="['/credits', credit.id]" class="btn btn-sm btn-outline-primary">
                      View
                    </a>
                  </td>
                </tr>
                <tr *ngIf="credits.length === 0">
                  <td colspan="6" class="text-center">No credits found for this client</td>
                </tr>
              </tbody>
            </table>
          </div>
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
export class ClientDetailComponent implements OnInit {
  client: Client | null = null;
  credits: Credit[] = [];
  loading = true;
  loadingCredits = true;
  error = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private creditService: CreditService
  ) { }
  
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadClient(id);
    } else {
      this.error = 'Invalid client ID';
      this.loading = false;
    }
  }
  
  loadClient(id: number): void {
    this.clientService.getClient(id).subscribe({
      next: (data) => {
        this.client = data;
        this.loading = false;
        this.loadCredits(id);
      },
      error: (err) => {
        this.error = 'Failed to load client. The client might not exist.';
        this.loading = false;
        console.error(err);
      }
    });
  }
  
  loadCredits(clientId: number): void {
    this.creditService.getCreditsByClientId(clientId).subscribe({
      next: (data) => {
        this.credits = data;
        this.loadingCredits = false;
      },
      error: (err) => {
        console.error('Failed to load credits', err);
        this.loadingCredits = false;
      }
    });
  }
  
  deleteClient(): void {
    if (!this.client || !this.client.id) return;
    
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientService.deleteClient(this.client.id).subscribe({
        next: () => {
          this.router.navigate(['/clients']);
        },
        error: (err) => {
          this.error = 'Failed to delete client. Please try again later.';
          console.error(err);
        }
      });
    }
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
