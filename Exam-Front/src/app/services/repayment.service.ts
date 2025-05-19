import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Repayment } from '../models/repayment.model';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class RepaymentService {
  private apiUrl = 'http://localhost:8085/api/repayments';

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) { }

  getRepaymentsByCreditId(creditId: number): Observable<Repayment[]> {
    return this.http.get<Repayment[]>(`${this.apiUrl}/credit/${creditId}`)
      .pipe(catchError(error => this.errorService.handleError(error)));
  }

  createMonthlyRepayment(repayment: Repayment): Observable<Repayment> {
    return this.http.post<Repayment>(`${this.apiUrl}/monthly`, repayment)
      .pipe(catchError(error => this.errorService.handleError(error)));
  }

  createEarlyRepayment(repayment: Repayment): Observable<Repayment> {
    return this.http.post<Repayment>(`${this.apiUrl}/early`, repayment)
      .pipe(catchError(error => this.errorService.handleError(error)));
  }

  getTotalRepaidAmount(creditId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total/${creditId}`)
      .pipe(catchError(error => this.errorService.handleError(error)));
  }

  getRemainingAmount(creditId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/remaining/${creditId}`)
      .pipe(catchError(error => this.errorService.handleError(error)));
  }
}
