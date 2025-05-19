import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { CreditService } from '../../services/credit.service';
import { Client } from '../../models/client.model';
import { Credit, CreditStatus } from '../../models/credit.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="row mb-4">
      <div class="col-12">
        <h2>Dashboard</h2>
        <p>Welcome to the Banking Credit Management System</p>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card text-white bg-primary">
          <div class="card-body">
            <h5 class="card-title">Total Clients</h5>
            <p class="card-text display-6">{{ clients.length }}</p>
            <a routerLink="/clients" class="btn btn-light">View Clients</a>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card text-white bg-success">
          <div class="card-body">
            <h5 class="card-title">Total Credits</h5>
            <p class="card-text display-6">{{ credits.length }}</p>
            <a routerLink="/credits" class="btn btn-light">View Credits</a>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card text-white bg-info">
          <div class="card-body">
            <h5 class="card-title">Accepted Credits</h5>
            <p class="card-text display-6">{{ getAcceptedCreditsCount() }}</p>
            <a routerLink="/credits" [queryParams]="{status: 'ACCEPTED'}" class="btn btn-light">View Accepted</a>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            Recent Clients
          </div>
          <div class="card-body">
            <div *ngIf="loading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <ul class="list-group" *ngIf="!loading">
              <li *ngFor="let client of clients.slice(0, 5)" class="list-group-item d-flex justify-content-between align-items-center">
                {{ client.name }}
                <a [routerLink]="['/clients', client.id]" class="btn btn-sm btn-outline-primary">View</a>
              </li>
              <li *ngIf="clients.length === 0" class="list-group-item">No clients found</li>
            </ul>
          </div>
          <div class="card-footer text-end">
            <a routerLink="/clients" class="btn btn-primary">See All Clients</a>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            Recent Credits
          </div>
          <div class="card-body">
            <div *ngIf="loading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <ul class="list-group" *ngIf="!loading">
              <li *ngFor="let credit of credits.slice(0, 5)" class="list-group-item d-flex justify-content-between align-items-center">
                Credit #{{ credit.id }} - {{ credit.amount | currency:'USD' }}
                <span [ngClass]="getStatusClass(credit.status)" class="badge">{{ credit.status }}</span>
                <a [routerLink]="['/credits', credit.id]" class="btn btn-sm btn-outline-primary">View</a>
              </li>
              <li *ngIf="credits.length === 0" class="list-group-item">No credits found</li>
            </ul>
          </div>
          <div class="card-footer text-end">
            <a routerLink="/credits" class="btn btn-primary">See All Credits</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .badge {
      padding: 0.5em 0.8em;
    }
  `]
})
export class DashboardComponent implements OnInit {
  clients: Client[] = [];
  credits: Credit[] = [];
  loading = true;
  
  constructor(
    private clientService: ClientService,
    private creditService: CreditService
  ) { }
  
  ngOnInit(): void {
    this.loadData();
  }
  
  loadData(): void {
    // Get clients
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching clients', error);
        this.loading = false;
      }
    });
    
    // Get credits
    this.creditService.getCredits().subscribe({
      next: (data) => {
        this.credits = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching credits', error);
        this.loading = false;
      }
    });
  }
  
  getAcceptedCreditsCount(): number {
    return this.credits.filter(c => c.status === CreditStatus.ACCEPTED).length;
  }
  
  getStatusClass(status: CreditStatus): string {
    switch (status) {
      case CreditStatus.ACCEPTED:
        return 'bg-success';
      case CreditStatus.REJECTED:
        return 'bg-danger';
      case CreditStatus.IN_PROGRESS:
      default:
        return 'bg-warning';
    }
  }
}
