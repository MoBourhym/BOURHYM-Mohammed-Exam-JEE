import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div class="container">
          <a class="navbar-brand" routerLink="/">Banking Credit System</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/clients" routerLinkActive="active">Clients</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/credits" routerLinkActive="active">Credits</a>
              </li>
            </ul>
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <a class="nav-link" href="#" (click)="logout($event)">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
      <div class="container">
        <router-outlet></router-outlet>
      </div>
      
      <footer class="footer mt-5 py-3 bg-light">
        <div class="container text-center">
          <span class="text-muted">Banking Credit Management System &copy; 2025</span>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .footer {
      position: absolute;
      bottom: 0;
      width: 100%;
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
  }
  
  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
  }
}
