import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Repayment } from '../models/repayment.model';

@Injectable({
  providedIn: 'root'
})
export class RepaymentService {
  private apiUrl = '/api/repayments';

  constructor(private http: HttpClient) { }

  getRepaymentsByCreditId(creditId: number): Observable<Repayment[]> {
    return this.http.get<Repayment[]>(`${this.apiUrl}/credit/${creditId}`);
  }

  createMonthlyRepayment(repayment: Repayment): Observable<Repayment> {
    return this.http.post<Repayment>(`${this.apiUrl}/monthly`, repayment);
  }

  createEarlyRepayment(repayment: Repayment): Observable<Repayment> {
    return this.http.post<Repayment>(`${this.apiUrl}/early`, repayment);
  }

  getTotalRepaidAmount(creditId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total/${creditId}`);
  }

  getRemainingAmount(creditId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/remaining/${creditId}`);
  }
}
