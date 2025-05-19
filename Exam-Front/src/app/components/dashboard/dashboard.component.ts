import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { CreditService } from '../../services/credit.service';
import { DashboardService, CreditStats, CreditByTypeData } from '../../services/dashboard.service';
import { Client } from '../../models/client.model';
import { Credit, CreditStatus, CreditType } from '../../models/credit.model';
import { ErrorMessageComponent } from '../shared/error-message.component';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ErrorMessageComponent],
  template: `
    <div class="row mb-4">
      <div class="col-12">
        <h2>Dashboard</h2>
        <p>Welcome to the Banking Credit Management System</p>
        <app-error-message [message]="error"></app-error-message>
      </div>
    </div>

    <div *ngIf="loading" class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading dashboard data...</p>
    </div>
    
    <div *ngIf="!loading">
      <!-- Stats Overview -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card text-white bg-primary h-100">
            <div class="card-body">
              <h5 class="card-title">Total Clients</h5>
              <p class="card-text display-6">{{ clientCount }}</p>
              <a routerLink="/clients" class="btn btn-light">View Clients</a>
            </div>
          </div>
        </div>
        
        <div class="col-md-3">
          <div class="card text-white bg-success h-100">
            <div class="card-body">
              <h5 class="card-title">Total Credits</h5>
              <p class="card-text display-6">{{ creditStats?.totalCredits || 0 }}</p>
              <a routerLink="/credits" class="btn btn-light">View Credits</a>
            </div>
          </div>
        </div>
        
        <div class="col-md-3">
          <div class="card text-white bg-info h-100">
            <div class="card-body">
              <h5 class="card-title">Accepted Credits</h5>
              <p class="card-text display-6">{{ creditStats?.acceptedCredits || 0 }}</p>
              <a routerLink="/credits" [queryParams]="{status: 'ACCEPTED'}" class="btn btn-light">View Accepted</a>
            </div>
          </div>
        </div>
        
        <div class="col-md-3">
          <div class="card text-white bg-warning h-100">
            <div class="card-body">
              <h5 class="card-title">Total Credit Amount</h5>
              <p class="card-text display-6">{{ creditStats?.totalAmount | currency:'USD':'symbol':'1.0-0' }}</p>
              <p class="card-text">Average: {{ creditStats?.averageAmount | currency:'USD':'symbol':'1.0-0' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="row mb-4">
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-header">
              Credit Status Distribution
            </div>
            <div class="card-body">
              <canvas #statusChart></canvas>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-header">
              Credit Types Distribution
            </div>
            <div class="card-body">
              <canvas #typeChart></canvas>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Recent Activity Section -->
      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Recent Clients</h5>
              <a routerLink="/clients" class="btn btn-sm btn-primary">Add New</a>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let client of clients.slice(0, 5)">
                      <td>{{ client.firstName }} {{ client.lastName }}</td>
                      <td>{{ client.email }}</td>
                      <td>
                        <a [routerLink]="['/clients', client.id]" class="btn btn-sm btn-outline-primary">View</a>
                      </td>
                    </tr>
                    <tr *ngIf="clients.length === 0">
                      <td colspan="3" class="text-center">No clients found</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="card-footer text-end">
              <a routerLink="/clients" class="btn btn-primary">See All Clients</a>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Recent Credits</h5>
              <a routerLink="/credits/new" class="btn btn-sm btn-primary">Add New</a>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let credit of credits.slice(0, 5)">
                      <td>#{{ credit.id }}</td>
                      <td>{{ credit.type }}</td>
                      <td>{{ credit.amount | currency:'USD' }}</td>
                      <td>
                        <span [ngClass]="getStatusClass(credit.status)" class="badge">
                          {{ credit.status }}
                        </span>
                      </td>
                      <td>
                        <a [routerLink]="['/credits', credit.id]" class="btn btn-sm btn-outline-primary">View</a>
                      </td>
                    </tr>
                    <tr *ngIf="credits.length === 0">
                      <td colspan="5" class="text-center">No credits found</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
