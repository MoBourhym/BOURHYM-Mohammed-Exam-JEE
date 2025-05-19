import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Clients</h2>
      <a routerLink="/clients/new" class="btn btn-primary">
        <i class="bi bi-plus-circle"></i> New Client
      </a>
    </div>
    
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search clients by name..." 
            [formControl]="searchControl"
          >
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
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let client of clients">
              <td>{{ client.id }}</td>
              <td>{{ client.name }}</td>
              <td>{{ client.email }}</td>
              <td>
                <div class="btn-group" role="group">
                  <a [routerLink]="['/clients', client.id]" class="btn btn-sm btn-outline-primary">
                    View
                  </a>
                  <a [routerLink]="['/clients', client.id, 'edit']" class="btn btn-sm btn-outline-secondary">
                    Edit
                  </a>
                </div>
              </td>
            </tr>
            <tr *ngIf="clients.length === 0">
              <td colspan="4" class="text-center">No clients found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  loading = true;
  error = '';
  searchControl = new FormControl('');
  
  constructor(private clientService: ClientService) { }
  
  ngOnInit(): void {
    this.loadClients();
    
    // Setup search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value) {
          this.searchClients(value);
        } else {
          this.loadClients();
        }
      });
  }
  
  loadClients(): void {
    this.loading = true;
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load clients. Please try again later.';
        this.loading = false;
        console.error(err);
      }
    });
  }
  
  searchClients(name: string): void {
    this.loading = true;
    this.clientService.searchClientsByName(name).subscribe({
      next: (data) => {
        this.clients = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to search clients. Please try again later.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
