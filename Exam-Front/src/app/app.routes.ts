import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/auth/login.component';
import { ClientListComponent } from './components/client/client-list.component';
import { ClientDetailComponent } from './components/client/client-detail.component';
import { ClientFormComponent } from './components/client/client-form.component';
import { CreditListComponent } from './components/credit/credit-list.component';
import { CreditDetailComponent } from './components/credit/credit-detail.component';
import { CreditFormComponent } from './components/credit/credit-form.component';
import { RepaymentListComponent } from './components/repayment/repayment-list.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [() => authGuard()],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      
      // Client routes
      { path: 'clients', component: ClientListComponent },
      { path: 'clients/new', component: ClientFormComponent },
      { path: 'clients/:id', component: ClientDetailComponent },
      { path: 'clients/:id/edit', component: ClientFormComponent },
      
      // Credit routes
      { path: 'credits', component: CreditListComponent },
      { path: 'credits/new', component: CreditFormComponent }, 
      { path: 'credits/:id', component: CreditDetailComponent },
      
      // Repayment routes
      { path: 'repayments', component: RepaymentListComponent }
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
