import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Credit, CreditStatus } from '../models/credit.model';
import { PersonalCredit } from '../models/personal-credit.model';
import { RealEstateCredit } from '../models/real-estate-credit.model';
import { ProfessionalCredit } from '../models/professional-credit.model';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private apiUrl = 'http://localhost:8085/api/credits';

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) { }

  getCredits(): Observable<Credit[]> {
    return this.http.get<Credit[]>(this.apiUrl)
      .pipe(catchError(error => this.errorService.handleError(error)));
  }

  getCredit(id: number): Observable<Credit> {
    return this.http.get<Credit>(`${this.apiUrl}/${id}`)
      .pipe(catchError(error => this.errorService.handleError(error)));
  }

  getCreditsByClientId(clientId: number): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${this.apiUrl}/client/${clientId}`)
      .pipe(catchError(error => this.errorService.handleError(error)));
  }

  getCreditsByStatus(status: CreditStatus): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${this.apiUrl}/status/${status}`)
      .pipe(catchError(error => this.errorService.handleError(error)));
  }
  
  createPersonalCredit(credit: PersonalCredit): Observable<PersonalCredit> {
    return this.http.post<PersonalCredit>(`${this.apiUrl}/personal`, credit)
      .pipe(catchError(error => this.errorService.handleError(error)));
  }
  
  createRealEstateCredit(credit: RealEstateCredit): Observable<RealEstateCredit> {
    return this.http.post<RealEstateCredit>(`${this.apiUrl}/realestate`, credit)
      .pipe(catchError(error => this.errorService.handleError(error)));
  }
  
  createProfessionalCredit(credit: ProfessionalCredit): Observable<ProfessionalCredit> {
    return this.http.post<ProfessionalCredit>(`${this.apiUrl}/professional`, credit)
      .pipe(catchError(error => this.errorService.handleError(error)));
  }

  updateCreditStatus(id: number, status: CreditStatus): Observable<Credit> {
    return this.http.patch<Credit>(`${this.apiUrl}/${id}/status`, { status })
      .pipe(catchError(error => this.errorService.handleError(error)));
  }

  deleteCredit(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(catchError(error => this.errorService.handleError(error)));
  }
}
